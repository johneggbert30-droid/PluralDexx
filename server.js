const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PORT = Number(process.env.PORT || 8787);
const JWT_SECRET = process.env.CYBERDECK_JWT_SECRET || "change-this-secret-for-production";
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "social-db.json");
const FRONTEND_DIR = path.join(__dirname, "..");
const PRIVACY_TIERS = ["public", "friends", "trusted", "private"];

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], requests: [] }, null, 2));
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function makeId() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

function sanitizeUsername(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
}

function normalizePrivacyTier(value, fallback = "private") {
  const normalized = String(value || "").trim().toLowerCase();
  return PRIVACY_TIERS.includes(normalized) ? normalized : fallback;
}

function defaultPrivacy() {
  return {
    username: "public",
    email: "private",
    displayName: "friends",
    status: "friends",
    fronts: "friends",
    pluraldex: "trusted",
    scrapbook: "trusted",
    timeline: "friends",
    triggers: "private"
  };
}

function normalizePrivacyObject(value) {
  const fallback = defaultPrivacy();
  const raw = value && typeof value === "object" ? value : {};
  return {
    username: normalizePrivacyTier(raw.username, fallback.username),
    email: normalizePrivacyTier(raw.email, fallback.email),
    displayName: normalizePrivacyTier(raw.displayName, fallback.displayName),
    status: normalizePrivacyTier(raw.status, fallback.status),
    fronts: normalizePrivacyTier(raw.fronts, fallback.fronts),
    pluraldex: normalizePrivacyTier(raw.pluraldex, fallback.pluraldex),
    scrapbook: normalizePrivacyTier(raw.scrapbook, fallback.scrapbook),
    timeline: normalizePrivacyTier(raw.timeline, fallback.timeline),
    triggers: normalizePrivacyTier(raw.triggers, fallback.triggers)
  };
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    status: user.status,
    privacy: normalizePrivacyObject(user.privacy),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
}

function authMiddleware(req, res, next) {
  const header = String(req.headers.authorization || "");
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ message: "Missing bearer token." });
  }
  try {
    const payload = jwt.verify(match[1], JWT_SECRET);
    const db = readDb();
    const user = db.users.find(entry => entry.id === payload.sub);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }
    req.db = db;
    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

function getRelationship(requestRow, viewerId) {
  if (!requestRow || requestRow.status !== "accepted") {
    return { isSelf: false, isFriend: false, isTrusted: false };
  }
  const isFromSide = requestRow.fromUser === viewerId;
  return {
    isSelf: false,
    isFriend: true,
    isTrusted: isFromSide ? !!requestRow.trustedByFrom : !!requestRow.trustedByTo
  };
}

function canAccessTier(tier, relation) {
  const normalized = normalizePrivacyTier(tier, "private");
  if (relation.isSelf) return true;
  if (normalized === "public") return true;
  if (normalized === "friends") return relation.isFriend;
  if (normalized === "trusted") return relation.isTrusted;
  return false;
}

function visibleProfile(viewer, targetUser, requestRow) {
  const relation = viewer.id === targetUser.id
    ? { isSelf: true, isFriend: true, isTrusted: true }
    : getRelationship(requestRow, viewer.id);
  const privacy = normalizePrivacyObject(targetUser.privacy);
  return {
    userId: targetUser.id,
    username: canAccessTier(privacy.username, relation) ? targetUser.username : "Hidden",
    email: canAccessTier(privacy.email, relation) ? targetUser.email : "",
    displayName: canAccessTier(privacy.displayName, relation) ? targetUser.displayName : "Hidden",
    status: canAccessTier(privacy.status, relation) ? targetUser.status : "Hidden",
    trusted: relation.isTrusted
  };
}

function friendRequestForUser(db, userId, otherUserId) {
  return db.requests.find(request => (
    ((request.fromUser === userId && request.toUser === otherUserId) ||
    (request.fromUser === otherUserId && request.toUser === userId)) &&
    request.status === "accepted"
  )) || null;
}

function filterModuleByPrivacy(moduleName, data, viewer, targetUser, requestRow) {
  const relation = viewer.id === targetUser.id
    ? { isSelf: true, isFriend: true, isTrusted: true }
    : getRelationship(requestRow, viewer.id);
  const privacy = normalizePrivacyObject(targetUser.privacy);
  const moduleTier = privacy[moduleName];
  
  if (!canAccessTier(moduleTier, relation)) {
    return null;
  }
  return data;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "cyberdeck-social-backend" });
});

app.post("/api/auth/signup", async (req, res) => {
  const db = readDb();
  const email = String(req.body && req.body.email || "").trim().toLowerCase();
  const password = String(req.body && req.body.password || "").trim();
  const username = sanitizeUsername(req.body && req.body.username);
  if (!email || !password || !username) {
    return res.status(400).json({ message: "Email, password, and username are required." });
  }
  if (db.users.some(user => user.email === email)) {
    return res.status(409).json({ message: "Email already exists." });
  }
  if (db.users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: makeId(),
    email,
    username,
    passwordHash,
    displayName: username,
    status: "online",
    privacy: defaultPrivacy(),
    modules: {
      fronts: null,
      pluraldex: null,
      scrapbook: null,
      timeline: null,
      triggers: null
    },
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  db.users.push(user);
  writeDb(db);
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const db = readDb();
  const email = String(req.body && req.body.email || "").trim().toLowerCase();
  const password = String(req.body && req.body.password || "").trim();
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  const user = db.users.find(entry => entry.email === email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }
  user.updatedAt = nowIso();
  writeDb(db);
  res.json({ token: signToken(user), user: publicUser(user) });
});

app.post("/api/auth/logout", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/me", authMiddleware, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.put("/api/profile", authMiddleware, (req, res) => {
  const displayName = String(req.body && req.body.displayName || req.user.displayName || "").trim() || req.user.username;
  const status = String(req.body && req.body.status || req.user.status || "online").trim() || "online";
  const privacy = normalizePrivacyObject(req.body && req.body.privacy);
  req.user.displayName = displayName;
  req.user.status = status;
  req.user.privacy = privacy;
  req.user.updatedAt = nowIso();
  writeDb(req.db);
  res.json({ user: publicUser(req.user) });
});

app.get("/api/network", authMiddleware, (req, res) => {
  const incoming = req.db.requests
    .filter(request => request.toUser === req.user.id && request.status === "pending")
    .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)))
    .map(request => {
      const sender = req.db.users.find(user => user.id === request.fromUser);
      return {
        id: request.id,
        createdAt: request.createdAt,
        username: sender ? sender.username : "unknown",
        displayName: sender ? sender.displayName : "Unknown user"
      };
    });

  const accepted = req.db.requests
    .filter(request => request.status === "accepted" && (request.fromUser === req.user.id || request.toUser === req.user.id))
    .sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)));

  const friends = accepted.map(request => {
    const otherUserId = request.fromUser === req.user.id ? request.toUser : request.fromUser;
    const otherUser = req.db.users.find(user => user.id === otherUserId);
    const visible = otherUser ? visibleProfile(req.user, otherUser, request) : {
      userId: otherUserId,
      username: "Hidden",
      email: "",
      displayName: "Hidden",
      status: "Hidden",
      trusted: false
    };
    return {
      requestId: request.id,
      username: visible.username,
      email: visible.email,
      displayName: visible.displayName,
      status: visible.status,
      trusted: visible.trusted
    };
  });

  res.json({ self: publicUser(req.user), incoming, friends });
});

app.post("/api/friends/request", authMiddleware, (req, res) => {
  const username = sanitizeUsername(req.body && req.body.username);
  if (!username) {
    return res.status(400).json({ message: "Target username is required." });
  }
  if (username === req.user.username) {
    return res.status(400).json({ message: "You cannot friend yourself." });
  }
  const target = req.db.users.find(user => user.username === username);
  if (!target) {
    return res.status(404).json({ message: `No account found for @${username}.` });
  }

  const existing = req.db.requests.find(request => (
    (request.fromUser === req.user.id && request.toUser === target.id) ||
    (request.fromUser === target.id && request.toUser === req.user.id)
  ));
  if (existing && ["pending", "accepted"].includes(existing.status)) {
    return res.status(409).json({ message: "A request already exists between these accounts." });
  }

  req.db.requests.push({
    id: makeId(),
    fromUser: req.user.id,
    toUser: target.id,
    status: "pending",
    trustedByFrom: false,
    trustedByTo: false,
    createdAt: nowIso(),
    updatedAt: nowIso()
  });
  writeDb(req.db);
  res.status(201).json({ ok: true });
});

app.patch("/api/friends/request/:id", authMiddleware, (req, res) => {
  const request = req.db.requests.find(entry => entry.id === req.params.id);
  if (!request || (request.fromUser !== req.user.id && request.toUser !== req.user.id)) {
    return res.status(404).json({ message: "Friend request not found." });
  }
  const status = String(req.body && req.body.status || "").trim().toLowerCase();
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be accepted or rejected." });
  }
  request.status = status;
  request.updatedAt = nowIso();
  writeDb(req.db);
  res.json({ ok: true });
});

app.delete("/api/friends/request/:id", authMiddleware, (req, res) => {
  const request = req.db.requests.find(entry => entry.id === req.params.id);
  if (!request || (request.fromUser !== req.user.id && request.toUser !== req.user.id)) {
    return res.status(404).json({ message: "Friend relationship not found." });
  }
  req.db.requests = req.db.requests.filter(entry => entry.id !== request.id);
  writeDb(req.db);
  res.json({ ok: true });
});

app.patch("/api/friends/request/:id/trust", authMiddleware, (req, res) => {
  const request = req.db.requests.find(entry => entry.id === req.params.id);
  if (!request || (request.fromUser !== req.user.id && request.toUser !== req.user.id)) {
    return res.status(404).json({ message: "Friend relationship not found." });
  }
  if (request.status !== "accepted") {
    return res.status(400).json({ message: "Can only trust accepted friends." });
  }
  const trusted = req.body && Boolean(req.body.trusted);
  if (request.fromUser === req.user.id) {
    request.trustedByFrom = trusted;
  } else {
    request.trustedByTo = trusted;
  }
  request.updatedAt = nowIso();
  writeDb(req.db);
  res.json({ ok: true });
});

app.get("/api/user/:username", authMiddleware, (req, res) => {
  const username = sanitizeUsername(req.params.username);
  const target = req.db.users.find(user => user.username === username);
  if (!target) {
    return res.status(404).json({ message: "User not found." });
  }
  const request = friendRequestForUser(req.db, req.user.id, target.id);
  const visible = visibleProfile(req.user, target, request);
  res.json({ user: visible });
});

app.put("/api/modules/:moduleName", authMiddleware, (req, res) => {
  const moduleName = String(req.params.moduleName).trim().toLowerCase();
  const validModules = ["fronts", "pluraldex", "scrapbook", "timeline", "triggers"];
  if (!validModules.includes(moduleName)) {
    return res.status(400).json({ message: "Invalid module name." });
  }
  const data = req.body && req.body.data;
  if (data === undefined) {
    return res.status(400).json({ message: "Module data is required." });
  }
  if (!req.user.modules) {
    req.user.modules = {};
  }
  req.user.modules[moduleName] = data;
  req.user.updatedAt = nowIso();
  writeDb(req.db);
  res.json({ ok: true });
});

app.get("/api/user/:username/modules/:moduleName", authMiddleware, (req, res) => {
  const username = sanitizeUsername(req.params.username);
  const moduleName = String(req.params.moduleName).trim().toLowerCase();
  const validModules = ["fronts", "pluraldex", "scrapbook", "timeline", "triggers"];
  if (!validModules.includes(moduleName)) {
    return res.status(400).json({ message: "Invalid module name." });
  }
  const target = req.db.users.find(user => user.username === username);
  if (!target) {
    return res.status(404).json({ message: "User not found." });
  }
  const request = friendRequestForUser(req.db, req.user.id, target.id);
  const moduleData = target.modules && target.modules[moduleName];
  const filtered = filterModuleByPrivacy(moduleName, moduleData, req.user, target, request);
  
  if (filtered === null) {
    return res.status(403).json({ message: `Access denied to ${moduleName}.` });
  }
  res.json({ module: moduleName, data: filtered, owner: target.username });
});

app.get("/api/user/:username/modules", authMiddleware, (req, res) => {
  const username = sanitizeUsername(req.params.username);
  const target = req.db.users.find(user => user.username === username);
  if (!target) {
    return res.status(404).json({ message: "User not found." });
  }
  const request = friendRequestForUser(req.db, req.user.id, target.id);
  const validModules = ["fronts", "pluraldex", "scrapbook", "timeline", "triggers"];
  const accessible = validModules.filter(moduleName => {
    const data = target.modules && target.modules[moduleName];
    const filtered = filterModuleByPrivacy(moduleName, data, req.user, target, request);
    return filtered !== null;
  });
  res.json({ owner: target.username, modules: accessible });
});

app.use(express.static(FRONTEND_DIR));

app.get("/", (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

app.use((_req, res) => {
  res.status(404).json({ message: "Not found." });
});

ensureDb();
app.listen(PORT, () => {
  console.log(`[cyberdeck-social] Backend running on port ${PORT}`);
  console.log(`[cyberdeck-social] Data directory: ${DATA_DIR}`);
  console.log(`[cyberdeck-social] Frontend directory: ${FRONTEND_DIR}`);
});