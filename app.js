// ── Data backup / restore ───────────────────────────────────────────────────
const CYBERDECK_STORAGE_KEYS = [
  "cyberdeckPluraldex",
  "cyberdeckMediaLibrary",
  "cyberdeckMediaSeedVersion",
  "cyberdeckWritingJournal",
  "cyberdeckWritingNotes",
  "cyberdeckScrapbookBoard",
  "cyberdeckAACBoard",
  "cyberdeckBeaconBoard",
  "cyberdeckPartnersData",
  "cyberdeckFamilyTree",
  "cyberdeckMiniGameHighscores",
  "cyberdeckFrontTracker",
  "cyberdeckSettings",
  "cyberdeckTimeline",
  "cyberdeckBulletBoard",
  "cyberdeckTriggers",
  "cyberdeckHealth",
  "cyberdeckAgreements",
  "cyberdeckFriendsConfig",
  "cyberdeckFriendsAuth",
  "cyberdeckFriendsProfile",
  "cyberdeckFriendsCache"
];

function exportCyberdeckData() {
  const backup = { _version: 1, _exported: new Date().toISOString() };
  CYBERDECK_STORAGE_KEYS.forEach(k => {
    const v = safeGetStorage(k);
    if (v !== null) backup[k] = v;
  });
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `cyberdeck-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function importCyberdeckData(file) {
  const reader = new FileReader();
  reader.onload = e => {
    let data;
    try { data = JSON.parse(e.target.result); }
    catch { alert("Invalid backup file — could not parse JSON."); return; }
    const keys = CYBERDECK_STORAGE_KEYS.filter(k => k in data);
    if (!keys.length) { alert("No recognisable Cyberdeck data found in this file."); return; }
    if (!confirm(`Import ${keys.length} data store(s)?\nThis will overwrite current data and reload the page.`)) return;
    keys.forEach(k => safeSetStorage(k, data[k]));
    location.reload();
  };
  reader.readAsText(file);
}

function cleanupRemovedCyberdeckData() {
  try {
    window.localStorage.removeItem("cyberdeckDreams");
    window.localStorage.removeItem("cyberdeckPortfolio");
  } catch (error) {
    console.warn("removed-data cleanup failed", error);
  }
}

async function downloadStandaloneHtml() {
  const standalonePath = "./cyberdeck-standalone.html";
  try {
    const response = await fetch(standalonePath, { cache: "no-store" });
    if (!response.ok) throw new Error("Standalone file request failed");

    const html = await response.text();
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cyberdeck-standalone.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  } catch (error) {
    console.warn("standalone download fallback", error);
  }

  try {
    window.open(standalonePath, "_blank");
    return true;
  } catch (_) {}

  try {
    window.location.href = standalonePath;
    return true;
  } catch (_) {}

  return false;
}

const state = {
  currentTag: null,
  pluraldexSelection: null,
  tamagotchi: { hunger: 50, happiness: 50, energy: 80, alive: true },
  tamagotchiTimer: null,
  gameCat: { hunger: 35, happiness: 70, energy: 80, asleep: false },
  gameCatTimer: null,
  gameCatAnim: null,
};

let deferredInstallPrompt = null;

function isStandaloneInstallMode() {
  return window.matchMedia('(display-mode: standalone)').matches || !!window.navigator.standalone;
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;

  const installBtn = document.getElementById("settings-install-app");
  const installHint = document.getElementById("settings-install-hint");
  if (installBtn) installBtn.disabled = false;
  if (installHint) installHint.textContent = "Ready: tap Add to Home Screen to install this app.";
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;

  const installBtn = document.getElementById("settings-install-app");
  const installHint = document.getElementById("settings-install-hint");
  if (installBtn) {
    installBtn.disabled = true;
    installBtn.textContent = "Installed";
  }
  if (installHint) installHint.textContent = "App installed successfully.";
});

const requestedPluraldexNames = [
  "$¥N!C^L",
  "3RR0R",
  "5Y5T3M_F41LVR3",
  "aarre",
  "abbadon",
  "adeline",
  "agatha",
  "alice",
  "alien",
  "amnesia",
  "angelcake",
  "annabelle",
  "april",
  "artemis",
  "aurora",
  "B1N4RY",
  "baxxter",
  "bean",
  "bear",
  "bill",
  "blueberry",
  "bones",
  "brayden",
  "brutus",
  "calvin",
  "calypso",
  "camryn",
  "candi",
  "cara",
  "carter",
  "charlie",
  "charlotte",
  "cheshire",
  "CR4SH",
  "crypt",
  "daffodil",
  "dagger",
  "dahlia",
  "darling",
  "dawn",
  "diabolos kervana",
  "domanix",
  "dozo",
  "earnest",
  "eden",
  "ems",
  "ender",
  "ethelynn",
  "evangelical",
  "fauwna",
  "felicity",
  "flora",
  "fluttershy",
  "foxxie",
  "fungi",
  "ghost",
  "ghoulia",
  "ink",
  "ivy",
  "jax",
  "jayce",
  "jinx",
  "jules",
  "kaynine",
  "kerosene",
  "khai",
  "kira",
  "klaus",
  "laura",
  "leviathan",
  "lilith",
  "lime",
  "linus",
  "luna",
  "lynx",
  "lyra",
  "marcel",
  "marshall",
  "mary",
  "marz",
  "max",
  "maximus",
  "maxxie",
  "maya",
  "melon kiss",
  "meow meow",
  "merida",
  "mickey",
  "milo",
  "moa",
  "molly",
  "muji",
  "nikki",
  "nikolaus",
  "nocturne",
  "noxx",
  "nyx",
  "oliver",
  "operetta",
  "osias",
  "patch",
  "peach",
  "pebbles",
  "persona",
  "PH4NT0M",
  "PIP the penguin",
  "rainbow",
  "ray",
  "robbie",
  "robecca",
  "rosella",
  "roxxanne",
  "ryuk",
  "ryxz",
  "salem",
  "shadow",
  "silver",
  "snow",
  "soleil",
  "sprite",
  "strawberry",
  "styxx",
  "sunday",
  "the eye",
  "the owner",
  "the professor",
  "torelai",
  "twyla",
  "valen",
  "valentine",
  "vandal",
  "venus",
  "viah",
  "vial",
  "viktor",
  "violet",
  "vladimir",
  "wednesday",
  "westley",
  "who",
  "willow",
  "wydowna",
  "X",
  "xara",
  "yevah",
  "zero",
  "zephr",
  "pika",
  "bulby",
  "otis",
  "yumeko",
  "midari",
  "silvermist",
  "butterfly"
];

let pluraldexData = [
  {
    id: 1,
    name: "Nova",
    image: "https://api.dicebear.com/6.x/lorelei/svg?seed=Nova",
    pronouns: "they/them",
    terms: ["based", "non-binary"],
    age: 27,
    ageType: "adult",
    gender: "non-binary",
    sex: "asexual",
    orientation: "pansexual",
    amory: "solo-poly",
    roles: ["handler", "mage"],
    species: "human",
    description: "Quick-witted archivist who runs the pluraldex.",
    boundaries: "No surprise touches to face, no unearned gatekeeping." ,
    interaction: "interact with care",
    verbality: "verbal",
    aac: "none",
    toneTags: ["friendly", "curious"],
    triggers: { positive: ["safe space"], negative: ["invalidation"], neutral: ["small talk"] },
    formed: "2020-11-21",
    reason: "community support",
    notes: "Prefers text-first conversation and consistency.",
    sexualInfo: { kinks: ["sensual touch"], dynamics: ["consensual"], roles: ["dom/sub"], "visibility": "low" },
  },
  {
    id: 2,
    name: "Echo",
    image: "https://api.dicebear.com/6.x/lorelei/svg?seed=Echo",
    pronouns: "she/they",
    terms: ["glyphkin", "storyteller"],
    age: 15,
    ageType: "young", 
    gender: "she/they",
    sex: "intersex",
    orientation: "queer",
    amory: "monoamorous",
    roles: ["singer", "dreamer"],
    species: "fantasy fox",
    description: "Mirror entity often makes new terms and performs them in music.",
    boundaries: "No forced singing, no judgement about creative processes.",
    interaction: "interact with caution",
    verbality: "AAC preferred",
    aac: "yes",
    toneTags: ["playful", "melodic"],
    triggers: { positive: ["music"], negative: ["spam"], neutral: ["background noise"] },
    formed: "2023-03-05",
    reason: "artistic expression",
    notes: "Sometimes resets to a childlike voice when anxious.",
    sexualInfo: { kinks: ["consent games"], dynamics: ["safety-first"], roles: ["switch"], "visibility": "medium" },
  }
];

const PLURALDEX_PURGE_FLAG = "cyberdeckPluraldexPurgeCompleted";

function normalizeProfileName(name) {
  return String(name || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function createSeedProfile(id, name) {
  return {
    id,
    name,
    color: hashColor(name),
    image: `https://api.dicebear.com/6.x/lorelei/svg?seed=${encodeURIComponent(name)}`,
    pronouns: "",
    terms: [],
    age: "",
    ageType: "",
    gender: "",
    sex: "",
    orientation: "",
    amory: "",
    roles: [],
    species: "",
    description: "",
    boundaries: "",
    interaction: "",
    verbality: "",
    aac: "",
    toneTags: [],
    triggers: { positive: [], negative: [], neutral: [] },
    formed: "",
    reason: "",
    notes: "",
    sexualInfo: { kinks: [], dynamics: [], roles: [], visibility: "" },
  };
}

function ensurePluraldexProfiles(names) {
  const seen = new Set();
  let changed = false;

  pluraldexData = pluraldexData.filter(profile => {
    const normalized = normalizeProfileName(profile && profile.name);
    if (!normalized || seen.has(normalized)) {
      changed = true;
      return false;
    }
    seen.add(normalized);
    return true;
  });

  let nextId = Math.max(0, ...pluraldexData.map(profile => Number(profile.id) || 0)) + 1;
  names.forEach(name => {
    const cleanName = String(name || "").trim();
    const normalized = normalizeProfileName(cleanName);
    if (!normalized || seen.has(normalized)) return;
    pluraldexData.push(createSeedProfile(nextId, cleanName));
    nextId += 1;
    seen.add(normalized);
    changed = true;
  });

  return changed;
}

function loadPluraldex() {
  const stored = safeGetStorage('cyberdeckPluraldex');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) pluraldexData = parsed;
    } catch (e) {
      console.warn('pluraldex load failed', e);
    }
  }
  if (!safeGetStorage(PLURALDEX_PURGE_FLAG)) {
    pluraldexData = [];
    savePluraldex();
    safeSetStorage(PLURALDEX_PURGE_FLAG, "1");
  }
}

function savePluraldex() {
  safeSetStorage('cyberdeckPluraldex', JSON.stringify(pluraldexData));
}

const mediaDB = {
  movies: [],
  shows: [],
  books: [],
  manga: []
};

const MEDIA_LIBRARY_PURGE_FLAG = "cyberdeckMediaLibraryPurgeCompleted";
const WRITING_JOURNAL_PURGE_FLAG = "cyberdeckWritingJournalPurgeCompleted";
const SCRAPBOOK_PURGE_FLAG = "cyberdeckScrapbookPurgeCompleted";

function safeGetStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn('storage read blocked', error);
    return null;
  }
}

function safeSetStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn('storage write blocked', error);
    return false;
  }
}

const PRIVACY_TIERS = ["public", "friends", "trusted", "private"];

function normalizePrivacyTier(value, fallback = "private") {
  const tier = String(value || "").trim().toLowerCase();
  return PRIVACY_TIERS.includes(tier) ? tier : fallback;
}

function renderPrivacyTierOptions(currentValue) {
  const current = normalizePrivacyTier(currentValue);
  return PRIVACY_TIERS.map(tier => `<option value="${tier}"${tier === current ? " selected" : ""}>${tier}</option>`).join("");
}

function createDefaultModulePrivacySettings() {
  return {
    global: "private",
    modules: {
      nexus: "private",
      pluraldex: "private",
      games: "private",
      media: "private",
      writing: "private",
      scrapbook: "private",
      aac: "private",
      friends: "friends",
      partners: "private",
      family: "private",
      front: "private",
      settings: "private",
      timeline: "private",
      bulletboard: "private",
      triggers: "private",
      health: "private",
      agreements: "private"
    }
  };
}

const els = {
  titleLarge: document.getElementById("large-title"),
  large: document.getElementById("large-content"),
  medium: document.getElementById("medium-content"),
  small: document.getElementById("small-content"),
  buttons: [...document.querySelectorAll("#rfid-navbar button")],
  pluraldexTemplate: document.getElementById("pluraldex-card")
};

function setContent(html, largeHtml = "", mediumHtml = "", smallHtml = "") {
  if (els.titleLarge) {
    els.titleLarge.textContent = html.title || "Cyberdeck";
  }
  els.large.innerHTML = largeHtml;
  els.medium.innerHTML = mediumHtml;
  els.small.innerHTML = smallHtml;
  animatePagePanels();
}

function animatePagePanels() {
  const panelBodies = [els.large, els.medium, els.small];
  panelBodies.forEach((panel, idx) => {
    if (!panel) return;
    panel.classList.remove("panel-enter");
    // Force restart so animation runs every tab switch.
    void panel.offsetWidth;
    panel.style.animationDelay = `${idx * 70}ms`;
    panel.classList.add("panel-enter");
  });

  const revealTargets = document.querySelectorAll("#large-content > *, #medium-content > *, #small-content > *");
  revealTargets.forEach((node, idx) => {
    if (!(node instanceof HTMLElement)) return;
    node.classList.remove("page-reveal");
    node.style.setProperty("--reveal-delay", `${Math.min(idx, 18) * 40}ms`);
    void node.offsetWidth;
    node.classList.add("page-reveal");
  });
}


function hashColor(str) {
  var h = 0;
  for (var i = 0; i < (str||'').length; i++) h = (str.charCodeAt(i) + ((h << 5) - h)) | 0;
  return 'hsl(' + (Math.abs(h) % 360) + ', 50%, 38%)';
}
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
var interactionStyle = {
  'oti':                              { bg:'#14532d', color:'#bbf7d0', border:'#22c55e' },
  'iwcu':                             { bg:'#713f12', color:'#fde68a', border:'#eab308' },
  'iwecu':                            { bg:'#7c2d12', color:'#fdba74', border:'#f97316' },
  'iwca':                             { bg:'#831843', color:'#f9a8d4', border:'#ec4899' },
  'iweca':                            { bg:'#fbcfe8', color:'#9d174d', border:'#f9a8d4' },
  'dniuc':                            { bg:'#1d4ed8', color:'#dbeafe', border:'#60a5fa' },
  'dniup':                            { bg:'#6d28d9', color:'#ede9fe', border:'#a78bfa' },
  'dni':                              { bg:'#991b1b', color:'#fecaca', border:'#ef4444' },
  'dnfi':                             { bg:'#581c2d', color:'#fbcfe8', border:'#9f1239' },
  'dniua':                            { bg:'#f8fafc', color:'#111827', border:'#cbd5e1' },
  'iayor':                            { bg:'#1f2937', color:'#e5e7eb', border:'#4b5563' },
};
var interactionOptions = [
  'OTI',
  'IWCu',
  'IWECu',
  'IWCa',
  'IWECa',
  'DNIUC',
  'DNIUP',
  'DNI',
  'DNFI',
  'DNIUA',
  'IAYOR'
];
function normalizeInteractionStatus(value) {
  var normalized = String(value || '').trim().toLowerCase();
  var aliases = {
    'okay to interact': 'OTI',
    'oti': 'OTI',
    'interact with caution': 'IWCu',
    'iwcu': 'IWCu',
    'interact with extreme caution': 'IWECu',
    'iwecu': 'IWECu',
    'interact with care': 'IWCa',
    'iwca': 'IWCa',
    'interact with extreme care': 'IWECa',
    'iweca': 'IWECa',
    'dni unless close': 'DNIUC',
    'do not interact unless close': 'DNIUC',
    'dniuc': 'DNIUC',
    'dni unless partner': 'DNIUP',
    'do not interact unless partner': 'DNIUP',
    'dniup': 'DNIUP',
    'dni': 'DNI',
    'do not interact': 'DNI',
    'dnfi': 'DNFI',
    'do not fucking interact': 'DNFI',
    'dniua': 'DNIUA',
    'do not interact unless aproached': 'DNIUA',
    'do not interact unless approached': 'DNIUA',
    'iayor': 'IAYOR',
    'interact at your own risk': 'IAYOR'
  };
  return aliases[normalized] || String(value || '').trim();
}
function renderInteractionOptions(currentValue) {
  var current = normalizeInteractionStatus(currentValue);
  var options = interactionOptions.slice();
  if (current && options.indexOf(current) === -1) {
    options.unshift(current);
  }
  return '<option value="">Select a status</option>' + options.map(function(option) {
    var selected = option === current ? ' selected' : '';
    return '<option value="' + esc(option) + '"' + selected + '>' + esc(option) + '</option>';
  }).join('');
}
var loreleiOptionSets = {
  backgroundType: ['solid', 'gradientLinear'],
  hairAccessories: ['flowers'],
  hair: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24', 'variant25', 'variant26', 'variant27', 'variant28', 'variant29', 'variant30', 'variant31', 'variant32', 'variant33', 'variant34', 'variant35', 'variant36', 'variant37', 'variant38', 'variant39', 'variant40', 'variant41', 'variant42', 'variant43', 'variant44', 'variant45', 'variant46', 'variant47', 'variant48'],
  eyebrows: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13'],
  eyes: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24'],
  mouth: ['happy01', 'happy02', 'happy03', 'happy04', 'happy05', 'happy06', 'happy07', 'happy08', 'happy09', 'happy10', 'happy11', 'happy12', 'happy13', 'happy14', 'happy15', 'happy16', 'happy17', 'happy18', 'sad01', 'sad02', 'sad03', 'sad04', 'sad05', 'sad06', 'sad07', 'sad08', 'sad09'],
  freckles: ['variant01'],
  glasses: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05']
};
function renderLoreleiSelectOptions(options, currentValue, emptyLabel) {
  var current = String(currentValue || '').trim();
  var html = '<option value="">' + esc(emptyLabel || 'Auto') + '</option>';
  return html + options.map(function(option) {
    var selected = option === current ? ' selected' : '';
    return '<option value="' + esc(option) + '"' + selected + '>' + esc(option) + '</option>';
  }).join('');
}
function parseLoreleiAvatar(url, fallbackSeed) {
  var defaults = {
    seed: fallbackSeed || '',
    backgroundColor: '',
    backgroundType: '',
    hair: '',
    hairColor: '',
    eyebrows: '',
    eyes: '',
    eyesColor: '',
    mouth: '',
    skinColor: '',
    freckles: '',
    glasses: '',
    hairAccessories: '',
    customUrl: ''
  };
  if (!url) return defaults;
  try {
    var parsed = new URL(url, window.location.href);
    if (parsed.pathname.toLowerCase().indexOf('/lorelei/') === -1) {
      defaults.customUrl = url;
      return defaults;
    }
    defaults.seed = parsed.searchParams.get('seed') || defaults.seed;
    defaults.backgroundColor = parsed.searchParams.get('backgroundColor') || '';
    defaults.backgroundType = parsed.searchParams.get('backgroundType') || '';
    defaults.hair = parsed.searchParams.get('hair') || '';
    defaults.hairColor = parsed.searchParams.get('hairColor') || '';
    defaults.eyebrows = parsed.searchParams.get('eyebrows') || '';
    defaults.eyes = parsed.searchParams.get('eyes') || '';
    defaults.eyesColor = parsed.searchParams.get('eyesColor') || '';
    defaults.mouth = parsed.searchParams.get('mouth') || '';
    defaults.skinColor = parsed.searchParams.get('skinColor') || '';
    defaults.freckles = parsed.searchParams.get('freckles') || '';
    defaults.glasses = parsed.searchParams.get('glasses') || '';
    defaults.hairAccessories = parsed.searchParams.get('hairAccessories') || '';
    defaults.customUrl = '';
  } catch (e) {
    defaults.customUrl = url;
  }
  return defaults;
}
function buildLoreleiUrl(seed, options) {
  var params = new URLSearchParams();
  var avatarSeed = options && options.seed ? String(options.seed).trim() : '';
  params.set('seed', avatarSeed || seed || 'Unnamed');
  [
    'backgroundColor',
    'backgroundType',
    'hair',
    'hairColor',
    'eyebrows',
    'eyes',
    'eyesColor',
    'mouth',
    'skinColor',
    'freckles',
    'glasses',
    'hairAccessories'
  ].forEach(function(key) {
    var value = options && options[key] ? String(options[key]).trim() : '';
    if (value) params.set(key, value);
  });
  if (options && options.freckles) params.set('frecklesProbability', '100');
  if (options && options.glasses) params.set('glassesProbability', '100');
  if (options && options.hairAccessories) params.set('hairAccessoriesProbability', '100');
  return 'https://api.dicebear.com/9.x/lorelei/svg?' + params.toString();
}
function readLoreleiAvatarFormState() {
  return {
    customImage: document.getElementById('pdx-image').value.trim(),
    seed: document.getElementById('pdx-avatar-seed').value.trim(),
    backgroundColor: document.getElementById('pdx-avatar-backgroundColor').value.trim(),
    backgroundType: document.getElementById('pdx-avatar-backgroundType').value.trim(),
    hair: document.getElementById('pdx-avatar-hair').value.trim(),
    hairColor: document.getElementById('pdx-avatar-hairColor').value.trim(),
    eyebrows: document.getElementById('pdx-avatar-eyebrows').value.trim(),
    eyes: document.getElementById('pdx-avatar-eyes').value.trim(),
    eyesColor: document.getElementById('pdx-avatar-eyesColor').value.trim(),
    mouth: document.getElementById('pdx-avatar-mouth').value.trim(),
    skinColor: document.getElementById('pdx-avatar-skinColor').value.trim(),
    freckles: document.getElementById('pdx-avatar-freckles').value.trim(),
    glasses: document.getElementById('pdx-avatar-glasses').value.trim(),
    hairAccessories: document.getElementById('pdx-avatar-hairAccessories').value.trim()
  };
}
function resolveLoreleiPreviewUrl() {
  var state = readLoreleiAvatarFormState();
  var fallbackName = document.getElementById('pdx-name').value.trim() || 'Unnamed';
  return state.customImage || buildLoreleiUrl(fallbackName, state);
}
function updateLoreleiPreview() {
  var preview = document.getElementById('pdx-avatar-preview');
  if (!preview) return;
  preview.src = resolveLoreleiPreviewUrl();
}
function attachAvatarFileUploadHandler() {
  var fileInput = document.getElementById('pdx-image-file');
  var imageInput = document.getElementById('pdx-image');
  if (!fileInput || !imageInput) return;
  fileInput.addEventListener('change', function(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type || file.type.indexOf('image/') !== 0) {
      alert('Please choose an image file.');
      fileInput.value = '';
      return;
    }
    var reader = new FileReader();
    reader.onload = function(loadEvent) {
      imageInput.value = String(loadEvent.target && loadEvent.target.result || '');
      updateLoreleiPreview();
    };
    reader.readAsDataURL(file);
  });
}
function attachGalleryFileUploadHandler() {
  var fileInput = document.getElementById('pdx-gallery-files');
  var galleryInput = document.getElementById('pdx-gallery');
  if (!fileInput || !galleryInput) return;
  fileInput.addEventListener('change', function(event) {
    var files = Array.prototype.slice.call(event.target.files || []);
    if (!files.length) return;
    var existing = galleryInput.value
      .split(/\n|,/)
      .map(function(entry) { return entry.trim(); })
      .filter(Boolean);
    files.forEach(function(file) {
      if (!file.type || file.type.indexOf('image/') !== 0) return;
      var reader = new FileReader();
      reader.onload = function(loadEvent) {
        var value = String(loadEvent.target && loadEvent.target.result || '').trim();
        if (!value) return;
        existing.push(value);
        galleryInput.value = existing.join('\n');
      };
      reader.readAsDataURL(file);
    });
    fileInput.value = '';
  });
}
function attachLoreleiPreviewHandlers() {
  [
    'pdx-image',
    'pdx-name',
    'pdx-avatar-seed',
    'pdx-avatar-backgroundColor',
    'pdx-avatar-backgroundType',
    'pdx-avatar-hair',
    'pdx-avatar-hairColor',
    'pdx-avatar-eyebrows',
    'pdx-avatar-eyes',
    'pdx-avatar-eyesColor',
    'pdx-avatar-mouth',
    'pdx-avatar-skinColor',
    'pdx-avatar-freckles',
    'pdx-avatar-glasses',
    'pdx-avatar-hairAccessories'
  ].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', updateLoreleiPreview);
    el.addEventListener('change', updateLoreleiPreview);
  });
  attachAvatarFileUploadHandler();
  updateLoreleiPreview();
}
function profileView(item) {
  var accent = item.color || hashColor(item.name || '');
  var interaction = normalizeInteractionStatus(item.interaction);
  var ints = interactionStyle[interaction.toLowerCase()] || { bg:'#1e3a5f', color:'#93c5fd', border:'#3b82f6' };
  function iRow(label, val) { return val ? '<div class="sp-info-item"><span class="sp-info-label">'+esc(label)+'</span><span class="sp-info-val">'+esc(val)+'</span></div>' : ''; }
  function tPill(e, arr) { return (arr||[]).map(function(t){ return '<span class="sp-trigger-pill">'+e+' '+esc(t)+'</span>'; }).join(''); }
  var terms = (item.terms||[]).map(function(t){ return '<span class="sp-term-pill">'+esc(t)+'</span>'; }).join('');
  var img = esc(item.image || ('https://api.dicebear.com/6.x/lorelei/svg?seed='+encodeURIComponent(item.name||'')));
  var gallery = Array.isArray(item.gallery) ? item.gallery.filter(Boolean) : [];
  var hasTrig = (item.triggers && ((item.triggers.positive||[]).length + (item.triggers.negative||[]).length + (item.triggers.neutral||[]).length));
  var ageStr = item.age ? String(item.age)+(item.ageType?' ('+item.ageType+')':'') : '';
  return '<div class="sp-profile">'
   +'<div class="sp-banner" style="background:'+accent+'"><img class="sp-avatar" src="'+img+'" alt="avatar" /></div>'
   +'<div class="sp-body">'
   +'<h2 class="sp-name">'+esc(item.name||'Unnamed')+'</h2>'
   +(item.pronouns ? '<p class="sp-pronouns">'+esc(item.pronouns)+'</p>' : '')
   +(terms ? '<div class="sp-terms">'+terms+'</div>' : '')
  +'<div class="sp-interaction-badge" style="background:'+ints.bg+';color:'+ints.color+';border:1px solid '+ints.border+'">'+esc(interaction||'no interaction level set')+'</div>'
   +(item.description ? '<div class="sp-section"><div class="sp-section-title">Description</div><p class="sp-section-body">'+esc(item.description)+'</p></div>' : '')
   +'<div class="sp-section"><div class="sp-section-title">About</div><div class="sp-info-grid">'
   +iRow('Age',ageStr)+iRow('Gender',item.gender)+iRow('Sex',item.sex)
   +iRow('Orientation',item.orientation)+iRow('Amory',item.amory)
   +iRow('Species',item.species)+iRow('Roles',(item.roles||[]).join(', '))
   +iRow('Verbality',item.verbality)+iRow('AAC',item.aac)
   +'</div></div>'
  +(gallery.length ? '<div class="sp-section"><div class="sp-section-title">Gallery</div><div class="sp-gallery-grid">'+gallery.map(function(entry, index){ return '<a class="sp-gallery-link" href="'+esc(entry)+'" target="_blank" rel="noreferrer"><img class="sp-gallery-image" src="'+esc(entry)+'" alt="'+esc((item.name || 'Profile')+' gallery image '+(index + 1))+'" /></a>'; }).join('')+'</div></div>' : '')
   +(item.boundaries ? '<div class="sp-section"><div class="sp-section-title">Boundaries</div><p class="sp-section-body">'+esc(item.boundaries)+'</p></div>' : '')
   +(hasTrig ? '<div class="sp-section"><div class="sp-section-title">Triggers</div><div class="sp-triggers">'+tPill('🟢',item.triggers&&item.triggers.positive)+tPill('🔴',item.triggers&&item.triggers.negative)+tPill('🟡',item.triggers&&item.triggers.neutral)+'</div></div>' : '')
   +((item.formed||item.reason) ? '<div class="sp-section"><div class="sp-section-title">Formation</div><div class="sp-info-grid">'+iRow('Date',item.formed)+iRow('Reason',item.reason)+'</div>'+(item.notes?'<p class="sp-section-body" style="margin-top:.4rem">'+esc(item.notes)+'</p>':'')+'</div>' : '')
   +'<div class="sp-actions"><button id="pdx-edit-btn">Edit</button>'+(item.id ? '<button id="pdx-delete" style="background:#7f1d1d;color:#fca5a5;border-color:#991b1b">Delete</button>' : '')+'</div>'
   +'</div></div>';
}
function profileEditForm(item) {
  item = item || {};
  var id = item.id||'';
  function v(val){ return esc(val||''); }
  var lorelei = parseLoreleiAvatar(item.image, item.name || '');
  var img = esc(item.image || ('https://api.dicebear.com/6.x/lorelei/svg?seed='+encodeURIComponent(item.name||'')));
  var col = item.color||'#3b82f6';
  var ban = item.color||hashColor(item.name||'');
  var trPos = v(item.triggers && item.triggers.positive && item.triggers.positive.join(', '));
  var trNeg = v(item.triggers && item.triggers.negative && item.triggers.negative.join(', '));
  var trNeu = v(item.triggers && item.triggers.neutral && item.triggers.neutral.join(', '));
  var gallery = Array.isArray(item.gallery) ? item.gallery.filter(Boolean).join('\n') : '';
  return '<div class="sp-profile sp-edit-form">'
    +'<div class="sp-banner" style="background:'+ban+'"><img class="sp-avatar" id="pdx-avatar-preview" src="'+img+'" alt="avatar" /></div>'
   +'<div class="sp-body"><form id="pdx-form">'
   +'<input type="hidden" id="pdx-id" value="'+id+'" />'
   +'<div class="sp-section"><div class="sp-section-title">Identity</div>'
   +'<div class="sp-field"><label>Name<input id="pdx-name" value="'+v(item.name)+'" /></label></div>'
   +'<div class="sp-field"><label>Pronouns<input id="pdx-pronouns" value="'+v(item.pronouns)+'" /></label></div>'
   +'<div class="sp-field"><label>Terms <span class="sp-hint">(comma-separated)</span><input id="pdx-terms" value="'+v(item.terms&&item.terms.join(', '))+'" /></label></div>'
   +'<div class="sp-field2"><label>Accent color<input id="pdx-color" type="color" value="'+col+'" style="height:34px;cursor:pointer" /></label>'
  +'<label>Avatar URL <span class="sp-hint">(optional override)</span><input id="pdx-image" value="'+v(lorelei.customUrl)+'" /></label></div>'
  +'<div class="sp-field"><label>Photo upload <span class="sp-hint">(choose an image file from your device)</span><input id="pdx-image-file" type="file" accept="image/*" /></label></div>'
  +'<div class="sp-section"><div class="sp-section-title">Lorelei Avatar</div>'
  +'<div class="sp-field2"><label>Seed <input id="pdx-avatar-seed" value="'+v(lorelei.seed || item.name)+'" /></label><label>Background color <input id="pdx-avatar-backgroundColor" value="'+v(lorelei.backgroundColor)+'" placeholder="ffd5dc" /></label></div>'
  +'<div class="sp-field2"><label>Background type<select id="pdx-avatar-backgroundType">'+renderLoreleiSelectOptions(loreleiOptionSets.backgroundType, lorelei.backgroundType, 'Auto')+'</select></label><label>Skin color <input id="pdx-avatar-skinColor" value="'+v(lorelei.skinColor)+'" placeholder="ffffff" /></label></div>'
  +'<div class="sp-field2"><label>Hair<select id="pdx-avatar-hair">'+renderLoreleiSelectOptions(loreleiOptionSets.hair, lorelei.hair, 'Auto')+'</select></label><label>Hair color <input id="pdx-avatar-hairColor" value="'+v(lorelei.hairColor)+'" placeholder="000000" /></label></div>'
  +'<div class="sp-field"><label>Eyebrows<select id="pdx-avatar-eyebrows">'+renderLoreleiSelectOptions(loreleiOptionSets.eyebrows, lorelei.eyebrows, 'Auto')+'</select></label></div>'
  +'<div class="sp-field2"><label>Eyes<select id="pdx-avatar-eyes">'+renderLoreleiSelectOptions(loreleiOptionSets.eyes, lorelei.eyes, 'Auto')+'</select></label><label>Eye color <input id="pdx-avatar-eyesColor" value="'+v(lorelei.eyesColor)+'" placeholder="000000" /></label></div>'
  +'<div class="sp-field2"><label>Mouth<select id="pdx-avatar-mouth">'+renderLoreleiSelectOptions(loreleiOptionSets.mouth, lorelei.mouth, 'Auto')+'</select></label><label>Glasses<select id="pdx-avatar-glasses">'+renderLoreleiSelectOptions(loreleiOptionSets.glasses, lorelei.glasses, 'None')+'</select></label></div>'
  +'<div class="sp-field2"><label>Freckles<select id="pdx-avatar-freckles">'+renderLoreleiSelectOptions(loreleiOptionSets.freckles, lorelei.freckles, 'None')+'</select></label><label>Hair accessory<select id="pdx-avatar-hairAccessories">'+renderLoreleiSelectOptions(loreleiOptionSets.hairAccessories, lorelei.hairAccessories, 'None')+'</select></label></div></div></div>'
   +'<div class="sp-section"><div class="sp-section-title">About</div>'
   +'<div class="sp-field2"><label>Age<input id="pdx-age" type="number" value="'+v(item.age)+'" /></label><label>Age type<input id="pdx-ageType" value="'+v(item.ageType)+'" /></label></div>'
   +'<div class="sp-field2"><label>Gender<input id="pdx-gender" value="'+v(item.gender)+'" /></label><label>Sex<input id="pdx-sex" value="'+v(item.sex)+'" /></label></div>'
   +'<div class="sp-field2"><label>Orientation<input id="pdx-orientation" value="'+v(item.orientation)+'" /></label><label>Amory<input id="pdx-amory" value="'+v(item.amory)+'" /></label></div>'
   +'<div class="sp-field2"><label>Species<input id="pdx-species" value="'+v(item.species)+'" /></label><label>Roles <span class="sp-hint">(csv)</span><input id="pdx-roles" value="'+v(item.roles&&item.roles.join(', '))+'" /></label></div>'
   +'<div class="sp-field2"><label>Verbality<input id="pdx-verbality" value="'+v(item.verbality)+'" /></label><label>AAC usage<input id="pdx-aac" value="'+v(item.aac)+'" /></label></div></div>'
   +'<div class="sp-section"><div class="sp-section-title">Description</div><div class="sp-field"><label><textarea id="pdx-description">'+esc(item.description||'')+'</textarea></label></div></div>'
  +'<div class="sp-section"><div class="sp-section-title">Gallery</div>'
  +'<div class="sp-field"><label>Gallery images <span class="sp-hint">(one URL or data image per line)</span><textarea id="pdx-gallery" placeholder="https://...">'+esc(gallery)+'</textarea></label></div>'
  +'<div class="sp-field"><label>Gallery upload <span class="sp-hint">(choose one or more image files)</span><input id="pdx-gallery-files" type="file" accept="image/*" multiple /></label></div></div>'
   +'<div class="sp-section"><div class="sp-section-title">Interaction &amp; Boundaries</div>'
  +'<div class="sp-field"><label>Interaction level<select id="pdx-interaction">'+renderInteractionOptions(item.interaction)+'</select></label></div>'
   +'<div class="sp-field"><label>Boundaries<textarea id="pdx-boundaries">'+esc(item.boundaries||'')+'</textarea></label></div></div>'
   +'<div class="sp-section"><div class="sp-section-title">Triggers</div>'
   +'<div class="sp-field"><label>&#x1F7E2; Positive <span class="sp-hint">(csv)</span><input id="pdx-triggers-positive" value="'+trPos+'" /></label></div>'
   +'<div class="sp-field"><label>&#x1F534; Negative <span class="sp-hint">(csv)</span><input id="pdx-triggers-negative" value="'+trNeg+'" /></label></div>'
   +'<div class="sp-field"><label>&#x1F7E1; Neutral <span class="sp-hint">(csv)</span><input id="pdx-triggers-neutral" value="'+trNeu+'" /></label></div></div>'
   +'<div class="sp-section"><div class="sp-section-title">Formation</div>'
   +'<div class="sp-field2"><label>Date<input id="pdx-formed" value="'+v(item.formed)+'" /></label><label>Reason<input id="pdx-reason" value="'+v(item.reason)+'" /></label></div>'
   +'<div class="sp-field"><label>Notes<textarea id="pdx-notes">'+esc(item.notes||'')+'</textarea></label></div></div>'
   +'<div class="sp-actions"><button id="pdx-save" type="button">Save</button><button id="pdx-cancel" type="button">Cancel</button>'+(item.id ? '<button id="pdx-delete" type="button" style="background:#7f1d1d;color:#fca5a5;border-color:#991b1b">Delete</button>' : '')+'</div>'
   +'</form></div></div>';
}
function renderPluraldexTertiaryPortrait(item) {
  if (!item) {
    return ''
      +'<section style="display:grid;gap:.45rem;grid-template-rows:auto 1fr auto;align-content:stretch;justify-items:center;height:100%;min-height:0;padding:.55rem;border:1px solid rgba(195, 192, 255, .36);border-radius:14px;background:linear-gradient(165deg, #16162c 0%, #1c1f3b 50%, #202443 100%)">'
      +'<h4 style="margin:.05rem 0;color:#e9deff;font:.84rem \"Palatino Linotype\",\"Book Antiqua\",Georgia,serif">Selected Profile</h4>'
      +'<div style="width:100%;height:clamp(110px, 15vh, 190px);border:1px dashed rgba(205, 190, 255, .45);border-radius:12px;display:grid;place-items:center;color:#c8bce9;background:rgba(16,18,36,.55);font-size:.78rem;text-align:center;padding:.35rem">Pick a profile to preview</div>'
      +'<p style="margin:0;color:#c8bce9;font-size:.74rem;text-align:center">Dream archive</p>'
      +'</section>';
  }

  var avatar = esc(item.image || ('https://api.dicebear.com/6.x/lorelei/svg?seed=' + encodeURIComponent(item.name || 'profile')));
  return ''
    +'<section style="display:grid;gap:.45rem;grid-template-rows:auto 1fr auto;align-content:stretch;justify-items:center;height:100%;min-height:0;padding:.55rem;border:1px solid rgba(195, 192, 255, .36);border-radius:14px;background:linear-gradient(165deg, #16162c 0%, #1c1f3b 50%, #202443 100%)">'
    +'<h4 style="margin:.05rem 0;color:#e9deff;font:.84rem \"Palatino Linotype\",\"Book Antiqua\",Georgia,serif">Selected Profile</h4>'
    +'<img src="'+avatar+'" alt="'+esc(item.name || 'Profile')+' avatar" style="width:min(100%, 210px);height:clamp(110px, 15vh, 190px);object-fit:cover;border:2px solid rgba(236,224,255,.82);border-radius:14px;box-shadow:0 10px 24px rgba(6,8,14,.45),0 0 16px rgba(189,163,255,.26)" />'
    +'<p style="margin:0;color:#d6c8ff;font-size:.78rem;text-align:center;line-height:1.2">'+esc(item.name || 'Unnamed')+'</p>'
    +'</section>';
}
function attachViewHandlers(item, detEl, srchInput, renderList) {
  document.getElementById('pdx-edit-btn').onclick = function() {
    detEl.innerHTML = profileEditForm(item); detEl.scrollTop = 0;
    attachFormHandlers(item, detEl, srchInput, renderList);
  };
  var del = document.getElementById('pdx-delete');
  if (del) del.onclick = function() { deleteProfile(item, detEl, srchInput, renderList); };
}
function attachFormHandlers(item, detEl, srchInput, renderList) {
  attachLoreleiPreviewHandlers();
  attachGalleryFileUploadHandler();
  document.getElementById('pdx-cancel').onclick = function() {
    detEl.innerHTML = profileView(item); detEl.scrollTop = 0;
    els.small.innerHTML = renderPluraldexTertiaryPortrait(item && item.id ? item : null);
    attachViewHandlers(item, detEl, srchInput, renderList);
  };
  document.getElementById('pdx-save').onclick = function() {
    var id = document.getElementById('pdx-id').value;
    var nameVal = document.getElementById('pdx-name').value.trim() || 'Unnamed';
    var avatarState = readLoreleiAvatarFormState();
    avatarState.seed = avatarState.seed || nameVal;
    var profile = {
      id: id ? Number(id) : Math.max.apply(null, [0].concat(pluraldexData.map(function(p){ return p.id; }))) + 1,
      name: nameVal,
      color: document.getElementById('pdx-color').value,
      image: avatarState.customImage || buildLoreleiUrl(nameVal, avatarState),
      pronouns: document.getElementById('pdx-pronouns').value.trim(),
      terms: document.getElementById('pdx-terms').value.split(',').map(function(s){return s.trim();}).filter(Boolean),
      age: Number(document.getElementById('pdx-age').value) || '',
      ageType: document.getElementById('pdx-ageType').value.trim(),
      gender: document.getElementById('pdx-gender').value.trim(),
      sex: document.getElementById('pdx-sex').value.trim(),
      orientation: document.getElementById('pdx-orientation').value.trim(),
      amory: document.getElementById('pdx-amory').value.trim(),
      species: document.getElementById('pdx-species').value.trim(),
      roles: document.getElementById('pdx-roles').value.split(',').map(function(s){return s.trim();}).filter(Boolean),
      verbality: document.getElementById('pdx-verbality').value.trim(),
      aac: document.getElementById('pdx-aac').value.trim(),
      description: document.getElementById('pdx-description').value.trim(),
      gallery: document.getElementById('pdx-gallery').value.split(/\n|,/).map(function(s){return s.trim();}).filter(Boolean),
      boundaries: document.getElementById('pdx-boundaries').value.trim(),
      interaction: normalizeInteractionStatus(document.getElementById('pdx-interaction').value.trim()),
      triggers: {
        positive: document.getElementById('pdx-triggers-positive').value.split(',').map(function(s){return s.trim();}).filter(Boolean),
        negative: document.getElementById('pdx-triggers-negative').value.split(',').map(function(s){return s.trim();}).filter(Boolean),
        neutral: document.getElementById('pdx-triggers-neutral').value.split(',').map(function(s){return s.trim();}).filter(Boolean),
      },
      formed: document.getElementById('pdx-formed').value.trim(),
      reason: document.getElementById('pdx-reason').value.trim(),
      notes: document.getElementById('pdx-notes').value.trim(),
      sexualInfo: item.sexualInfo || { kinks:[], dynamics:[], roles:[], visibility:'' },
    };
    var idx = pluraldexData.findIndex(function(p){ return p.id === profile.id; });
    if (idx > -1) pluraldexData[idx] = profile; else pluraldexData.push(profile);
    state.pluraldexSelection = profile.id;
    savePluraldex(); renderList(srchInput.value);
    detEl.innerHTML = profileView(profile); detEl.scrollTop = 0;
    els.small.innerHTML = renderPluraldexTertiaryPortrait(profile);
    attachViewHandlers(profile, detEl, srchInput, renderList);
  };
  var del = document.getElementById('pdx-delete');
  if (del) del.onclick = function() { deleteProfile(item, detEl, srchInput, renderList); };
}
function deleteProfile(item, detEl, srchInput, renderList) {
  if (!confirm('Delete profile for ' + item.name + '?')) return;
  pluraldexData = pluraldexData.filter(function(p){ return p.id !== item.id; });
  if (state.pluraldexSelection === item.id) state.pluraldexSelection = null;
  savePluraldex(); renderList(srchInput.value);
  detEl.innerHTML = '<p style="color:#6e7681;padding:1rem">Profile deleted. Select another.</p>';
  els.small.innerHTML = renderPluraldexTertiaryPortrait(null);
}
function setActiveTag(tag) {
  state.currentTag = tag;
  els.buttons.forEach(b => b.classList.toggle("active", b.dataset.tag === tag));
  
  // Update mobile dropdown
  const selector = document.getElementById("mobile-tab-selector");
  if (selector) {
    selector.value = tag;
  }
  
  const currentTime = new Date().toLocaleTimeString();
  if (tag === "nexus") {
    renderNexus();
  } else if (tag === "pluraldex") {
    renderPluraldex();
  } else if (tag === "games") {
    renderGames();
  } else if (tag === "media") {
    renderMedia();
  } else if (tag === "writing") {
    renderWriting();
  } else if (tag === "scrapbook") {
    renderScrapbook();
  } else if (tag === "aac") {
    renderAAC();
  } else if (tag === "friends") {
    renderFriends();
  } else if (tag === "partners") {
    renderPartners();
  } else if (tag === "family") {
    renderFamily();
  } else if (tag === "front") {
    renderFront();
  } else if (tag === "settings") {
    renderSettings();
  } else if (tag === "timeline") {
    renderTimeline();
  } else if (tag === "bulletboard") {
    renderBulletBoard();
  } else if (tag === "triggers") {
    renderTriggers();
  } else if (tag === "health") {
    renderHealth();
  } else if (tag === "agreements") {
    renderAgreements();
  }
  const headerP = document.querySelector("header p");
  if (headerP) headerP.textContent = `Current RFID: ${tag}. Updated: ${currentTime}`;
}

function renderNexus() {
  const tagCards = [
    { tag: "pluraldex", title: "Pluraldex", subtitle: "Identity profiles and notes", color: "#5a67d8" },
    { tag: "games", title: "Games", subtitle: "Retro mini games and highscores", color: "#1f9d55" },
    { tag: "media", title: "Media", subtitle: "Library tracker and archive", color: "#c05621" },
    { tag: "writing", title: "Writing", subtitle: "Terminal journal and markdown", color: "#2f855a" },
    { tag: "scrapbook", title: "Scrapbook", subtitle: "Moodboard pages and cards", color: "#b7791f" },
    { tag: "aac", title: "AAC", subtitle: "Speech board and phrase builder", color: "#805ad5" },
    { tag: "friends", title: "Friends", subtitle: "Cross-device online social graph", color: "#0ea5a4" },
    { tag: "partners", title: "Partners", subtitle: "Relationship map and directory", color: "#b83280" },
    { tag: "family", title: "Family", subtitle: "Family tree and bonds", color: "#2b6cb0" },
    { tag: "front", title: "Front", subtitle: "Front tracker and switches", color: "#0f766e" }
  ];

  function countFromStorage(key, mapper) {
    try {
      const parsed = JSON.parse(safeGetStorage(key) || "null");
      return mapper(parsed);
    } catch (_err) {
      return 0;
    }
  }

  function getRandomMediaItem() {
    try {
      const media = JSON.parse(safeGetStorage("cyberdeckMediaLibrary") || "[]");
      if (!Array.isArray(media) || media.length === 0) return null;
      return media[Math.floor(Math.random() * media.length)];
    } catch (_err) {
      return null;
    }
  }

  function getRandomAlter() {
    try {
      const alters = JSON.parse(safeGetStorage("cyberdeckPluraldex") || "[]");
      if (!Array.isArray(alters) || alters.length === 0) return null;
      return alters[Math.floor(Math.random() * alters.length)];
    } catch (_err) {
      return null;
    }
  }

  function getCurrentHour() {
    return Math.floor(Date.now() / 3600000);
  }

  function getRandom(array) {
    if (!Array.isArray(array) || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  }

  const currentHour = getCurrentHour();
  const cacheKey = "nexusHourlyCache";
  let cache = {};
  try {
    const cached = safeGetStorage(cacheKey);
    cache = cached ? JSON.parse(cached) : {};
  } catch (_err) {
    cache = {};
  }

  let randomMedia = null;
  let randomAlter = null;

  if (cache.hour !== currentHour) {
    randomMedia = getRandomMediaItem();
    randomAlter = getRandomAlter();
    cache = { hour: currentHour, mediaId: randomMedia?.id, alterId: randomAlter?.id };
    safeSetStorage(cacheKey, JSON.stringify(cache));
  } else {
    if (cache.mediaId) {
      try {
        const media = JSON.parse(safeGetStorage("cyberdeckMediaLibrary") || "[]");
        randomMedia = media.find(m => m.id === cache.mediaId) || getRandomMediaItem();
      } catch (_err) {
        randomMedia = getRandomMediaItem();
      }
    }
    if (cache.alterId) {
      try {
        const alters = JSON.parse(safeGetStorage("cyberdeckPluraldex") || "[]");
        randomAlter = alters.find(a => a.id === cache.alterId) || getRandomAlter();
      } catch (_err) {
        randomAlter = getRandomAlter();
      }
    }
  }

  const statMap = {
    pluraldex: countFromStorage("cyberdeckPluraldex", value => Array.isArray(value) ? value.length : 0),
    media: countFromStorage("cyberdeckMediaLibrary", value => Array.isArray(value) ? value.length : 0),
    writing: countFromStorage("cyberdeckWritingJournal", value => value && Array.isArray(value.notes) ? value.notes.length : 0),
    scrapbook: countFromStorage("cyberdeckScrapbookBoard", value => value && Array.isArray(value.items) ? value.items.length : 0),
    aac: countFromStorage("cyberdeckAACBoard", value => value && Array.isArray(value.board) ? value.board.length : 0),
    friends: countFromStorage("cyberdeckFriendsCache", value => value && Array.isArray(value.friends) ? value.friends.length : 0),
    partners: countFromStorage("cyberdeckPartnersData", value => value && Array.isArray(value.people) ? value.people.length : 0),
    family: countFromStorage("cyberdeckFamilyTree", value => value && Array.isArray(value.people) ? value.people.length : 0),
    front: countFromStorage("cyberdeckFrontTracker", value => value && Array.isArray(value.members) ? value.members.length : 0)
  };

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(safeGetStorage(key) || "null");
      return parsed == null ? fallback : parsed;
    } catch (_error) {
      return fallback;
    }
  }

  function parseActivityTime(value) {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return value;
    }
    const text = String(value || "").trim();
    if (!text) return 0;
    if (/^\d+$/.test(text)) {
      const numeric = Number(text);
      return Number.isFinite(numeric) ? numeric : 0;
    }
    const parsed = new Date(text).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function formatActivityTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "unknown time";
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  function inferTimeFromId(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    const coarse = Math.floor(numeric);
    return coarse > 100000000000 ? coarse : 0;
  }

  function getRecentActivity(limit = 12) {
    const activity = [];

    const timeline = readJson("cyberdeckTimeline", []);
    if (Array.isArray(timeline)) {
      timeline.forEach(entry => {
        const when = parseActivityTime(entry && (entry.sortDate || entry.date)) || inferTimeFromId(entry && entry.id);
        if (!when) return;
        activity.push({
          when,
          tag: "timeline",
          source: "Timeline",
          text: entry && entry.title ? String(entry.title) : "Timeline event"
        });
      });
    }

    const front = readJson("cyberdeckFrontTracker", null);
    if (front && typeof front === "object") {
      if (Array.isArray(front.switchLog)) {
        front.switchLog.forEach(entry => {
          const when = parseActivityTime(entry && entry.timestamp) || inferTimeFromId(entry && entry.id);
          if (!when) return;
          const from = String(entry && entry.from || "Unknown");
          const to = String(entry && entry.to || "Unknown");
          activity.push({
            when,
            tag: "front",
            source: "Front",
            text: `Switch ${from} -> ${to}`
          });
        });
      }
      if (Array.isArray(front.sessions)) {
        front.sessions.forEach(entry => {
          const when = parseActivityTime(entry && (entry.end || entry.start)) || inferTimeFromId(entry && entry.id);
          if (!when) return;
          activity.push({
            when,
            tag: "front",
            source: "Front",
            text: `Session ${String(entry && entry.memberName || "Unknown")}`
          });
        });
      }
    }

    const writing = readJson("cyberdeckWritingJournal", null);
    if (writing && Array.isArray(writing.notes)) {
      writing.notes.forEach(note => {
        const when = parseActivityTime(note && note.updatedAt) || parseActivityTime(note && note.createdAt) || inferTimeFromId(note && note.id);
        if (!when) return;
        activity.push({
          when,
          tag: "writing",
          source: "Writing",
          text: note && note.title ? String(note.title) : "Journal note"
        });
      });
    }

    const scrapbook = readJson("cyberdeckScrapbookBoard", null);
    if (scrapbook && Array.isArray(scrapbook.items)) {
      scrapbook.items.forEach(item => {
        const when = parseActivityTime(item && item.updatedAt) || parseActivityTime(item && item.createdAt) || inferTimeFromId(item && item.id);
        if (!when) return;
        const label = item && item.title ? String(item.title) : (item && item.caption ? String(item.caption) : "Scrapbook item");
        activity.push({
          when,
          tag: "scrapbook",
          source: "Scrapbook",
          text: label
        });
      });
    }

    const media = readJson("cyberdeckMediaLibrary", []);
    if (Array.isArray(media)) {
      media.forEach(item => {
        const when = parseActivityTime(item && item.updatedAt) || parseActivityTime(item && item.addedAt) || inferTimeFromId(item && item.id);
        if (!when) return;
        activity.push({
          when,
          tag: "media",
          source: "Media",
          text: item && item.title ? String(item.title) : "Media entry"
        });
      });
    }

    const triggers = readJson("cyberdeckTriggers", []);
    if (Array.isArray(triggers)) {
      triggers.forEach(item => {
        const when = parseActivityTime(item && item.updatedAt) || parseActivityTime(item && item.createdAt) || inferTimeFromId(item && item.id);
        if (!when) return;
        activity.push({
          when,
          tag: "triggers",
          source: "Triggers",
          text: item && item.name ? String(item.name) : "Trigger entry"
        });
      });
    }

    return activity
      .sort((left, right) => right.when - left.when)
      .slice(0, limit);
  }

  const recentActivity = getRecentActivity(10);

  const html = `
    <section id="nexus-home" style="display:grid;gap:.8rem">
      <style>
        #nexus-home { padding:.65rem; border:1px solid #2b3340; border-radius:14px; background:
          radial-gradient(100% 140% at 0% 0%, rgba(255,153,204,.12), transparent 45%),
          radial-gradient(110% 140% at 100% 0%, rgba(120,200,255,.12), transparent 48%),
          linear-gradient(160deg,#121722,#1b2232 55%,#151b28); }
        #nexus-home .nx-top { display:flex; justify-content:space-between; gap:.6rem; flex-wrap:wrap; align-items:end; }
        #nexus-home .nx-title { color:#f6f0ff; font:700 1.05rem "Palatino Linotype","Book Antiqua",Georgia,serif; }
        #nexus-home .nx-sub { color:#afbbce; font-size:.82rem; }
        #nexus-home .nx-grid { column-count:3; column-gap:.7rem; }
        #nexus-home .nx-card { break-inside:avoid; margin:0 0 .7rem 0; border:1px solid rgba(210,226,255,.2); border-radius:14px; padding:.7rem; cursor:pointer; background:linear-gradient(170deg, rgba(20,26,39,.92), rgba(13,18,28,.95)); box-shadow:0 12px 20px rgba(0,0,0,.28); transition:transform .12s ease,border-color .12s ease; }
        #nexus-home .nx-card:hover { transform:translateY(-2px); border-color:rgba(228,239,255,.52); }
        #nexus-home .nx-pill { display:inline-flex; align-items:center; gap:.35rem; border-radius:999px; padding:.2rem .56rem; font-size:.73rem; font-weight:700; color:#fff; }
        #nexus-home .nx-name { margin:.45rem 0 .2rem; color:#e8f0ff; font-weight:700; letter-spacing:.02em; }
        #nexus-home .nx-copy { margin:0; color:#b3c2d8; font-size:.8rem; line-height:1.45; }
        #nexus-home .nx-meta { margin-top:.55rem; color:#8fa3bf; font-size:.75rem; }
        #nexus-home .nx-recent { border:1px solid rgba(210,226,255,.2); border-radius:14px; padding:.65rem; background:linear-gradient(170deg, rgba(20,26,39,.82), rgba(13,18,28,.88)); }
        #nexus-home .nx-recent-title { margin:0 0 .45rem; color:#f6f0ff; font-size:.86rem; letter-spacing:.03em; text-transform:uppercase; }
        #nexus-home .nx-recent-list { display:grid; gap:.38rem; }
        #nexus-home .nx-recent-item { border:1px solid rgba(143,163,191,.28); border-radius:10px; padding:.5rem .58rem; background:rgba(10,14,23,.72); cursor:pointer; }
        #nexus-home .nx-recent-item:hover { border-color:rgba(190,210,238,.55); }
        #nexus-home .nx-recent-source { color:#d6e3f8; font-weight:700; font-size:.74rem; }
        #nexus-home .nx-recent-copy { color:#b3c2d8; font-size:.79rem; margin:.1rem 0 0; }
        #nexus-home .nx-recent-time { color:#8fa3bf; font-size:.71rem; margin-top:.18rem; }
        @media (max-width:1000px) { #nexus-home .nx-grid { column-count:2; } }
        @media (max-width:680px) { #nexus-home .nx-grid { column-count:1; } }
      </style>
      <div class="nx-top">
        <div>
          <div class="nx-title">Nexus</div>
          <div class="nx-sub">Tumblr-style home feed for every section</div>
        </div>
        <button id="nx-open-front" type="button" style="width:auto">Open Front Tracker</button>
      </div>
      <section class="nx-recent">
        <h4 class="nx-recent-title">Recent Activity</h4>
        <div class="nx-recent-list">
          ${recentActivity.length
            ? recentActivity.map(item => `<article class="nx-recent-item" data-nx-activity-tag="${esc(item.tag)}">
                <div class="nx-recent-source">${esc(item.source)}</div>
                <p class="nx-recent-copy">${esc(item.text)}</p>
                <div class="nx-recent-time">${esc(formatActivityTime(item.when))}</div>
              </article>`).join("")
            : `<div class="nx-recent-item"><div class="nx-recent-copy">No recent activity yet. Add entries in Timeline, Front, Writing, Scrapbook, Media, or Triggers.</div></div>`}
        </div>
      </section>
      <div class="nx-grid">
        ${tagCards.map((card, index) => {
          const count = Number(statMap[card.tag] || 0);
          return `<article class="nx-card" data-nx-tag="${card.tag}">
            <span class="nx-pill" style="background:${card.color}">#${card.tag}</span>
            <h4 class="nx-name">${esc(card.title)}</h4>
            <p class="nx-copy">${esc(card.subtitle)}</p>
            <div class="nx-meta">${count} saved item${count === 1 ? "" : "s"} • post ${index + 1}</div>
          </article>`;
        }).join("")}
      </div>
    </section>
  `;

  const mediumMediaHtml = randomMedia ? `
    <div style="border:1px solid rgba(192,86,33,.4);border-radius:12px;padding:.6rem;background:linear-gradient(135deg, rgba(192,86,33,.08), rgba(192,86,33,.04))">
      <div style="color:#c8702f;font-weight:700;font-size:.8rem;margin-bottom:.3rem">📺 Hourly Pick</div>
      <div style="color:#e8f0ff;font-weight:700;font-size:.9rem;margin-bottom:.2rem">${esc(randomMedia.title)}</div>
      <div style="color:#8fa3bf;font-size:.75rem;margin-bottom:.3rem">${randomMedia.type} • ${randomMedia.status || 'planned'}</div>
      ${randomMedia.coverImage ? `<img src="${esc(randomMedia.coverImage)}" alt="${esc(randomMedia.title)}" style="width:100%;height:auto;border-radius:8px;margin-bottom:.3rem" />` : ''}
      ${randomMedia.fandom ? `<div style="color:#b3c2d8;font-size:.8rem"><strong>Fandom:</strong> ${esc(randomMedia.fandom)}</div>` : ''}
    </div>
  ` : `<div style="padding:.5rem;color:#8b949e;font-size:.8rem;text-align:center">No media items yet</div>`;

  const medium = `
    <section style="display:grid;gap:1rem;align-content:start;padding:.5rem">
      ${mediumMediaHtml}
    </section>
  `;

  const smallAlterHtml = randomAlter ? `
    <div style="border:1px solid rgba(90,103,216,.4);border-radius:12px;padding:.6rem;background:linear-gradient(135deg, rgba(90,103,216,.08), rgba(90,103,216,.04));text-align:center">
      <div style="color:#a5b4fc;font-weight:700;font-size:.8rem;margin-bottom:.3rem">✨ Random Alter</div>
      ${randomAlter.image ? `<img src="${esc(randomAlter.image)}" alt="${esc(randomAlter.name)}" style="width:100%;height:auto;max-height:120px;border-radius:8px;margin-bottom:.3rem;object-fit:cover" />` : ''}
      <div style="color:#e8f0ff;font-weight:700;font-size:.9rem;margin-bottom:.1rem">${esc(randomAlter.name || 'Unknown')}</div>
      ${randomAlter.pronouns ? `<div style="color:#b3c2d8;font-size:.75rem;margin-bottom:.2rem">${esc(randomAlter.pronouns)}</div>` : ''}
      ${randomAlter.description ? `<div style="color:#8fa3bf;font-size:.75rem;margin-top:.3rem;line-height:1.3">${esc(randomAlter.description.substring(0, 60))}${randomAlter.description.length > 60 ? '...' : ''}</div>` : ''}
    </div>
  ` : `<div style="padding:.5rem;color:#8b949e;font-size:.8rem;text-align:center">No alters yet</div>`;

  const small = `
    <section style="display:grid;gap:1rem;align-content:start;padding:.5rem">
      ${smallAlterHtml}
    </section>
  `;

  setContent({ title: "nexus" }, html, medium, small);

  const home = document.getElementById("nexus-home");
  if (home) {
    home.querySelectorAll("[data-nx-tag]").forEach(node => {
      node.onclick = () => setActiveTag(String(node.dataset.nxTag || "pluraldex"));
    });
    home.querySelectorAll("[data-nx-activity-tag]").forEach(node => {
      node.onclick = () => setActiveTag(String(node.dataset.nxActivityTag || "timeline"));
    });
  }

  const openFront = document.getElementById("nx-open-front");
  if (openFront) openFront.onclick = () => setActiveTag("front");
}

function renderFront() {
  const storageKey = "cyberdeckFrontTracker";
  const legacySwitchKey = "cyberdeckSwitchLog";

  function makeId() {
    return Date.now() + Math.floor(Math.random() * 100000);
  }

  function stamp() {
    return new Date().toISOString();
  }

  function formatWhen(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Unknown";
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  function hoursBetween(startIso, endIso) {
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
    return (end - start) / (1000 * 60 * 60);
  }

  let front = {
    members: [],
    sessions: [],
    switchLog: [],
    currentEntries: []
  };

  try {
    const stored = JSON.parse(safeGetStorage(storageKey) || "null");
    if (stored && typeof stored === "object") {
      front = {
        members: Array.isArray(stored.members)
          ? stored.members.filter(Boolean).map(entry => ({
            id: Number(entry.id) || makeId(),
            name: String(entry.name || "Unnamed"),
            pronouns: String(entry.pronouns || ""),
            color: String(entry.color || "#0f766e"),
            notes: String(entry.notes || ""),
            tags: Array.isArray(entry.tags)
              ? entry.tags.map(tag => String(tag).trim()).filter(Boolean)
              : String(entry.tags || "").split(",").map(tag => tag.trim()).filter(Boolean),
            description: String(entry.description || entry.notes || "")
          }))
          : [],
        sessions: Array.isArray(stored.sessions)
          ? stored.sessions.filter(Boolean).map(entry => ({
            id: Number(entry.id) || makeId(),
            memberId: Number(entry.memberId) || 0,
            memberName: String(entry.memberName || ""),
            start: String(entry.start || ""),
            end: String(entry.end || ""),
            note: String(entry.note || "")
          }))
          : [],
        switchLog: Array.isArray(stored.switchLog)
          ? stored.switchLog.filter(Boolean).map(entry => ({
            id: Number(entry.id) || makeId(),
            from: String(entry.from || "Unknown"),
            to: String(entry.to || "Unknown"),
            trigger: String(entry.trigger || ""),
            context: String(entry.context || ""),
            timestamp: String(entry.timestamp || stamp())
          }))
          : [],
        currentEntries: Array.isArray(stored.currentEntries)
          ? stored.currentEntries
            .filter(Boolean)
            .map(entry => ({
              memberId: Number(entry.memberId) || 0,
              startedAt: String(entry.startedAt || stamp()),
              comment: String(entry.comment || "")
            }))
            .filter(entry => entry.memberId)
          : (stored.current && typeof stored.current === "object" && Number(stored.current.memberId)
            ? [{
              memberId: Number(stored.current.memberId),
              startedAt: String(stored.current.startedAt || stamp()),
              comment: ""
            }]
            : [])
      };
    }
  } catch (error) {
    console.warn("front tracker load failed", error);
  }

  if (!Array.isArray(front.currentEntries)) {
    front.currentEntries = [];
  }

  try {
    const legacySwitches = JSON.parse(safeGetStorage(legacySwitchKey) || "[]");
    if (Array.isArray(legacySwitches) && legacySwitches.length) {
      const existingIds = new Set(front.switchLog.map(entry => String(entry.id)));
      legacySwitches.forEach(entry => {
        const id = Number(entry.id) || makeId();
        if (existingIds.has(String(id))) return;
        front.switchLog.push({
          id,
          from: String(entry.from || "Unknown"),
          to: String(entry.to || "Unknown"),
          trigger: String(entry.trigger || ""),
          context: String(entry.context || ""),
          timestamp: String(entry.timestamp || stamp())
        });
      });
      try {
        window.localStorage.removeItem(legacySwitchKey);
      } catch (_error) {}
    }
  } catch (_error) {}

  function persist() {
    safeSetStorage(storageKey, JSON.stringify(front));
  }

  function getMember(id) {
    return front.members.find(entry => entry.id === id) || null;
  }

  function getCurrentEntry(memberId) {
    return front.currentEntries.find(entry => entry.memberId === memberId) || null;
  }

  function closeCurrentMember(memberId, reason) {
    const currentEntry = getCurrentEntry(memberId);
    if (!currentEntry) return;
    const activeMember = getMember(currentEntry.memberId);
    front.sessions.unshift({
      id: makeId(),
      memberId: currentEntry.memberId,
      memberName: activeMember ? activeMember.name : "Unknown",
      start: currentEntry.startedAt,
      end: stamp(),
      note: reason || currentEntry.comment || ""
    });
    front.sessions = front.sessions.slice(0, 120);
    front.currentEntries = front.currentEntries.filter(entry => entry.memberId !== memberId);
  }

  function addSwitchEntry() {
    const fromEl = document.getElementById("front-switch-from");
    const toEl = document.getElementById("front-switch-to");
    const triggerEl = document.getElementById("front-switch-trigger");
    const contextEl = document.getElementById("front-switch-context");
    if (!toEl) return;

    const from = fromEl ? fromEl.value.trim() || "Unknown" : "Unknown";
    const to = toEl.value.trim();
    const trigger = triggerEl ? triggerEl.value.trim() : "";
    const context = contextEl ? contextEl.value.trim() : "";
    if (!to) {
      alert("Add who switched in.");
      return;
    }

    front.switchLog.unshift({
      id: makeId(),
      from,
      to,
      trigger,
      context,
      timestamp: stamp()
    });
    front.switchLog = front.switchLog.slice(0, 120);

    if (fromEl) fromEl.value = "";
    toEl.value = "";
    if (triggerEl) triggerEl.value = "";
    if (contextEl) contextEl.value = "";
    refresh();
  }

  function deleteSwitchEntry(id) {
    front.switchLog = front.switchLog.filter(entry => entry.id !== id);
    refresh();
  }

  const html = `
    <section id="front-board" style="display:grid;gap:.7rem">
      <style>
        #front-board { padding:.65rem; border:1px solid #22403d; border-radius:14px; background:
          radial-gradient(120% 130% at 0% 0%, rgba(45,212,191,.14), transparent 44%),
          linear-gradient(165deg,#082a28,#0f3532 52%,#112c2a); }
        #front-board .fr-head { display:flex; justify-content:space-between; gap:.6rem; flex-wrap:wrap; align-items:end; }
        #front-board .fr-title { color:#e6fffa; font:700 1.04rem "Palatino Linotype","Book Antiqua",Georgia,serif; }
        #front-board .fr-sub { color:#99f6e4; font-size:.8rem; }
        #front-board .fr-now { border:1px solid rgba(153,246,228,.38); border-radius:12px; padding:.65rem; background:rgba(8,24,23,.62); }
        #front-board .fr-now-name { font-weight:700; color:#d1fae5; }
        #front-board .fr-log { display:grid; gap:.45rem; max-height:50vh; overflow:auto; }
        #front-board .fr-log-item { border:1px solid rgba(153,246,228,.25); border-radius:10px; background:rgba(5,16,15,.62); padding:.52rem .6rem; }
        #front-board .fr-log-item strong { color:#d1fae5; }
        #front-board .fr-log-item small { color:#99f6e4; }
        #front-board .fr-section-title { margin:.1rem 0; color:#ccfbf1; font-size:.82rem; text-transform:uppercase; letter-spacing:.08em; }
      </style>

      <div class="fr-head">
        <div>
          <div class="fr-title">Front Tracker</div>
          <div class="fr-sub">Octocon-inspired front history and current fronter</div>
        </div>
        <button id="front-open-nexus" type="button" style="width:auto">Back to Nexus</button>
      </div>

      <section class="fr-now" id="front-now"></section>
      <section style="display:grid;gap:.6rem">
        <h4 class="fr-section-title">Front Sessions</h4>
        <section class="fr-log" id="front-log"></section>
      </section>
      <section style="display:grid;gap:.6rem">
        <h4 class="fr-section-title">Switch Notes</h4>
        <section class="fr-log" id="front-switch-log"></section>
      </section>
    </section>
  `;

  const medium = `
    <section style="display:grid;gap:.7rem;align-content:start">
      <h4 style="margin:.1rem 0">Custom Fronts</h4>
      <div style="display:grid;gap:.4rem">
        <input id="front-custom-name" placeholder="Front name" />
        <input id="front-custom-tags" placeholder="Tags (comma separated)" />
        <input id="front-custom-color" type="color" value="#0f766e" style="height:40px" />
        <textarea id="front-custom-description" placeholder="Description" style="min-height:12vh"></textarea>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap">
          <button id="front-custom-save" type="button" style="width:auto">+ Add Front</button>
          <button id="front-custom-cancel" type="button" style="width:auto;background:#1f2937">Cancel Edit</button>
        </div>
      </div>
      <section id="front-members-list" style="display:grid;gap:.4rem"></section>
      <div style="height:1px;background:rgba(153,246,228,.2);margin:.15rem 0"></div>
      <h4 style="margin:.1rem 0">Current Front</h4>
      <select id="front-member-select"></select>
      <div style="display:flex;gap:.4rem;flex-wrap:wrap">
        <button id="front-start" type="button" style="width:auto">Start Front</button>
        <button id="front-stop" type="button" style="width:auto">Stop Front</button>
      </div>
      <input id="front-switch-note" placeholder="Optional switch note" />
      <div style="height:1px;background:rgba(153,246,228,.2);margin:.15rem 0"></div>
      <h4 style="margin:.1rem 0">Detailed Switch Note</h4>
      <input id="front-switch-from" placeholder="From (optional)" />
      <input id="front-switch-to" placeholder="To" />
      <input id="front-switch-trigger" placeholder="Trigger (optional)" />
      <textarea id="front-switch-context" placeholder="Context / notes" style="min-height:12vh"></textarea>
      <button id="front-log-switch" type="button">+ Log Switch Note</button>
    </section>
  `;

  const small = `
    <section style="display:grid;gap:.5rem;align-content:start">
      <h4 style="margin:.1rem 0">Stats</h4>
      <div id="front-stats" style="display:grid;gap:.4rem"></div>
    </section>
  `;

  setContent({ title: "front" }, html, medium, small);

  const nowEl = document.getElementById("front-now");
  const logEl = document.getElementById("front-log");
  const switchLogEl = document.getElementById("front-switch-log");
  const statsEl = document.getElementById("front-stats");
  const selectEl = document.getElementById("front-member-select");
  const switchNoteEl = document.getElementById("front-switch-note");
  const membersListEl = document.getElementById("front-members-list");
  let editingMemberId = null;

  function parseTagsInput(value) {
    return String(value || "")
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean)
      .slice(0, 20);
  }

  function startEditMember(id) {
    const member = getMember(id);
    if (!member) return;
    editingMemberId = id;
    const nameEl = document.getElementById("front-custom-name");
    const tagsEl = document.getElementById("front-custom-tags");
    const colorEl = document.getElementById("front-custom-color");
    const descriptionEl = document.getElementById("front-custom-description");
    const saveBtn = document.getElementById("front-custom-save");
    if (nameEl) nameEl.value = member.name || "";
    if (tagsEl) tagsEl.value = Array.isArray(member.tags) ? member.tags.join(", ") : "";
    if (colorEl) colorEl.value = member.color || "#0f766e";
    if (descriptionEl) descriptionEl.value = member.description || member.notes || "";
    if (saveBtn) saveBtn.textContent = "Save Changes";
  }

  function cancelEditMember() {
    editingMemberId = null;
    const nameEl = document.getElementById("front-custom-name");
    const tagsEl = document.getElementById("front-custom-tags");
    const colorEl = document.getElementById("front-custom-color");
    const descriptionEl = document.getElementById("front-custom-description");
    const saveBtn = document.getElementById("front-custom-save");
    if (nameEl) nameEl.value = "";
    if (tagsEl) tagsEl.value = "";
    if (colorEl) colorEl.value = "#0f766e";
    if (descriptionEl) descriptionEl.value = "";
    if (saveBtn) saveBtn.textContent = "+ Add Front";
  }

  function upsertMember() {
    const nameEl = document.getElementById("front-custom-name");
    const tagsEl = document.getElementById("front-custom-tags");
    const colorEl = document.getElementById("front-custom-color");
    const descriptionEl = document.getElementById("front-custom-description");
    if (!nameEl) return;
    const name = nameEl.value.trim();
    if (!name) {
      alert("Add a front name first.");
      return;
    }
    const tags = parseTagsInput(tagsEl && tagsEl.value);
    const color = (colorEl && colorEl.value) || "#0f766e";
    const description = String(descriptionEl && descriptionEl.value || "").trim();

    if (editingMemberId) {
      const member = getMember(editingMemberId);
      if (member) {
        member.name = name;
        member.color = color;
        member.tags = tags;
        member.description = description;
        member.notes = description;
      }
    } else {
      front.members.unshift({
        id: makeId(),
        name,
        pronouns: "",
        color,
        notes: description,
        tags,
        description
      });
    }

    cancelEditMember();
    refresh();
  }

  function deleteMember(id) {
    const member = getMember(id);
    if (!member) return;
    if (!confirm(`Delete front ${member.name}?`)) return;
    if (getCurrentEntry(id)) {
      closeCurrentMember(id, "Member deleted");
    }
    front.members = front.members.filter(entry => entry.id !== id);
    front.sessions = front.sessions.filter(entry => entry.memberId !== id);
    if (editingMemberId === id) cancelEditMember();
    refresh();
  }

  function renderMemberSelect() {
    if (!selectEl) return;
    if (!front.members.length) {
      selectEl.innerHTML = `<option value="">No members yet</option>`;
      return;
    }
    selectEl.innerHTML = front.members.map(entry => `<option value="${entry.id}">${esc(entry.name)}${entry.pronouns ? ` (${esc(entry.pronouns)})` : ""}</option>`).join("");
  }

  function renderMembersManager() {
    if (!membersListEl) return;
    if (!front.members.length) {
      membersListEl.innerHTML = `<p style="margin:0;color:#8b949e;font-size:.8rem">No custom fronts yet.</p>`;
      return;
    }
    membersListEl.innerHTML = front.members.map(member => `
      <article style="border:1px solid rgba(153,246,228,.28);border-radius:10px;background:rgba(6,20,18,.5);padding:.5rem .58rem;display:grid;gap:.25rem">
        <div style="display:flex;align-items:center;gap:.45rem"><span style="width:11px;height:11px;border-radius:50%;background:${esc(member.color || "#0f766e")}"></span><strong style="color:#d1fae5">${esc(member.name)}</strong></div>
        ${member.tags && member.tags.length ? `<div style="color:#99f6e4;font-size:.75rem">${member.tags.map(tag => `#${esc(tag)}`).join(" ")}</div>` : ""}
        ${(member.description || member.notes) ? `<div style="color:#ccfbf1;font-size:.78rem">${esc(member.description || member.notes)}</div>` : ""}
        <div style="display:flex;gap:.35rem;flex-wrap:wrap;margin-top:.2rem">
          <button data-front-member-edit="${member.id}" type="button" style="width:auto;background:#1f2937">Edit</button>
          <button data-front-member-delete="${member.id}" type="button" style="width:auto;background:#7f1d1d;color:#fca5a5;border:1px solid #991b1b">Delete</button>
        </div>
      </article>
    `).join("");
  }

  function renderNow() {
    if (!front.currentEntries.length) {
      nowEl.innerHTML = `<div class="fr-now-name">No one is marked as front right now.</div><div style="color:#99f6e4;font-size:.8rem">Select a front and tap Start Front. You can run multiple fronters at once.</div>`;
      return;
    }
    nowEl.innerHTML = front.currentEntries.map(entry => {
      const active = getMember(entry.memberId);
      if (!active) return "";
      return `
        <article style="border:1px solid rgba(153,246,228,.28);border-radius:10px;background:rgba(6,20,18,.55);padding:.52rem .58rem;display:grid;gap:.3rem;margin-bottom:.45rem">
          <div class="fr-now-name" style="display:flex;align-items:center;gap:.45rem"><span style="width:11px;height:11px;border-radius:50%;background:${esc(active.color)}"></span>${esc(active.name)}</div>
          <div style="color:#99f6e4;font-size:.8rem">Started: ${esc(formatWhen(entry.startedAt))}</div>
          ${active.tags && active.tags.length ? `<div style="color:#99f6e4;font-size:.75rem">${active.tags.map(tag => `#${esc(tag)}`).join(" ")}</div>` : ""}
          ${(active.description || active.notes) ? `<div style="color:#ccfbf1;font-size:.8rem">${esc(active.description || active.notes)}</div>` : ""}
          <textarea data-front-comment="${entry.memberId}" placeholder="Front comment" style="min-height:7.5vh">${esc(entry.comment || "")}</textarea>
          <div style="display:flex;gap:.35rem;flex-wrap:wrap">
            <button data-front-comment-save="${entry.memberId}" type="button" style="width:auto;background:#1f2937">Save Comment</button>
            <button data-front-stop-member="${entry.memberId}" type="button" style="width:auto;background:#7f1d1d;color:#fca5a5;border:1px solid #991b1b">Stop This Front</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderStats() {
    const totals = {};
    front.sessions.forEach(session => {
      if (!session.start || !session.end) return;
      const member = getMember(session.memberId);
      if (!member) return;
      totals[member.id] = (totals[member.id] || 0) + hoursBetween(session.start, session.end);
    });
    const rows = front.members
      .map(member => ({ member, hours: totals[member.id] || 0 }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 6);
    if (!rows.length) {
      statsEl.innerHTML = `<p style="margin:0;color:#8b949e;font-size:.8rem">No front history yet.</p>`;
      return;
    }
    statsEl.innerHTML = rows.map(row => `<div style="padding:.4rem .5rem;border:1px solid rgba(153,246,228,.28);border-radius:8px;background:rgba(6,20,18,.5);color:#d1fae5;font-size:.78rem"><strong>${esc(row.member.name)}</strong><div style="color:#99f6e4">${row.hours.toFixed(1)}h logged</div></div>`).join("");
  }

  function renderLog() {
    if (!front.sessions.length) {
      logEl.innerHTML = `<p style="margin:0;color:#8b949e;font-size:.82rem">No front sessions logged yet.</p>`;
      return;
    }
    logEl.innerHTML = front.sessions.map(session => {
      const member = getMember(session.memberId);
      const displayName = member ? member.name : session.memberName || "Unknown";
      return `<article class="fr-log-item">
        <strong>${esc(displayName)}</strong>
        <div><small>${esc(formatWhen(session.start))} -> ${esc(formatWhen(session.end))}</small></div>
        ${session.note ? `<div style="margin-top:.2rem;color:#ccfbf1;font-size:.78rem">${esc(session.note)}</div>` : ""}
      </article>`;
    }).join("");
  }

  function renderSwitchLog() {
    if (!front.switchLog.length) {
      switchLogEl.innerHTML = `<p style="margin:0;color:#8b949e;font-size:.82rem">No detailed switch notes yet.</p>`;
      return;
    }
    switchLogEl.innerHTML = front.switchLog.map(entry => `<article class="fr-log-item">
      <strong>${esc(entry.from)} -> ${esc(entry.to)}</strong>
      <div><small>${esc(formatWhen(entry.timestamp))}</small></div>
      ${entry.trigger ? `<div style="margin-top:.2rem;color:#ccfbf1;font-size:.78rem"><strong>Trigger:</strong> ${esc(entry.trigger)}</div>` : ""}
      ${entry.context ? `<div style="margin-top:.2rem;color:#ccfbf1;font-size:.78rem"><strong>Context:</strong> ${esc(entry.context)}</div>` : ""}
      <button data-front-switch-delete="${entry.id}" type="button" style="margin-top:.35rem;width:auto;background:#7f1d1d;color:#fca5a5;border:1px solid #991b1b">Delete</button>
    </article>`).join("");
  }

  function refresh() {
    persist();
    renderMemberSelect();
    renderMembersManager();
    renderNow();
    renderStats();
    renderLog();
    renderSwitchLog();
    document.querySelectorAll("[data-front-member-edit]").forEach(button => {
      button.onclick = () => startEditMember(Number(button.dataset.frontMemberEdit));
    });
    document.querySelectorAll("[data-front-member-delete]").forEach(button => {
      button.onclick = () => deleteMember(Number(button.dataset.frontMemberDelete));
    });
    document.querySelectorAll("[data-front-switch-delete]").forEach(button => {
      button.onclick = () => deleteSwitchEntry(Number(button.dataset.frontSwitchDelete));
    });
    document.querySelectorAll("[data-front-comment-save]").forEach(button => {
      button.onclick = () => {
        const memberId = Number(button.dataset.frontCommentSave);
        const entry = getCurrentEntry(memberId);
        if (!entry) return;
        const textarea = document.querySelector(`[data-front-comment="${memberId}"]`);
        entry.comment = String(textarea && textarea.value || "").trim();
        persist();
      };
    });
    document.querySelectorAll("[data-front-stop-member]").forEach(button => {
      button.onclick = () => {
        const memberId = Number(button.dataset.frontStopMember);
        const entry = getCurrentEntry(memberId);
        closeCurrentMember(memberId, entry ? entry.comment : "Stopped");
        refresh();
      };
    });
  }

  document.getElementById("front-open-nexus").onclick = () => setActiveTag("nexus");

  document.getElementById("front-custom-save").onclick = upsertMember;
  document.getElementById("front-custom-cancel").onclick = cancelEditMember;

  document.getElementById("front-start").onclick = () => {
    const nextId = Number(selectEl.value);
    if (!nextId) return;
    const note = switchNoteEl.value.trim();
    if (getCurrentEntry(nextId)) return;
    front.currentEntries.push({ memberId: nextId, startedAt: stamp(), comment: note });
    switchNoteEl.value = "";
    refresh();
  };

  document.getElementById("front-stop").onclick = () => {
    const selectedId = Number(selectEl && selectEl.value);
    if (!selectedId || !getCurrentEntry(selectedId)) return;
    closeCurrentMember(selectedId, switchNoteEl.value.trim() || "Stopped");
    switchNoteEl.value = "";
    refresh();
  };

  document.getElementById("front-log-switch").onclick = addSwitchEntry;

  refresh();
}

function renderSettings() {
  const storageKey = "cyberdeckSettings";
  const isElectronRuntime = /Electron/i.test(navigator.userAgent || "");
  const isStandaloneMode = isStandaloneInstallMode();
  const canInstallPrompt = !!deferredInstallPrompt;
  const installButtonLabel = isStandaloneMode
    ? "Installed"
    : (canInstallPrompt ? "Add to Home Screen" : (isElectronRuntime ? "Download Standalone" : "Install / Add to Home Screen"));
  const installHintText = isStandaloneMode
    ? "This app is already installed on this device."
    : (canInstallPrompt
      ? "Ready: tap Add to Home Screen to install this app."
      : (isElectronRuntime
        ? "Desktop app mode: download standalone file to run in a browser and install there."
        : "If this button is unavailable, use your browser menu and choose Add to Home Screen / Install App."));
  let settings = {
    theme: "dark",
    accentColor: "#5a67d8",
    autoBackup: false,
    backupFreq: "daily",
    privacyDefaults: createDefaultModulePrivacySettings()
  };
  
  try {
    const stored = JSON.parse(safeGetStorage(storageKey) || "null");
    if (stored) {
      const mergedPrivacy = createDefaultModulePrivacySettings();
      if (stored.privacyDefaults && typeof stored.privacyDefaults === "object") {
        mergedPrivacy.global = normalizePrivacyTier(stored.privacyDefaults.global, mergedPrivacy.global);
        if (stored.privacyDefaults.modules && typeof stored.privacyDefaults.modules === "object") {
          Object.keys(mergedPrivacy.modules).forEach(key => {
            mergedPrivacy.modules[key] = normalizePrivacyTier(stored.privacyDefaults.modules[key], mergedPrivacy.modules[key]);
          });
        }
      }
      settings = { ...settings, ...stored, privacyDefaults: mergedPrivacy };
    }
  } catch (_) {}

  const html = `
    <section style="padding:1rem;display:grid;gap:1.5rem">
      <style>
        .setting-group { border:1px solid rgba(90,103,216,.3); border-radius:12px; padding:1rem; background:rgba(90,103,216,.05) }
        .setting-label { color:#e8f0ff; font-weight:700; margin-bottom:.4rem; display:block }
        .setting-input { width:100%; padding:.5rem; border:1px solid #404854; border-radius:8px; background:#1a1f2e; color:#e8f0ff; font:inherit }
        .setting-input:focus { outline:none; border-color:#5a67d8 }
        .setting-desc { color:#8fa3bf; font-size:.8rem; margin-top:.3rem }
      </style>
      <div class="setting-group">
        <label class="setting-label">Theme</label>
        <select class="setting-input" id="theme-select">
          <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
          <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
          <option value="auto" ${settings.theme === 'auto' ? 'selected' : ''}>Auto</option>
        </select>
      </div>
      <div class="setting-group">
        <label class="setting-label">Accent Color</label>
        <input type="color" class="setting-input" id="accent-color" value="${settings.accentColor}" style="height:50px;cursor:pointer" />
      </div>
      <div class="setting-group">
        <label class="setting-label">Auto Backup</label>
        <input type="checkbox" id="auto-backup" ${settings.autoBackup ? 'checked' : ''} />
        <div class="setting-desc">Automatically backup data</div>
      </div>
      <div class="setting-group">
        <label class="setting-label">Backup Frequency</label>
        <select class="setting-input" id="backup-freq" ${!settings.autoBackup ? 'disabled' : ''}>
          <option value="daily" ${settings.backupFreq === 'daily' ? 'selected' : ''}>Daily</option>
          <option value="weekly" ${settings.backupFreq === 'weekly' ? 'selected' : ''}>Weekly</option>
          <option value="monthly" ${settings.backupFreq === 'monthly' ? 'selected' : ''}>Monthly</option>
        </select>
      </div>
      <div class="setting-group">
        <label class="setting-label">Default Privacy Tier</label>
        <select class="setting-input" id="privacy-global-default">${renderPrivacyTierOptions(settings.privacyDefaults.global)}</select>
        <div class="setting-desc">Base visibility for anything you share online.</div>
      </div>
      <div class="setting-group">
        <label class="setting-label">Module Privacy Defaults</label>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.75rem">
          ${Object.entries(settings.privacyDefaults.modules).map(([key, value]) => `
            <label style="display:grid;gap:.25rem;color:#8fa3bf;font-size:.8rem">
              <span style="text-transform:capitalize">${esc(key)}</span>
              <select class="setting-input" data-privacy-module="${esc(key)}">${renderPrivacyTierOptions(value)}</select>
            </label>
          `).join("")}
        </div>
      </div>
      <div class="setting-group">
        <label class="setting-label">Install App</label>
        <button id="settings-install-app" type="button" style="padding:.7rem;background:#0f766e;border:1px solid #14b8a6;border-radius:8px;color:#fff;font-weight:700;cursor:pointer" ${isStandaloneMode ? 'disabled' : ''}>${installButtonLabel}</button>
        <div id="settings-install-hint" class="setting-desc">${esc(installHintText)}</div>
      </div>
      <button id="save-settings" type="button" style="padding:.7rem;background:#5a67d8;border:1px solid #7c9dff;border-radius:8px;color:#fff;font-weight:700;cursor:pointer">Save Settings</button>
    </section>
  `;

  const medium = `<section style="padding:.5rem;color:#8fa3bf;font-size:.8rem;line-height:1.4">Settings are stored locally in your browser. Privacy defaults define how future shared content should behave: public, friends, trusted, or private.</section>`;
  const small = `<section style="padding:.5rem"><h4 style="color:#e8f0ff;margin-bottom:.5rem">Settings</h4><p style="color:#8fa3bf;font-size:.75rem">Customize your Cyberdeck experience</p></section>`;

  setContent({ title: "settings" }, html, medium, small);

  document.getElementById("save-settings").onclick = () => {
    settings.theme = document.getElementById("theme-select").value;
    settings.accentColor = document.getElementById("accent-color").value;
    settings.autoBackup = document.getElementById("auto-backup").checked;
    settings.backupFreq = document.getElementById("backup-freq").value;
    settings.privacyDefaults.global = normalizePrivacyTier(document.getElementById("privacy-global-default").value, settings.privacyDefaults.global);
    document.querySelectorAll("[data-privacy-module]").forEach(select => {
      settings.privacyDefaults.modules[select.dataset.privacyModule] = normalizePrivacyTier(select.value, settings.privacyDefaults.global);
    });
    safeSetStorage(storageKey, JSON.stringify(settings));
    alert("Settings saved!");
  };

  const installBtn = document.getElementById("settings-install-app");
  const installHint = document.getElementById("settings-install-hint");
  if (installBtn) {
    installBtn.onclick = async () => {
      if (isStandaloneInstallMode()) {
        installBtn.disabled = true;
        installBtn.textContent = "Installed";
        if (installHint) installHint.textContent = "This app is already installed on this device.";
        return;
      }

      if (deferredInstallPrompt) {
        try {
          deferredInstallPrompt.prompt();
          const result = await deferredInstallPrompt.userChoice;
          if (installHint) {
            installHint.textContent = result && result.outcome === "accepted"
              ? "Install request accepted. Follow device prompts to finish."
              : "Install prompt dismissed.";
          }
        } catch (_err) {
          if (installHint) installHint.textContent = "Install prompt failed. Try browser menu: Add to Home Screen.";
        } finally {
          deferredInstallPrompt = null;
          installBtn.disabled = true;
        }
        return;
      }

      if (isElectronRuntime) {
        const ok = await downloadStandaloneHtml();
        if (installHint) {
          installHint.textContent = ok
            ? "Standalone file action started. Open it in Chrome or Edge, then choose Install App / Add to Home Screen."
            : "Could not open or download standalone file. Please open cyberdeck-standalone.html manually from the app folder.";
        }
        alert(ok
          ? "Standalone file action started. Open it in Chrome or Edge, then choose Install App / Add to Home Screen."
          : "Could not open or download standalone file. Please open cyberdeck-standalone.html manually from the app folder.");
        return;
      }

      if (installHint) {
        installHint.textContent = "Use your browser menu and choose Add to Home Screen / Install App.";
      }
      alert("Use your browser menu and choose Add to Home Screen / Install App.");
    };
  }

  document.getElementById("auto-backup").onchange = () => {
    document.getElementById("backup-freq").disabled = !document.getElementById("auto-backup").checked;
  };
}

function renderTimeline() {
  const storageKey = "cyberdeckTimeline";
  let timeline = [];
  let editingId = null;

  try {
    const stored = JSON.parse(safeGetStorage(storageKey) || "[]");
    if (Array.isArray(stored)) timeline = stored;
  } catch (_) {}

  function parseEstimatedSortDate(value) {
    const text = String(value || "").trim();
    if (!text) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
    if (/^\d{4}-\d{2}$/.test(text)) return `${text}-01`;
    if (/^\d{4}$/.test(text)) return `${text}-01-01`;
    const monthYear = new Date(`${text} 1`);
    if (!Number.isNaN(monthYear.getTime())) {
      return monthYear.toISOString().slice(0, 10);
    }
    const parsed = new Date(text);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
    return "";
  }

  function getTimelineSortTime(entry) {
    const source = entry && (entry.sortDate || entry.date);
    const time = new Date(source).getTime();
    return Number.isFinite(time) ? time : Number.MAX_SAFE_INTEGER;
  }

  function toggleTimelineDateMode() {
    const estimatedEl = document.getElementById("timeline-estimated");
    const exactWrap = document.getElementById("timeline-date-wrap");
    const estimateWrap = document.getElementById("timeline-estimate-wrap");
    const exactEl = document.getElementById("timeline-date");
    const estimateEl = document.getElementById("timeline-date-estimated");
    const estimated = Boolean(estimatedEl && estimatedEl.checked);
    if (exactWrap) exactWrap.style.display = estimated ? "none" : "block";
    if (estimateWrap) estimateWrap.style.display = estimated ? "block" : "block";
    if (exactEl) exactEl.disabled = estimated;
    if (estimateEl) estimateEl.disabled = !estimated;
  }

  function readTimelineDateValues() {
    const estimatedEl = document.getElementById("timeline-estimated");
    const exactEl = document.getElementById("timeline-date");
    const estimateEl = document.getElementById("timeline-date-estimated");
    const estimated = Boolean(estimatedEl && estimatedEl.checked);
    if (estimated) {
      const dateLabel = String(estimateEl && estimateEl.value || "").trim();
      return {
        estimated: true,
        date: dateLabel,
        sortDate: parseEstimatedSortDate(dateLabel)
      };
    }
    return {
      estimated: false,
      date: String(exactEl && exactEl.value || "").trim(),
      sortDate: String(exactEl && exactEl.value || "").trim()
    };
  }

  function addEvent() {
    const titleEl = document.getElementById("timeline-title");
    const typeEl = document.getElementById("timeline-type");
    const descEl = document.getElementById("timeline-desc");
    if (!titleEl) return;
    
    const dateState = readTimelineDateValues();
    const title = titleEl.value.trim();
    const type = typeEl?.value || "milestone";
    if (!dateState.date || !title) { alert("Add date and title"); return; }

    timeline.unshift({ id: Date.now() + Math.random(), date: dateState.date, sortDate: dateState.sortDate, title, type, estimated: dateState.estimated, desc: descEl?.value || "" });
    safeSetStorage(storageKey, JSON.stringify(timeline));
    const exactEl = document.getElementById("timeline-date");
    const estimateEl = document.getElementById("timeline-date-estimated");
    const estimatedEl = document.getElementById("timeline-estimated");
    if (exactEl) exactEl.value = "";
    if (estimateEl) estimateEl.value = "";
    titleEl.value = descEl.value = "";
    typeEl.value = "milestone";
    if (estimatedEl) estimatedEl.checked = false;
    toggleTimelineDateMode();
    editingId = null;
    render();
  }

  function editEvent(id) {
    editingId = id;
    render();
  }

  function saveEvent() {
    const titleEl = document.getElementById("timeline-title");
    const typeEl = document.getElementById("timeline-type");
    const descEl = document.getElementById("timeline-desc");
    if (!titleEl || !editingId) return;

    const dateState = readTimelineDateValues();
    const title = titleEl.value.trim();
    const type = typeEl?.value || "milestone";
    if (!dateState.date || !title) { alert("Date and title required"); return; }

    const event = timeline.find(e => e.id === editingId);
    if (event) {
      event.date = dateState.date;
      event.sortDate = dateState.sortDate;
      event.title = title;
      event.type = type;
      event.estimated = dateState.estimated;
      event.desc = descEl?.value || "";
      safeSetStorage(storageKey, JSON.stringify(timeline));
    }

    const exactEl = document.getElementById("timeline-date");
    const estimateEl = document.getElementById("timeline-date-estimated");
    const estimatedEl = document.getElementById("timeline-estimated");
    if (exactEl) exactEl.value = "";
    if (estimateEl) estimateEl.value = "";
    titleEl.value = descEl.value = "";
    typeEl.value = "milestone";
    if (estimatedEl) estimatedEl.checked = false;
    toggleTimelineDateMode();
    editingId = null;
    render();
  }

  function cancelEdit() {
    const titleEl = document.getElementById("timeline-title");
    const descEl = document.getElementById("timeline-desc");
    const typeEl = document.getElementById("timeline-type");
    const estimatedEl = document.getElementById("timeline-estimated");
    const exactEl = document.getElementById("timeline-date");
    const estimateEl = document.getElementById("timeline-date-estimated");
    if (exactEl) exactEl.value = "";
    if (estimateEl) estimateEl.value = "";
    titleEl.value = descEl.value = "";
    typeEl.value = "milestone";
    if (estimatedEl) estimatedEl.checked = false;
    toggleTimelineDateMode();
    editingId = null;
    render();
  }

  function deleteEvent(id) {
    if (confirm("Delete this event permanently?")) {
      timeline = timeline.filter(e => e.id !== id);
      safeSetStorage(storageKey, JSON.stringify(timeline));
      render();
    }
  }

  function getTypeColor(type) {
    const colors = {
      milestone: "#5a67d8",
      birthday: "#f472b6",
      anniversary: "#ec4899",
      trauma: "#ef4444",
      healing: "#10b981",
      victory: "#fbbf24"
    };
    return colors[type] || "#5a67d8";
  }

  function getTypeName(type) {
    const names = {
      milestone: "Milestone",
      birthday: "Birthday",
      anniversary: "Anniversary",
      trauma: "Trauma",
      healing: "Healing",
      victory: "Victory"
    };
    return names[type] || "Event";
  }

  function render() {
    const sorted = timeline.slice().sort((a, b) => getTimelineSortTime(a) - getTimelineSortTime(b));
    
    const timelineHtml = sorted.map((ev, idx) => {
      const color = getTypeColor(ev.type);
      const typeName = getTypeName(ev.type);
      const dateLabel = `${ev.estimated ? "Estimated " : ""}${esc(ev.date)}`;
      return `<div style="display:grid;grid-template-columns:auto 1fr;gap:.8rem;margin-bottom:1.5rem;position:relative">
        <div style="display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:${color};border:3px solid #121722;flex-shrink:0">
          <div style="width:12px;height:12px;background:#121722;border-radius:50%"></div>
        </div>
        <div style="padding:.6rem;border-left:3px solid ${color};padding-left:.8rem">
          <div style="color:#e8f0ff;font-weight:700;font-size:.95rem">${esc(ev.title)}</div>
          <div style="color:#8fa3bf;font-size:.85rem;margin-top:.2rem">${dateLabel} • <span style="color:${color};font-weight:600">${esc(typeName)}</span></div>
          ${ev.desc ? `<div style="color:#b3c2d8;font-size:.85rem;margin-top:.4rem;line-height:1.4">${esc(ev.desc)}</div>` : ''}
          <div style="display:flex;gap:.4rem;margin-top:.4rem">
            <button id="edit-${ev.id}" type="button" style="padding:.3rem .6rem;background:#5a67d8;color:#e8f0ff;border:1px solid #7c9dff;border-radius:6px;font-size:.75rem;cursor:pointer">Edit</button>
            <button id="del-${ev.id}" type="button" style="padding:.3rem .6rem;background:#7f1d1d;color:#fca5a5;border:1px solid #991b1b;border-radius:6px;font-size:.75rem;cursor:pointer">Delete</button>
          </div>
        </div>
      </div>`;
    }).join("");

    const editingEvent = editingId ? timeline.find(e => e.id === editingId) : null;

    const html = `
      <section style="padding:1.2rem">
        <style>
          #timeline-visual { display:grid;gap:.5rem }
        </style>
        <div id="timeline-visual">
          ${timelineHtml || '<div style="padding:2rem;text-align:center;color:#8fa3bf;font-size:.9rem">No events recorded yet. Add one to get started.</div>'}
        </div>
      </section>
    `;

    const medium = editingEvent ? `
      <section style="padding:1rem;display:grid;gap:1rem">
        <div style="background:#1a3a1a;border:1px solid #10b981;border-radius:8px;padding:.6rem">
          <h4 style="color:#10b981;margin:0;font-size:.9rem">Editing Event</h4>
        </div>
        <label style="display:flex;align-items:center;gap:.5rem;color:#c9d1d9;font-size:.85rem"><input id="timeline-estimated" type="checkbox" ${editingEvent.estimated ? 'checked' : ''} /> Estimated date</label>
        <div id="timeline-date-wrap" style="display:${editingEvent.estimated ? 'none' : 'block'}"><label style="color:#8fa3bf;font-size:.85rem;display:block;margin-bottom:.3rem">Date</label><input id="timeline-date" type="date" value="${editingEvent.estimated ? esc(editingEvent.sortDate || '') : esc(editingEvent.date)}" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;font-size:.9rem" ${editingEvent.estimated ? 'disabled' : ''} /></div>
        <div id="timeline-estimate-wrap" style="display:block"><label style="color:#8fa3bf;font-size:.85rem;display:block;margin-bottom:.3rem">Estimated date label</label><input id="timeline-date-estimated" type="text" value="${editingEvent.estimated ? esc(editingEvent.date) : ''}" placeholder="March 2019 or 2019" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;font-size:.9rem" ${editingEvent.estimated ? '' : 'disabled'} /></div>
        <div><label style="color:#8fa3bf;font-size:.85rem;display:block;margin-bottom:.3rem">Title</label><input id="timeline-title" type="text" value="${esc(editingEvent.title)}" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;font-size:.9rem" /></div>
        <div><label style="color:#8fa3bf;font-size:.85rem;display:block;margin-bottom:.3rem">Type</label><select id="timeline-type" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;font-size:.9rem"><option value="milestone" ${editingEvent.type === 'milestone' ? 'selected' : ''}>Milestone</option><option value="birthday" ${editingEvent.type === 'birthday' ? 'selected' : ''}>Birthday</option><option value="anniversary" ${editingEvent.type === 'anniversary' ? 'selected' : ''}>Anniversary</option><option value="trauma" ${editingEvent.type === 'trauma' ? 'selected' : ''}>Trauma</option><option value="healing" ${editingEvent.type === 'healing' ? 'selected' : ''}>Healing</option><option value="victory" ${editingEvent.type === 'victory' ? 'selected' : ''}>Victory</option></select></div>
        <div><label style="color:#8fa3bf;font-size:.85rem;display:block;margin-bottom:.3rem">Notes (optional)</label><textarea id="timeline-desc" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;resize:vertical;min-height:50px;font-size:.9rem">${esc(editingEvent.desc)}</textarea></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem">
          <button id="timeline-save" type="button" style="padding:.6rem;background:#10b981;color:#fff;border:1px solid #34d399;border-radius:8px;font-weight:700;cursor:pointer;font-size:.9rem">Save</button>
          <button id="timeline-cancel" type="button" style="padding:.6rem;background:#404854;color:#e8f0ff;border:1px solid #565f73;border-radius:8px;font-weight:700;cursor:pointer;font-size:.9rem">Cancel</button>
        </div>
      </section>
    ` : `
      <section style="padding:1rem;display:grid;gap:1rem">
        <h4 style="color:#e8f0ff;margin:0">Add Event</h4>
        <label style="display:flex;align-items:center;gap:.5rem;color:#c9d1d9;font-size:.85rem"><input id="timeline-estimated" type="checkbox" /> Estimated date</label>
        <div id="timeline-date-wrap"><label style="color:#8fa3bf;font-size:.85rem;display:block;margin-bottom:.3rem">Date</label><input id="timeline-date" type="date" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;font-size:.9rem" /></div>
        <div id="timeline-estimate-wrap" style="display:block"><label style="color:#8fa3bf;font-size:.85rem;display:block;margin-bottom:.3rem">Estimated date label</label><input id="timeline-date-estimated" type="text" placeholder="March 2019 or 2019" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;font-size:.9rem" disabled /></div>
        <div><label style="color:#8fa3bf;font-size:.85rem;display:block;margin-bottom:.3rem">Title</label><input id="timeline-title" type="text" placeholder="Event name..." style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;font-size:.9rem" /></div>
        <div><label style="color:#8fa3bf;font-size:.85rem;display:block;margin-bottom:.3rem">Type</label><select id="timeline-type" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;font-size:.9rem"><option value="milestone">Milestone</option><option value="birthday">Birthday</option><option value="anniversary">Anniversary</option><option value="trauma">Trauma</option><option value="healing">Healing</option><option value="victory">Victory</option></select></div>
        <div><label style="color:#8fa3bf;font-size:.85rem;display:block;margin-bottom:.3rem">Notes (optional)</label><textarea id="timeline-desc" placeholder="Details..." style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;resize:vertical;min-height:50px;font-size:.9rem"></textarea></div>
        <button id="timeline-add" type="button" style="width:100%;padding:.6rem;background:#5a67d8;color:#fff;border:1px solid #7c9dff;border-radius:8px;font-weight:700;cursor:pointer">Add Event</button>
      </section>
    `;

    setContent({ title: "timeline" }, html, medium, `<section style="padding:.5rem"><h4 style="color:#e8f0ff;margin-bottom:.3rem">${timeline.length}</h4><p style="color:#8fa3bf;font-size:.75rem">event${timeline.length !== 1 ? 's' : ''}</p></section>`);

    if (editingId) {
      const saveBtn = document.getElementById("timeline-save");
      const cancelBtn = document.getElementById("timeline-cancel");
      const estimatedToggle = document.getElementById("timeline-estimated");
      if (estimatedToggle) estimatedToggle.onchange = toggleTimelineDateMode;
      toggleTimelineDateMode();
      if (saveBtn) saveBtn.onclick = saveEvent;
      if (cancelBtn) cancelBtn.onclick = cancelEdit;
    } else {
      const addBtn = document.getElementById("timeline-add");
      const estimatedToggle = document.getElementById("timeline-estimated");
      if (estimatedToggle) estimatedToggle.onchange = toggleTimelineDateMode;
      toggleTimelineDateMode();
      if (addBtn) addBtn.onclick = addEvent;
    }

    timeline.forEach(ev => {
      const editBtn = document.getElementById(`edit-${ev.id}`);
      const delBtn = document.getElementById(`del-${ev.id}`);
      if (editBtn) editBtn.onclick = () => editEvent(ev.id);
      if (delBtn) delBtn.onclick = () => deleteEvent(ev.id);
    });
  }

  render();
}

function renderBulletBoard() {
  const storageKey = "cyberdeckBulletBoard";
  let messages = [];

  try {
    const stored = JSON.parse(safeGetStorage(storageKey) || "[]");
    if (Array.isArray(stored)) messages = stored;
  } catch (_) {}

  function addMessage() {
    const fromEl = document.getElementById("bb-from");
    const toEl = document.getElementById("bb-to");
    const msgEl = document.getElementById("bb-msg");
    if (!fromEl || !msgEl) return;

    const from = fromEl.value.trim() || "Anonymous";
    const to = toEl?.value.trim() || "General";
    const msg = msgEl.value.trim();
    if (!msg) { alert("Write a message"); return; }

    messages.unshift({ id: Date.now() + Math.random(), from, to, msg, timestamp: new Date().toLocaleString() });
    safeSetStorage(storageKey, JSON.stringify(messages));
    fromEl.value = msgEl.value = "";
    toEl.value = "";
    render();
  }

  function deleteMessage(id) {
    messages = messages.filter(m => m.id !== id);
    safeSetStorage(storageKey, JSON.stringify(messages));
    render();
  }

  function render() {
    const msgsList = messages.map(m => `<div style="border:1px solid rgba(165,180,252,.3);border-radius:10px;padding:.7rem;background:rgba(165,180,252,.05);margin-bottom:.6rem"><div style="color:#a5b4fc;font-weight:700;font-size:.85rem">${esc(m.from)} → ${esc(m.to)}</div><div style="color:#e8f0ff;margin:.4rem 0;line-height:1.4">${esc(m.msg)}</div><div style="color:#8fa3bf;font-size:.75rem;margin-bottom:.4rem">${esc(m.timestamp)}</div><button id="delmsg-${m.id}" type="button" style="padding:.3rem .6rem;background:#7f1d1d;color:#fca5a5;border:1px solid #991b1b;border-radius:6px;font-size:.75rem;cursor:pointer">Delete</button></div>`).join("");

    const html = `
      <section style="padding:1rem;display:grid;gap:1.5rem">
        <div style="border:1px solid #a5b4fc;border-radius:12px;padding:1rem;background:rgba(165,180,252,.05)">
          <h4 style="color:#e8f0ff;margin-bottom:.6rem">Leave a Message</h4>
          <div style="margin-bottom:.6rem"><label style="color:#8fa3bf;font-size:.9rem">From</label><input id="bb-from" type="text" placeholder="Your name/alter name" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff" /></div>
          <div style="margin-bottom:.6rem"><label style="color:#8fa3bf;font-size:.9rem">To (optional)</label><input id="bb-to" type="text" placeholder="Specific alter or General" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff" /></div>
          <div style="margin-bottom:.6rem"><label style="color:#8fa3bf;font-size:.9rem">Message</label><textarea id="bb-msg" placeholder="Your message..." style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;resize:vertical;min-height:70px"></textarea></div>
          <button id="bb-send" type="button" style="width:100%;padding:.6rem;background:#a5b4fc;color:#121722;border:1px solid #c7d2fe;border-radius:8px;font-weight:700;cursor:pointer">Send Message</button>
        </div>
        <div><h4 style="color:#e8f0ff;margin-bottom:.6rem">Messages</h4>${msgsList || '<p style="color:#8fa3bf;font-size:.85rem">No messages yet</p>'}</div>
      </section>
    `;

    setContent({ title: "bulletboard" }, html, `<section style="padding:.5rem;color:#8fa3bf;font-size:.75rem">${messages.length} message${messages.length !== 1 ? 's' : ''}</section>`, `<section style="padding:.5rem"><h4 style="color:#e8f0ff">Bulletin Board</h4><p style="color:#8fa3bf;font-size:.75rem">Leave notes for alters</p></section>`);

    document.getElementById("bb-send").onclick = addMessage;
    messages.forEach(m => {
      const btn = document.getElementById(`delmsg-${m.id}`);
      if (btn) btn.onclick = () => deleteMessage(m.id);
    });
  }

  render();
}

function renderTriggers() {
  const storageKey = "cyberdeckTriggers";
  let triggers = [];
  let activeTypeFilter = "";
  let activeValenceFilter = "";
  const triggerTypes = ["emotional", "sensory", "environmental", "physical", "social"];
  const triggerValences = ["positive", "negative", "neutral"];

  function formatTriggerType(type) {
    return String(type || "")
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  function normalizeTriggerEntry(entry) {
    const normalized = Object.assign({}, entry);
    let changed = false;

    if (!triggerTypes.includes(normalized.type) && triggerValences.includes(normalized.type) && !normalized.valence) {
      normalized.valence = normalized.type;
      normalized.type = "";
      changed = true;
    }

    if (normalized.valence && !triggerValences.includes(normalized.valence)) {
      normalized.valence = "";
      changed = true;
    }

    return { entry: normalized, changed };
  }

  try {
    const stored = JSON.parse(safeGetStorage(storageKey) || "[]");
    if (Array.isArray(stored)) {
      let changed = false;
      triggers = stored.map(item => {
        const normalized = normalizeTriggerEntry(item);
        if (normalized.changed) changed = true;
        return normalized.entry;
      });
      if (changed) safeSetStorage(storageKey, JSON.stringify(triggers));
    }
  } catch (_) {}

  function addTrigger() {
    const trigEl = document.getElementById("trig-name");
    const typeEl = document.getElementById("trig-type");
    const valenceEl = document.getElementById("trig-valence");
    const copingEl = document.getElementById("trig-coping");
    if (!trigEl) return;

    const name = trigEl.value.trim();
    const type = typeEl?.value || "emotional";
    const valence = valenceEl?.value || "";
    const coping = copingEl?.value.trim() || "";
    if (!name) { alert("Describe the trigger"); return; }

    triggers.unshift({ id: Date.now() + Math.random(), name, type, valence, coping, severity: 5 });
    safeSetStorage(storageKey, JSON.stringify(triggers));
    trigEl.value = copingEl.value = "";
    typeEl.value = "emotional";
    if (valenceEl) valenceEl.value = "";
    render();
  }

  function deleteTrigger(id) {
    triggers = triggers.filter(t => t.id !== id);
    safeSetStorage(storageKey, JSON.stringify(triggers));
    render();
  }

  function render() {
    const filteredTriggers = triggers.filter(t => {
      if (activeTypeFilter && t.type !== activeTypeFilter) return false;
      if (activeValenceFilter && t.valence !== activeValenceFilter) return false;
      return true;
    });

    const triggersList = filteredTriggers.map(t => {
      const meta = [`<strong>Type:</strong> ${esc(formatTriggerType(t.type) || "Uncategorized")}`];
      if (t.valence) meta.push(`<strong>Valence:</strong> ${esc(formatTriggerType(t.valence))}`);
      meta.push(`<strong>Severity:</strong> ${t.severity}/10`);
      return `<div style="border:1px solid rgba(220,38,38,.3);border-radius:10px;padding:.7rem;background:rgba(220,38,38,.05);margin-bottom:.6rem"><div style="color:#dc2626;font-weight:700;font-size:.9rem;margin-bottom:.3rem">${esc(t.name)}</div><div style="color:#8fa3bf;font-size:.85rem;margin-bottom:.3rem">${meta.join(" • ")}</div>${t.coping ? `<div style="color:#b3c2d8;font-size:.85rem"><strong>Coping Strategy:</strong> ${esc(t.coping)}</div>` : ''}<button id="deltrig-${t.id}" type="button" style="margin-top:.4rem;padding:.3rem .6rem;background:#7f1d1d;color:#fca5a5;border:1px solid #991b1b;border-radius:6px;font-size:.75rem;cursor:pointer">Delete</button></div>`;
    }).join("");

    const typeFilterOptions = ['<option value="">All types</option>']
      .concat(triggerTypes.map(type => `<option value="${type}" ${activeTypeFilter === type ? 'selected' : ''}>${esc(formatTriggerType(type))}</option>`))
      .join("");
    const valenceFilterOptions = ['<option value="">All valences</option>']
      .concat(triggerValences.map(valence => `<option value="${valence}" ${activeValenceFilter === valence ? 'selected' : ''}>${esc(formatTriggerType(valence))}</option>`))
      .join("");

    const html = `
      <section style="padding:1rem;display:grid;gap:1.5rem">
        <div style="border:1px solid #dc2626;border-radius:12px;padding:1rem;background:rgba(220,38,38,.05)">
          <h4 style="color:#e8f0ff;margin-bottom:.6rem">Log a Trigger</h4>
          <div style="margin-bottom:.6rem"><label style="color:#8fa3bf;font-size:.9rem">What triggers switches or distress?</label><input id="trig-name" type="text" placeholder="e.g., loud noises, certain music, conflict..." style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff" /></div>
          <div style="margin-bottom:.6rem"><label style="color:#8fa3bf;font-size:.9rem">Type</label><select id="trig-type" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff"><option value="emotional">Emotional</option><option value="sensory">Sensory</option><option value="environmental">Environmental</option><option value="physical">Physical</option><option value="social">Social</option></select></div>
          <div style="margin-bottom:.6rem"><label style="color:#8fa3bf;font-size:.9rem">Valence</label><select id="trig-valence" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff"><option value="">Select valence</option><option value="positive">Positive</option><option value="negative">Negative</option><option value="neutral">Neutral</option></select></div>
          <div style="margin-bottom:.6rem"><label style="color:#8fa3bf;font-size:.9rem">Coping Strategy (optional)</label><textarea id="trig-coping" placeholder="What helps? (grounding, breathing, talking, etc.)" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;resize:vertical;min-height:60px"></textarea></div>
          <button id="trig-add" type="button" style="width:100%;padding:.6rem;background:#dc2626;color:#fff;border:1px solid #f87171;border-radius:8px;font-weight:700;cursor:pointer">Add Trigger</button>
        </div>
        <div>
          <h4 style="color:#e8f0ff;margin-bottom:.6rem">Known Triggers</h4>
          ${triggersList || '<p style="color:#8fa3bf;font-size:.85rem">No triggers match these filters</p>'}
        </div>
      </section>
    `;

    const mediumHtml = `
      <section style="padding:.6rem;display:grid;gap:.6rem">
        <div style="color:#8fa3bf;font-size:.75rem">${filteredTriggers.length} shown • ${triggers.length} total</div>
        <label style="color:#8fa3bf;font-size:.85rem">Filter by type<select id="trig-filter-type" style="width:100%;margin-top:.25rem;padding:.45rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff">${typeFilterOptions}</select></label>
        <label style="color:#8fa3bf;font-size:.85rem">Filter by valence<select id="trig-filter-valence" style="width:100%;margin-top:.25rem;padding:.45rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff">${valenceFilterOptions}</select></label>
      </section>
    `;

    setContent({ title: "triggers" }, html, mediumHtml, `<section style="padding:.5rem"><h4 style="color:#e8f0ff">Triggers</h4><p style="color:#8fa3bf;font-size:.75rem">Switches & coping strategies</p></section>`);

    document.getElementById("trig-add").onclick = addTrigger;
    const filterTypeEl = document.getElementById("trig-filter-type");
    const filterValenceEl = document.getElementById("trig-filter-valence");
    if (filterTypeEl) {
      filterTypeEl.onchange = function() {
        activeTypeFilter = this.value || "";
        render();
      };
    }
    if (filterValenceEl) {
      filterValenceEl.onchange = function() {
        activeValenceFilter = this.value || "";
        render();
      };
    }
    triggers.forEach(t => {
      const btn = document.getElementById(`deltrig-${t.id}`);
      if (btn) btn.onclick = () => deleteTrigger(t.id);
    });
  }

  render();
}

function renderHealth() {
  const storageKey = "cyberdeckHealth";
  let entries = [];

  try {
    const stored = JSON.parse(safeGetStorage(storageKey) || "[]");
    if (Array.isArray(stored)) entries = stored;
  } catch (_) {}

  function addEntry() {
    const typeEl = document.getElementById("health-type");
    const itemEl = document.getElementById("health-item");
    const doseEl = document.getElementById("health-dose");
    const freqEl = document.getElementById("health-freq");
    if (!typeEl || !itemEl) return;

    const type = typeEl.value;
    const item = itemEl.value.trim();
    const dose = doseEl?.value.trim() || "";
    const freq = freqEl?.value.trim() || "";
    if (!item) { alert("Add medication/appointment name"); return; }

    entries.unshift({ id: Date.now() + Math.random(), type, item, dose, freq, date: new Date().toLocaleDateString() });
    safeSetStorage(storageKey, JSON.stringify(entries));
    itemEl.value = doseEl.value = freqEl.value = "";
    typeEl.value = "medication";
    render();
  }

  function deleteEntry(id) {
    entries = entries.filter(e => e.id !== id);
    safeSetStorage(storageKey, JSON.stringify(entries));
    render();
  }

  function render() {
    const meds = entries.filter(e => e.type === "medication");
    const apps = entries.filter(e => e.type === "appointment");
    
    const medsList = meds.map(m => `<div style="border-left:3px solid #10b981;padding-left:.8rem;margin-bottom:.6rem"><div style="color:#e8f0ff;font-weight:700">${esc(m.item)}</div>${m.dose ? `<div style="color:#8fa3bf;font-size:.85rem">${esc(m.dose)}</div>` : ''}<div style="color:#a3e635;font-size:.85rem">${esc(m.freq)}</div><button id="delhealth-${m.id}" type="button" style="margin-top:.3rem;padding:.3rem .6rem;background:#7f1d1d;border:1px solid #991b1b;color:#fca5a5;border-radius:6px;font-size:.75rem;cursor:pointer">Remove</button></div>`).join("");
    const appsList = apps.map(a => `<div style="border-left:3px solid #f59e0b;padding-left:.8rem;margin-bottom:.6rem"><div style="color:#e8f0ff;font-weight:700">${esc(a.item)}</div><div style="color:#8fa3bf;font-size:.85rem">${esc(a.date)}</div>${a.freq ? `<div style="color:#f59e0b;font-size:.85rem">${esc(a.freq)}</div>` : ''}<button id="delhealth-${a.id}" type="button" style="margin-top:.3rem;padding:.3rem .6rem;background:#7f1d1d;border:1px solid #991b1b;color:#fca5a5;border-radius:6px;font-size:.75rem;cursor:pointer">Remove</button></div>`).join("");

    const html = `
      <section style="padding:1rem;display:grid;gap:1.5rem">
        <div style="border:1px solid #10b981;border-radius:12px;padding:1rem;background:rgba(16,185,129,.05)">
          <h4 style="color:#e8f0ff;margin-bottom:.6rem">Add Entry</h4>
          <div style="margin-bottom:.6rem"><label style="color:#8fa3bf;font-size:.9rem">Type</label><select id="health-type" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff"><option value="medication">Medication</option><option value="appointment">Doctor Appointment</option></select></div>
          <div style="margin-bottom:.6rem"><label style="color:#8fa3bf;font-size:.9rem">Name</label><input id="health-item" type="text" placeholder="Medication name or doctor type..." style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff" /></div>
          <div style="margin-bottom:.6rem"><label style="color:#8fa3bf;font-size:.9rem">Dosage (optional)</label><input id="health-dose" type="text" placeholder="e.g., 5mg once daily..." style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff" /></div>
          <div style="margin-bottom:.6rem"><label style="color:#8fa3bf;font-size:.9rem">Frequency / Notes</label><input id="health-freq" type="text" placeholder="e.g., every morning, quarterly check-up..." style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff" /></div>
          <button id="health-add" type="button" style="width:100%;padding:.6rem;background:#10b981;color:#fff;border:1px solid #34d399;border-radius:8px;font-weight:700;cursor:pointer">Add Entry</button>
        </div>
        <div style="display:grid;gap:1rem">
          <div><h4 style="color:#e8f0ff;margin-bottom:.6rem">💊 Medications</h4>${medsList || '<p style="color:#8fa3bf;font-size:.85rem">No medications logged</p>'}</div>
          <div><h4 style="color:#e8f0ff;margin-bottom:.6rem">📋 Appointments</h4>${appsList || '<p style="color:#8fa3bf;font-size:.85rem">No appointments logged</p>'}</div>
        </div>
      </section>
    `;

    setContent({ title: "health" }, html, `<section style="padding:.5rem;color:#8fa3bf;font-size:.75rem">${meds.length} med${meds.length !== 1 ? 's' : ''} • ${apps.length} appt${apps.length !== 1 ? 's' : ''}</section>`, `<section style="padding:.5rem"><h4 style="color:#e8f0ff">Health</h4><p style="color:#8fa3bf;font-size:.75rem">Meds & appointments</p></section>`);

    document.getElementById("health-add").onclick = addEntry;
    entries.forEach(e => {
      const btn = document.getElementById(`delhealth-${e.id}`);
      if (btn) btn.onclick = () => deleteEntry(e.id);
    });
  }

  render();
}

function renderAgreements() {
  const storageKey = "cyberdeckAgreements";
  const noteTypes = [
    { key: "system rules", hint: "System-level rules and boundaries." },
    { key: "specific alter rules", hint: "Rules tied to specific alters." },
    { key: "system goals", hint: "Shared system goals and priorities." },
    { key: "specific alter goals", hint: "Goals tied to specific alters." },
    { key: "relationship rules", hint: "Rules for internal and external relationships." },
    { key: "note", hint: "General notes and context." }
  ];
  const emptyNotesByType = noteTypes.reduce((acc, type) => {
    acc[type.key] = "";
    return acc;
  }, {});
  let agreements = {
    notesByType: { ...emptyNotesByType },
    rules: [],
    goals: "",
    notes: ""
  };

  try {
    const stored = JSON.parse(safeGetStorage(storageKey) || "null");
    if (stored) {
      agreements = { ...agreements, ...stored };
      const loadedNotesByType = (stored.notesByType && typeof stored.notesByType === "object") ? stored.notesByType : {};
      agreements.notesByType = { ...emptyNotesByType, ...loadedNotesByType };

      // Migrate legacy fields into note types if typed notes do not already exist.
      if (!agreements.notesByType["system rules"] && Array.isArray(stored.rules)) {
        agreements.notesByType["system rules"] = stored.rules.join("\n");
      }
      if (!agreements.notesByType["system goals"] && typeof stored.goals === "string") {
        agreements.notesByType["system goals"] = stored.goals;
      }
      if (!agreements.notesByType["note"] && typeof stored.notes === "string") {
        agreements.notesByType["note"] = stored.notes;
      }
    }
  } catch (_) {}

  const noteTypeBlocks = noteTypes.map(type => {
    const id = "agreements-note-" + type.key.replace(/\s+/g, "-");
    return `
      <div style="border:1px solid #8b5cf6;border-radius:12px;padding:1rem;background:rgba(139,92,246,.05)">
        <h4 style="color:#e8f0ff;margin-bottom:.6rem;text-transform:capitalize">${esc(type.key)}</h4>
        <textarea id="${id}" placeholder="${esc(type.hint)}" style="width:100%;padding:.5rem;border:1px solid #404854;border-radius:8px;background:#1a1f2e;color:#e8f0ff;resize:vertical;min-height:90px">${esc(agreements.notesByType[type.key] || "")}</textarea>
      </div>
    `;
  }).join("");

  const html = `
    <section style="padding:1rem;display:grid;gap:1.5rem">
      ${noteTypeBlocks}
      <button id="save-agreements" type="button" style="padding:.7rem;background:#8b5cf6;border:1px solid #a78bfa;border-radius:8px;color:#fff;font-weight:700;cursor:pointer">Save Agreements</button>
    </section>
  `;

  const medium = `<section style="padding:.5rem;color:#8fa3bf;font-size:.75rem">Document system agreements using six note types.</section>`;
  const small = `<section style="padding:.5rem"><h4 style="color:#e8f0ff">Agreements</h4><p style="color:#8fa3bf;font-size:.75rem">Typed rules, goals, and notes</p></section>`;

  setContent({ title: "agreements" }, html, medium, small);

  document.getElementById("save-agreements").onclick = () => {
    const notesByType = {};
    noteTypes.forEach(type => {
      const id = "agreements-note-" + type.key.replace(/\s+/g, "-");
      notesByType[type.key] = document.getElementById(id).value;
    });

    agreements.notesByType = notesByType;

    // Keep legacy keys in sync for backward compatibility.
    agreements.rules = (notesByType["system rules"] || "").split("\n").map(line => line.trim()).filter(Boolean);
    agreements.goals = notesByType["system goals"] || "";
    agreements.notes = notesByType["note"] || "";

    safeSetStorage(storageKey, JSON.stringify(agreements));
    alert("Agreements saved!");
  };
}

function renderPluraldex() {
  loadPluraldex();
  const search = `
    <style>
      .pdx-shell {
        display:grid;
        gap:.7rem;
        padding:.85rem;
        border:1px solid rgba(195, 192, 255, .36);
        border-radius:16px;
        background:
          radial-gradient(115% 120% at 6% -12%, rgba(255, 219, 245, .24), transparent 48%),
          radial-gradient(115% 130% at 100% 0%, rgba(157, 224, 255, .18), transparent 50%),
          linear-gradient(160deg, #131227 0%, #181a33 55%, #1d2140 100%);
        box-shadow:0 18px 34px rgba(4, 6, 14, .42);
      }
      .pdx-toolbar { display:flex; gap:.55rem; flex-wrap:wrap; align-items:end; }
      .pdx-label {
        display:grid;
        gap:.25rem;
        min-width:220px;
        flex:1;
        color:#efe8ff;
        font:600 .9rem "Palatino Linotype", "Book Antiqua", Georgia, serif;
      }
      #pdx-search {
        width:100%;
        border:1px solid rgba(215, 205, 255, .42);
        border-radius:10px;
        background:rgba(16, 18, 36, .72);
        color:#f3eeff;
        padding:.52rem .62rem;
      }
      #pdx-search::placeholder { color:#bdb7de; }
      #pdx-add {
        width:auto;
        border-radius:999px;
        border:1px solid rgba(249, 237, 255, .5);
        background:linear-gradient(180deg, #fbe6ff, #cfbaff);
        color:#2f2258;
        font-weight:700;
        box-shadow:0 8px 18px rgba(140, 124, 230, .34);
      }
      #pdx-add:hover { transform:translateY(-1px); }

      .pdx-grid {
        display:grid;
        grid-template-columns:repeat(10, minmax(0, 1fr));
        justify-content:start;
        align-content:start;
        column-gap:14px;
        row-gap:14px;
        overflow-y:auto;
        flex:1;
        min-height:0;
        padding:8px 8px 8px 4px;
      }
      .pluracard {
        position:relative;
        border:1px solid rgba(219, 202, 255, .3);
        border-radius:12px;
        background:linear-gradient(180deg, rgba(35,35,62,.9), rgba(19,20,40,.93));
        box-shadow:0 12px 20px rgba(5, 7, 15, .35), inset 0 0 20px rgba(229, 211, 255, .08);
        transition:transform .15s ease, border-color .15s ease, box-shadow .15s ease;
      }
      .pluracard::after {
        content:"";
        position:absolute;
        inset:0;
        background:linear-gradient(180deg, transparent 42%, rgba(7,8,18,.68) 80%, rgba(7,8,18,.9) 100%);
        pointer-events:none;
      }
      .pluracard:hover {
        transform:translateY(-2px) scale(1.01);
        border-color:rgba(235, 219, 255, .62);
        box-shadow:0 16px 24px rgba(7, 8, 18, .44), 0 0 18px rgba(174, 150, 255, .24);
      }
      .entry-img { width:100%; height:100%; object-fit:cover; filter:saturate(1.06) contrast(1.04); }
      .entry-name,
      .entry-tags {
        display:block;
        position:absolute;
        left:.45rem;
        right:.45rem;
        z-index:2;
        margin:0;
        text-shadow:0 1px 6px rgba(5, 6, 13, .9);
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      .entry-name {
        bottom:1.08rem;
        color:#fbf4ff;
        font:700 .82rem "Palatino Linotype", "Book Antiqua", Georgia, serif;
      }
      .entry-tags { bottom:.34rem; color:#d6c8ff; font-size:.68rem; }

      .sp-profile {
        border:1px solid rgba(206, 193, 255, .38);
        border-radius:14px;
        background:
          radial-gradient(130% 120% at 18% -10%, rgba(250, 213, 255, .14), transparent 46%),
          radial-gradient(120% 130% at 100% 0%, rgba(167, 223, 255, .12), transparent 52%),
          linear-gradient(165deg, #16162c 0%, #1c1f3b 50%, #202443 100%);
      }
      .sp-banner { height:56px; }
      .sp-avatar {
                background:rgba(255, 255, 255, .1);
        height:68px;
        border:3px solid rgba(246, 232, 255, .9);
        box-shadow:0 8px 20px rgba(6, 8, 14, .45), 0 0 16px rgba(189, 163, 255, .25);
      }
      .sp-body { padding:34px 12px 10px; }
      .sp-name { color:#fff4ff; font-family:"Palatino Linotype", "Book Antiqua", Georgia, serif; }
      .sp-pronouns { color:#c9c1ea; }
      .sp-term-pill { background:rgba(240, 225, 255, .18); color:#f3e8ff; border:1px solid rgba(232, 213, 255, .35); }
      .sp-section { border-top:1px solid rgba(186, 170, 238, .22); }
      .sp-section-title { color:#a59cc8; }
      .sp-section-body { color:#efeafd; }
      .sp-info-item { background:rgba(20, 23, 45, .72); border:1px solid rgba(170, 160, 213, .2); }
      .sp-info-label { color:#9b93bf; }
      .sp-info-val { color:#f5edff; }
      .sp-trigger-pill { background:rgba(21, 24, 43, .88); border:1px solid rgba(190, 178, 236, .26); color:#efeaff; }
      .sp-actions button { background:linear-gradient(180deg, #262b4e, #1a1f3d); border:1px solid rgba(181, 170, 229, .4); color:#ece6ff; }
      .sp-actions button:hover { background:linear-gradient(180deg, #2f3662, #20284a); }
      .sp-edit-form label { color:#c5bddf; }
      .sp-edit-form input,
      .sp-edit-form textarea,
      .sp-edit-form select {
        background:rgba(12, 16, 34, .88);
        border:1px solid rgba(180, 168, 224, .4);
        color:#f2ecff;
      }

      @media (max-width: 1400px) { .pdx-grid { grid-template-columns:repeat(8, minmax(0, 1fr)); column-gap:12px; row-gap:12px; } }
      @media (max-width: 980px) { .pdx-grid { grid-template-columns:repeat(6, minmax(0, 1fr)); column-gap:10px; row-gap:10px; } }
      @media (max-width: 640px) { .pdx-grid { grid-template-columns:repeat(4, minmax(0, 1fr)); column-gap:8px; row-gap:8px; } }
    </style>
    <section class="pdx-shell">
      <div class="pdx-toolbar">
        <label class="pdx-label">Search Pluraldex
          <input id="pdx-search" placeholder="name, pronoun, trait" />
        </label>
        <button id="pdx-add">Add Profile</button>
      </div>
      <div id="pdx-list" class="pdx-grid"></div>
    </section>
  `;
  setContent(
    {title: "pluraldex"},
    search,
    "<p style='color:#c8bce9'>Select a profile to reveal it in the moonlit panel.</p>",
    renderPluraldexTertiaryPortrait(null)
  );

  const listEl = document.getElementById("pdx-list");
  const detailEl = els.medium;
  const searchInput = document.getElementById("pdx-search");
  const nameCollator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });

  function renderList(filter = "") {
    const query = filter.trim().toLowerCase();
    listEl.innerHTML = "";
    const entries = pluraldexData
      .filter(item => {
        if (!query) return true;
        const hay = `${item.name} ${item.pronouns} ${item.terms?.join(" ") || ""} ${item.description || ""}`.toLowerCase();
        return hay.includes(query);
      })
      .sort((left, right) => nameCollator.compare(left.name || "", right.name || ""));
    if (!entries.length) {
      listEl.innerHTML = '<p style="margin:.5rem;color:#cdc2ea">No profiles matched this search.</p>';
      return;
    }

    entries.forEach(item => {
      const card = document.importNode(els.pluraldexTemplate.content, true);
      const img = card.querySelector(".entry-img");
      img.src = item.image || `https://api.dicebear.com/6.x/lorelei/svg?seed=${encodeURIComponent(item.name)}`;
      img.alt = `${item.name} avatar`;
      img.title = item.name;
      const nameEl = card.querySelector(".entry-name");
      const tagsEl = card.querySelector(".entry-tags");
      if (nameEl) nameEl.textContent = item.name || "Unnamed";
      if (tagsEl) {
        const tagText = [
          item.pronouns,
          item.terms && item.terms.length ? item.terms.slice(0, 2).join(" • ") : ""
        ].filter(Boolean).join(" • ");
        tagsEl.textContent = tagText || "profile";
      }
      card.querySelector("article").addEventListener("click", () => showDetail(item));
      listEl.appendChild(card);
    });
  }

  function showDetail(item) {
    state.pluraldexSelection = item.id;
    detailEl.innerHTML = profileView(item); detailEl.scrollTop = 0;
    els.small.innerHTML = renderPluraldexTertiaryPortrait(item);
    attachViewHandlers(item, detailEl, searchInput, renderList);
  }

  document.getElementById("pdx-add").onclick = function() {
    detailEl.innerHTML = profileEditForm({});
    detailEl.scrollTop = 0;
    els.small.innerHTML = renderPluraldexTertiaryPortrait(null);
    attachFormHandlers({}, detailEl, searchInput, renderList);
  };
  renderList();
  if (state.pluraldexSelection != null) {
    const selected = pluraldexData.find(item => item.id === state.pluraldexSelection);
    if (selected) showDetail(selected);
  }
  searchInput.addEventListener("input", e => renderList(e.target.value));
}

function renderGames() {
  const content = `
    <section id="retro-games" style="display:grid;gap:.8rem">
      <style>
        #retro-games * { min-width: 0; }
        #retro-games {
          padding:.8rem;
          border:1px solid #4d4a39;
          border-radius:18px;
          background:
            radial-gradient(120% 120% at 15% 0%, rgba(255,255,255,.08), transparent 30%),
            linear-gradient(180deg, #847c63 0%, #6e6854 16%, #54503f 100%);
          box-shadow: inset 0 2px 0 rgba(255,255,255,.14), 0 18px 32px rgba(0,0,0,.34);
        }
        #retro-games .retro-brand {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:.6rem;
          color:#1e231b;
        }
        #retro-games .retro-brand h3 {
          margin:.15rem 0;
          font:700 1.1rem "Courier New", Consolas, monospace;
          letter-spacing:.08em;
          text-transform:uppercase;
        }
        #retro-games .retro-dotline {
          font:700 .7rem "Courier New", Consolas, monospace;
          color:#2f3528;
          letter-spacing:.14em;
          opacity:.8;
        }
        #retro-games #game-area {
          position:relative;
          border:10px solid #2d3128;
          border-radius:18px;
          padding:1rem;
          flex:1;
          min-height:0;
          background:
            linear-gradient(180deg, rgba(183, 208, 156, .12), rgba(88, 112, 70, .08)),
            radial-gradient(120% 120% at 50% 0%, rgba(192, 221, 161, .12), transparent 45%),
            #141b12;
          box-shadow:
            inset 0 0 0 2px rgba(183, 208, 156, .06),
            inset 0 0 32px rgba(133, 163, 98, .12),
            0 10px 20px rgba(0,0,0,.3);
          overflow:auto;
        }
        #retro-games #game-area::before {
          content:"";
          position:absolute;
          inset:0;
          background:repeating-linear-gradient(180deg, rgba(214,255,176,.045), rgba(214,255,176,.045) 2px, transparent 2px, transparent 4px);
          pointer-events:none;
          mix-blend-mode:screen;
        }
        #retro-games #game-area::after {
          content:"";
          position:absolute;
          inset:0;
          background:radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,.24) 100%);
          pointer-events:none;
        }
        #retro-games .retro-boot {
          display:grid;
          place-items:center;
          min-height:0;
          flex:1;
          text-align:center;
          color:#c9eba3;
          font-family:"Courier New", Consolas, monospace;
          text-shadow:0 0 8px rgba(177, 223, 126, .14);
        }
        #retro-games .retro-boot strong {
          display:block;
          font-size:1.3rem;
          letter-spacing:.12em;
          text-transform:uppercase;
          margin-bottom:.6rem;
        }
        #retro-games canvas { image-rendering: pixelated; box-shadow:0 0 18px rgba(0,0,0,.26); }
      </style>
      <div class="retro-brand">
        <h3>Pixel Arcade System</h3>
        <div class="retro-dotline">8-BIT MODE READY</div>
      </div>
      <div id="game-area">
        <div class="retro-boot">
          <div>
            <strong>Insert Cartridge</strong>
            <div>Select a game from the right panel to boot the console.</div>
          </div>
        </div>
      </div>
    </section>
  `;
  const medium = `
    <section id="retro-games-menu" style="display:grid;gap:.7rem;align-content:start">
      <style>
        #retro-games-menu {
          padding:.8rem;
          border:1px solid #4d4a39;
          border-radius:18px;
          background:linear-gradient(180deg, #7b745d 0%, #625c49 100%);
          box-shadow: inset 0 2px 0 rgba(255,255,255,.1), 0 14px 28px rgba(0,0,0,.24);
        }
        #retro-games-menu h4 {
          margin:.15rem 0;
          color:#1f251d;
          font:700 1rem "Courier New", Consolas, monospace;
          text-transform:uppercase;
          letter-spacing:.08em;
        }
        #retro-games-menu .retro-menu-list { display:grid; gap:.5rem; }
        #retro-games-menu button {
          width:100%;
          text-align:left;
          padding:.7rem .8rem;
          border:1px solid #2e3328;
          border-radius:12px;
          background:linear-gradient(180deg, #34392d, #20251d);
          color:#d6efb5;
          font:700 .86rem "Courier New", Consolas, monospace;
          letter-spacing:.04em;
          text-transform:uppercase;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
        }
        #retro-games-menu button:hover {
          background:linear-gradient(180deg, #3d4434, #262c22);
          transform:translateY(-1px);
        }
        #retro-games-menu .retro-menu-hint {
          margin:.1rem 0;
          color:#21261d;
          font:700 .74rem "Courier New", Consolas, monospace;
          opacity:.85;
        }
      </style>
      <h4>Cartridge Bay</h4>
      <div class="retro-menu-list">
        <button id="game-snake">Play Pixel Snake</button>
        <button id="game-solitaire">Open Pixel Solitaire</button>
        <button id="game-pong">Play Pixel Pong</button>
        <button id="game-tap">Play Pixel Tap Rush</button>
        <button id="game-memory">Play Pixel Memory Match</button>
      </div>
      <p class="retro-menu-hint">Pick a cartridge to boot it on the main screen.</p>
    </section>
  `;
  const tertiary = `
    <div id="game-cat-widget" style="display:grid;gap:.6rem;justify-items:center;align-content:start;padding:.8rem;border:1px solid #4d4a39;border-radius:18px;background:linear-gradient(180deg,#7c755f 0%, #625b47 100%);box-shadow: inset 0 2px 0 rgba(255,255,255,.1), 0 14px 28px rgba(0,0,0,.24);">
      <h4 style="margin:.2rem 0;color:#1f251d;font:700 .98rem 'Courier New', Consolas, monospace;text-transform:uppercase;letter-spacing:.08em">Pocket Pet</h4>
      <canvas id="game-cat-canvas" width="176" height="176" style="image-rendering:pixelated;border:8px solid #2d3128;border-radius:14px;background:#141b12;cursor:pointer;box-shadow:inset 0 0 0 2px rgba(183,208,156,.06),0 8px 18px rgba(0,0,0,.26)"></canvas>
      <p id="game-cat-stats" style="margin:0;font:.74rem 'Courier New', Consolas, monospace;color:#21261d;text-align:center"></p>
      <div class="stat-row" style="justify-content:center">
        <button id="game-cat-feed">Feed</button>
        <button id="game-cat-play">Play</button>
        <button id="game-cat-pet">Pet</button>
      </div>
    </div>
  `;
  setContent({title: "games"}, content, tertiary, medium);
  const gameArea = document.getElementById("game-area");

  document.getElementById("game-snake").addEventListener("click", () => initSnake(gameArea));
  document.getElementById("game-solitaire").addEventListener("click", () => initSolitaire(gameArea));
  document.getElementById("game-pong").addEventListener("click", () => initPixelPong(gameArea));
  document.getElementById("game-tap").addEventListener("click", () => initPixelTapRush(gameArea));
  document.getElementById("game-memory").addEventListener("click", () => initPixelMemoryMatch(gameArea));
  initGameCatSprite();
}

function loadGameHighscores() {
  try {
    const parsed = JSON.parse(safeGetStorage("cyberdeckMiniGameHighscores") || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getGameHighscore(gameId) {
  const scores = loadGameHighscores();
  return scores[gameId];
}

function setGameHighscore(gameId, value, mode) {
  const scores = loadGameHighscores();
  const current = Number(scores[gameId]);
  const next = Number(value);
  if (!Number.isFinite(next)) {
    return Number.isFinite(current) ? current : null;
  }

  let shouldUpdate = false;
  if (!Number.isFinite(current)) {
    shouldUpdate = true;
  } else if (mode === "min") {
    shouldUpdate = next < current;
  } else {
    shouldUpdate = next > current;
  }

  if (shouldUpdate) {
    scores[gameId] = next;
    safeSetStorage("cyberdeckMiniGameHighscores", JSON.stringify(scores));
    return next;
  }

  return current;
}

function initGameCatSprite() {
  const canvas = document.getElementById("game-cat-canvas");
  const statsEl = document.getElementById("game-cat-stats");
  const feedBtn = document.getElementById("game-cat-feed");
  const playBtn = document.getElementById("game-cat-play");
  const petBtn = document.getElementById("game-cat-pet");
  if (!canvas || !statsEl || !feedBtn || !playBtn || !petBtn) return;

  if (state.gameCatTimer) clearInterval(state.gameCatTimer);
  if (state.gameCatAnim) cancelAnimationFrame(state.gameCatAnim);

  const cat = state.gameCat;
  const ctx = canvas.getContext("2d");
  const px = 4;
  let t = 0;

  function clamp(n) { return Math.max(0, Math.min(100, n)); }
  function renderStats() {
    const mood = cat.happiness > 70 ? "happy" : cat.happiness < 30 ? "grumpy" : "calm";
    statsEl.textContent = `Mood: ${mood} | Hunger ${Math.round(cat.hunger)} | Happy ${Math.round(cat.happiness)} | Energy ${Math.round(cat.energy)}`;
  }

  function drawCat() {
    t += 1;
    ctx.fillStyle = "#050a12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 8; i++) {
      const twinkle = ((t + i * 11) % 24) < 10;
      ctx.fillStyle = twinkle ? "#93c5fd" : "#334155";
      ctx.fillRect((6 + i * 5) * px, (3 + (i % 3) * 5) * px, px, px);
    }

    const bob = Math.round(Math.sin(t / 10) * 1.5);
    const x = 16;
    const y = 17 + bob;
    const sleeping = cat.energy < 18;

    const fill = (dx, dy, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect((x + dx) * px, (y + dy) * px, w * px, h * px);
    };

    const fur = cat.happiness < 30 ? "#a78b6d" : "#d6b38d";
    fill(2, 4, 12, 8, fur);
    fill(0, 6, 2, 4, fur);
    fill(14, 6, 2, 4, fur);
    fill(4, 2, 8, 4, fur);
    fill(4, 0, 2, 2, fur);
    fill(10, 0, 2, 2, fur);

    if (sleeping) {
      fill(6, 4, 2, 1, "#111827");
      fill(9, 4, 2, 1, "#111827");
    } else {
      fill(6, 4, 1, 1, "#111827");
      fill(10, 4, 1, 1, "#111827");
    }
    fill(8, 5, 1, 1, "#b91c1c");

    const tailWave = Math.round(Math.sin(t / 6) * 2);
    fill(-2 + tailWave, 9, 3, 1, fur);
    fill(-3 + tailWave, 8, 1, 2, fur);

    if (sleeping) {
      ctx.fillStyle = "#bfdbfe";
      ctx.fillText("z", (x + 14) * px, (y + 1) * px);
      ctx.fillText("z", (x + 16) * px, (y - 1) * px);
    }

    state.gameCatAnim = requestAnimationFrame(drawCat);
  }

  function pet() {
    cat.happiness = clamp(cat.happiness + 6);
    cat.energy = clamp(cat.energy - 1);
    renderStats();
  }

  feedBtn.onclick = () => {
    cat.hunger = clamp(cat.hunger - 18);
    cat.energy = clamp(cat.energy + 4);
    cat.happiness = clamp(cat.happiness + 3);
    renderStats();
  };
  playBtn.onclick = () => {
    cat.happiness = clamp(cat.happiness + 10);
    cat.hunger = clamp(cat.hunger + 6);
    cat.energy = clamp(cat.energy - 9);
    renderStats();
  };
  petBtn.onclick = pet;
  canvas.onclick = pet;

  state.gameCatTimer = setInterval(() => {
    cat.hunger = clamp(cat.hunger + 2.3);
    cat.energy = clamp(cat.energy - 1.7);
    if (cat.hunger > 75 || cat.energy < 20) cat.happiness = clamp(cat.happiness - 2.6);
    if (cat.hunger < 45 && cat.energy > 40) cat.happiness = clamp(cat.happiness + 0.8);
    renderStats();
  }, 1800);

  renderStats();
  drawCat();
}

function initSnake(container) {
  container.innerHTML = `<div><canvas id="snakeCanvas" width="360" height="360" style="border:1px solid #2f3a48;background:#06121f"></canvas><p id="snake-hud">Score: 0</p><p id="snake-high" style="color:#8b949e;margin:.2rem 0"></p><p>Use arrow keys. Press Space to pause/resume.</p></div>`;
  const canvas = container.querySelector("#snakeCanvas");
  const hud = container.querySelector("#snake-hud");
  const highHud = container.querySelector("#snake-high");
  const ctx = canvas.getContext("2d");
  const scale = 20;
  const cols = canvas.width / scale;
  const rows = canvas.height / scale;
  const tickMs = 130;
  let snake = [{x: 5, y: 5}];
  let dir = {x: 1, y: 0};
  let nextDir = {x: 1, y: 0};
  let fruit = randomFruit();
  let running = true;
  let paused = false;
  let score = 0;
  let best = Number(getGameHighscore("snake")) || 0;
  let lastTick = 0;
  let raf = 0;

  function renderBest() {
    highHud.textContent = `Highscore: ${best}`;
  }

  if (state.snakeKeyHandler) {
    document.removeEventListener("keydown", state.snakeKeyHandler);
    state.snakeKeyHandler = null;
  }

  function randomFruit() { return {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)}; }
  function step() {
    if (!running) return;
    dir = nextDir;
    const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some(s => s.x===head.x && s.y===head.y)) {
      running = false;
      return;
    }
    snake.unshift(head);
    if (head.x === fruit.x && head.y === fruit.y) {
      fruit = randomFruit();
      score += 1;
      hud.textContent = `Score: ${score}`;
      if (score > best) {
        best = setGameHighscore("snake", score, "max") || score;
        renderBest();
      }
    } else {
      snake.pop();
    }
  }

  function draw() {
    ctx.fillStyle = '#06121f';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#79c0ff';
    snake.forEach(cell => ctx.fillRect(cell.x*scale, cell.y*scale, scale-1, scale-1));
    ctx.fillStyle = '#ff7b72';
    ctx.fillRect(fruit.x*scale, fruit.y*scale, scale-1, scale-1);
    if (paused && running) {
      ctx.fillStyle = "rgba(2,8,23,.55)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#bfdbfe";
      ctx.font = "14px Segoe UI";
      ctx.fillText("Paused", 96, 122);
    }
  }

  function reset() {
    snake = [{x: 5, y: 5}];
    dir = {x: 1, y: 0};
    nextDir = {x: 1, y: 0};
    fruit = randomFruit();
    running = true;
    paused = false;
    score = 0;
    hud.textContent = "Score: 0";
    lastTick = 0;
  }

  function loop(ts) {
    if (!canvas.isConnected) {
      if (state.snakeKeyHandler) {
        document.removeEventListener("keydown", state.snakeKeyHandler);
        state.snakeKeyHandler = null;
      }
      if (state.snakeAnim) {
        cancelAnimationFrame(state.snakeAnim);
        state.snakeAnim = null;
      }
      return;
    }
    if (!lastTick) lastTick = ts;
    if (!paused && ts - lastTick >= tickMs) {
      step();
      lastTick = ts;
    }
    draw();
    if (!running) {
      const msg = container.querySelector("#snake-over");
      if (!msg) {
        const p = document.createElement("p");
        p.id = "snake-over";
        p.textContent = "Game over. Press any key to restart.";
        container.appendChild(p);
      }
    }
    raf = requestAnimationFrame(loop);
    state.snakeAnim = raf;
  }

  const keyHandler = e => {
    if (e.code === "Space") {
      e.preventDefault();
      if (running) {
        paused = !paused;
        if (!paused) lastTick = 0;
      }
      return;
    }
    if (e.key.includes("Arrow")) {
      const m = {ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0}}[e.key];
      if (m && (m.x !== -dir.x || m.y !== -dir.y)) nextDir = m;
    }
    if (!running && e.key) {
      reset();
      const msg = container.querySelector("#snake-over");
      if (msg) msg.remove();
    }
  };
  document.addEventListener("keydown", keyHandler);
  state.snakeKeyHandler = keyHandler;

  if (state.snakeAnim) cancelAnimationFrame(state.snakeAnim);
  raf = requestAnimationFrame(loop);
  state.snakeAnim = raf;
  renderBest();
}

function initSolitaire(container) {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const suitGlyph = { hearts: "♥", diamonds: "♦", clubs: "♣", spades: "♠" };
  const rankLabel = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const isRed = suit => suit === "hearts" || suit === "diamonds";

  const game = {
    stock: [],
    waste: [],
    foundations: { hearts: [], diamonds: [], clubs: [], spades: [] },
    tableau: [[], [], [], [], [], [], []],
    selected: null,
    moves: 0,
  };
  let bestMoves = Number(getGameHighscore("solitaireMoves"));
  if (!Number.isFinite(bestMoves) || bestMoves <= 0) bestMoves = null;

  function cardId(suit, rank, i) {
    return `${suit}-${rank}-${i}`;
  }

  function buildDeck() {
    const deck = [];
    let i = 0;
    suits.forEach(suit => {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push({ id: cardId(suit, rank, i++), suit, rank, faceUp: false });
      }
    });
    return deck;
  }

  function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = deck[i];
      deck[i] = deck[j];
      deck[j] = tmp;
    }
  }

  function startGame() {
    const deck = buildDeck();
    shuffle(deck);
    game.stock = [];
    game.waste = [];
    game.foundations = { hearts: [], diamonds: [], clubs: [], spades: [] };
    game.tableau = [[], [], [], [], [], [], []];
    game.selected = null;
    game.moves = 0;

    for (let col = 0; col < 7; col++) {
      for (let n = 0; n <= col; n++) {
        const c = deck.pop();
        c.faceUp = n === col;
        game.tableau[col].push(c);
      }
    }
    game.stock = deck;
    render();
  }

  function topCardLabel(card) {
    return `${rankLabel[card.rank]}${suitGlyph[card.suit]}`;
  }

  function cardHtml(card, extra = "") {
    if (!card.faceUp) {
      return `<div class="sol-card sol-back ${extra}"></div>`;
    }
    const red = isRed(card.suit) ? "sol-red" : "sol-black";
    return `<div class="sol-card ${red} ${extra}">${rankLabel[card.rank]}${suitGlyph[card.suit]}</div>`;
  }

  function canMoveToFoundation(card, suit) {
    if (card.suit !== suit) return false;
    const pile = game.foundations[suit];
    if (!pile.length) return card.rank === 1;
    return pile[pile.length - 1].rank + 1 === card.rank;
  }

  function canMoveToTableau(card, destPile) {
    if (!destPile.length) return card.rank === 13;
    const destTop = destPile[destPile.length - 1];
    if (!destTop.faceUp) return false;
    return isRed(destTop.suit) !== isRed(card.suit) && destTop.rank === card.rank + 1;
  }

  function clearSelection() {
    game.selected = null;
  }

  function revealLastTableau(col) {
    const pile = game.tableau[col];
    if (pile.length && !pile[pile.length - 1].faceUp) pile[pile.length - 1].faceUp = true;
  }

  function tryMoveSelectedToFoundation(suit) {
    if (!game.selected) return false;
    if (game.selected.cards.length !== 1) return false;
    const card = game.selected.cards[0];
    if (!canMoveToFoundation(card, suit)) return false;

    if (game.selected.type === "waste") {
      game.waste.pop();
    } else if (game.selected.type === "tableau") {
      game.tableau[game.selected.col].splice(game.selected.startIndex);
      revealLastTableau(game.selected.col);
    } else if (game.selected.type === "foundation") {
      game.foundations[game.selected.suit].pop();
    }

    game.foundations[suit].push(card);
    clearSelection();
    return true;
  }

  function tryMoveSelectedToTableau(destCol) {
    if (!game.selected) return false;
    const moving = game.selected.cards;
    const first = moving[0];
    const dest = game.tableau[destCol];
    if (!canMoveToTableau(first, dest)) return false;

    if (game.selected.type === "waste") {
      game.waste.pop();
    } else if (game.selected.type === "tableau") {
      game.tableau[game.selected.col].splice(game.selected.startIndex);
      revealLastTableau(game.selected.col);
    } else if (game.selected.type === "foundation") {
      game.foundations[game.selected.suit].pop();
    }

    moving.forEach(card => dest.push(card));
    clearSelection();
    return true;
  }

  function checkWin() {
    return suits.every(suit => game.foundations[suit].length === 13);
  }

  function render() {
    container.innerHTML = `
      <style>
        .sol-wrap { display:grid; gap:.8rem; }
        .sol-top { display:grid; gap:.4rem; grid-template-columns: repeat(6, minmax(48px, auto)); align-items:start; }
        .sol-pile { min-height:68px; min-width:48px; border:1px dashed #334155; border-radius:8px; padding:3px; background:#0b1220; }
        .sol-pile-title { font-size:.68rem; color:#6e7681; margin-bottom:4px; text-transform:uppercase; }
        .sol-tableau { display:grid; grid-template-columns: repeat(7, minmax(48px, 1fr)); gap:.35rem; }
        .sol-col { min-height:208px; border:1px dashed #334155; border-radius:8px; padding:3px; background:#0b1220; }
        .sol-card { width:44px; height:62px; border:1px solid #94a3b8; border-radius:6px; background:#f8fafc; display:flex; align-items:center; justify-content:center; font-size:.8rem; font-weight:700; margin-top:3px; user-select:none; }
        .sol-back { background: repeating-linear-gradient(45deg,#1f2937,#1f2937 6px,#334155 6px,#334155 12px); border-color:#64748b; }
        .sol-red { color:#b91c1c; }
        .sol-black { color:#111827; }
        .sol-sel { outline:2px solid #22d3ee; }
      </style>
      <div class="sol-wrap">
        <div class="sol-top">
          <div class="sol-pile" id="sol-stock"><div class="sol-pile-title">Stock</div>${game.stock.length ? '<div class="sol-card sol-back"></div>' : ''}</div>
          <div class="sol-pile" id="sol-waste"><div class="sol-pile-title">Waste</div>${game.waste.length ? cardHtml(game.waste[game.waste.length - 1], game.selected && game.selected.type === 'waste' ? 'sol-sel' : '') : ''}</div>
          ${suits.map(suit => {
            const top = game.foundations[suit][game.foundations[suit].length - 1];
            const selected = game.selected && game.selected.type === 'foundation' && game.selected.suit === suit ? 'sol-sel' : '';
            return `<div class="sol-pile" data-foundation="${suit}"><div class="sol-pile-title">${suit}</div>${top ? cardHtml(top, selected) : ''}</div>`;
          }).join('')}
        </div>
        <div class="sol-tableau">
          ${game.tableau.map((pile, col) => `
            <div class="sol-col" data-col="${col}">
              ${pile.map((card, idx) => {
                const selected = game.selected && game.selected.type === 'tableau' && game.selected.col === col && idx >= game.selected.startIndex ? 'sol-sel' : '';
                return `<div data-card-col="${col}" data-card-idx="${idx}">${cardHtml(card, selected)}</div>`;
              }).join('')}
            </div>
          `).join('')}
        </div>
        <div style="color:#8b949e;font-size:.8rem">Tip: click cards to select, then click a destination pile. Click stock to draw/recycle.</div>
        <div style="color:#8b949e;font-size:.8rem">Moves: ${game.moves} | Best: ${bestMoves == null ? "-" : bestMoves}</div>
      </div>
    `;

    const stockEl = container.querySelector("#sol-stock");
    const wasteEl = container.querySelector("#sol-waste");

    stockEl.onclick = () => {
      if (game.stock.length) {
        const c = game.stock.pop();
        c.faceUp = true;
        game.waste.push(c);
      } else {
        while (game.waste.length) {
          const c = game.waste.pop();
          c.faceUp = false;
          game.stock.push(c);
        }
      }
      game.moves += 1;
      clearSelection();
      render();
    };

    wasteEl.onclick = () => {
      if (!game.waste.length) return;
      const card = game.waste[game.waste.length - 1];
      game.selected = { type: "waste", cards: [card] };
      render();
    };

    container.querySelectorAll("[data-foundation]").forEach(el => {
      el.onclick = () => {
        const suit = el.dataset.foundation;
        if (game.selected) {
          if (tryMoveSelectedToFoundation(suit)) {
            game.moves += 1;
            render();
            if (checkWin()) {
              const updated = setGameHighscore("solitaireMoves", game.moves, "min");
              if (updated != null) bestMoves = updated;
              alert(`Solitaire complete! Moves: ${game.moves}${bestMoves != null ? ` | Best: ${bestMoves}` : ""}`);
            }
            return;
          }
        } else if (game.foundations[suit].length) {
          const card = game.foundations[suit][game.foundations[suit].length - 1];
          game.selected = { type: "foundation", suit, cards: [card] };
          render();
          return;
        }
        clearSelection();
        render();
      };
    });

    container.querySelectorAll("[data-card-col]").forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        const col = Number(el.dataset.cardCol);
        const idx = Number(el.dataset.cardIdx);
        const pile = game.tableau[col];
        const card = pile[idx];

        if (!card.faceUp) {
          if (idx === pile.length - 1) {
            card.faceUp = true;
            clearSelection();
            render();
          }
          return;
        }

        if (game.selected) {
          if (tryMoveSelectedToTableau(col)) {
            render();
            return;
          }
        }

        game.selected = { type: "tableau", col, startIndex: idx, cards: pile.slice(idx) };
        render();
      };
    });

    container.querySelectorAll("[data-col]").forEach(el => {
      el.onclick = () => {
        const col = Number(el.dataset.col);
        if (!game.selected) return;
        if (tryMoveSelectedToTableau(col)) {
          game.moves += 1;
          render();
          return;
        }
        clearSelection();
        render();
      };
    });
  }

  startGame();
}

function initPixelPong(container) {
  container.innerHTML = `
    <div style="display:grid;gap:.5rem">
      <canvas id="pong-canvas" width="320" height="200" style="border:1px solid #2f3a48;background:#050d18;image-rendering:pixelated"></canvas>
      <p id="pong-hud" style="margin:0;color:#8b949e">Move your mouse or finger to control the bottom paddle. First to 7 wins.</p>
    </div>
  `;
  const canvas = container.querySelector("#pong-canvas");
  const hud = container.querySelector("#pong-hud");
  const ctx = canvas.getContext("2d");

  const player = { x: 128, y: canvas.height - 14, w: 64, h: 6, speed: 6 };
  const cpu = { x: 128, y: 8, w: 64, h: 6, speed: 3.2 };
  const ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 2.7, vy: 2.1, s: 6 };
  let playerScore = 0;
  let cpuScore = 0;
  let rally = 0;
  let bestRally = Number(getGameHighscore("pongRally")) || 0;
  let ended = false;

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function resetBall(dirY) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * (2.4 + Math.random() * 1.2);
    ball.vy = dirY * (2 + Math.random() * 1.2);
  }

  function draw() {
    ctx.fillStyle = "#050d18";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#10223a";
    for (let y = 0; y < canvas.height; y += 10) ctx.fillRect(canvas.width / 2 - 1, y, 2, 5);

    ctx.fillStyle = "#9ed0ff";
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillRect(cpu.x, cpu.y, cpu.w, cpu.h);

    ctx.fillStyle = "#ffb86b";
    ctx.fillRect(ball.x, ball.y, ball.s, ball.s);
  }

  function step() {
    if (ended) return;
    cpu.x += clamp((ball.x - (cpu.x + cpu.w / 2)) * 0.12, -cpu.speed, cpu.speed);
    cpu.x = clamp(cpu.x, 0, canvas.width - cpu.w);

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x <= 0 || ball.x + ball.s >= canvas.width) {
      ball.vx *= -1;
      ball.x = clamp(ball.x, 0, canvas.width - ball.s);
    }

    const hitPlayer = ball.y + ball.s >= player.y && ball.y <= player.y + player.h && ball.x + ball.s >= player.x && ball.x <= player.x + player.w;
    const hitCpu = ball.y <= cpu.y + cpu.h && ball.y + ball.s >= cpu.y && ball.x + ball.s >= cpu.x && ball.x <= cpu.x + cpu.w;

    if (hitPlayer && ball.vy > 0) {
      ball.vy *= -1;
      ball.vx += ((ball.x + ball.s / 2) - (player.x + player.w / 2)) * 0.03;
      rally += 1;
      if (rally > bestRally) {
        bestRally = setGameHighscore("pongRally", rally, "max") || rally;
      }
    }
    if (hitCpu && ball.vy < 0) {
      ball.vy *= -1;
      ball.vx += ((ball.x + ball.s / 2) - (cpu.x + cpu.w / 2)) * 0.02;
      rally += 1;
      if (rally > bestRally) {
        bestRally = setGameHighscore("pongRally", rally, "max") || rally;
      }
    }

    if (ball.y < -10) {
      playerScore += 1;
      rally = 0;
      resetBall(1);
    }
    if (ball.y > canvas.height + 10) {
      cpuScore += 1;
      rally = 0;
      resetBall(-1);
    }

    if (playerScore >= 7 || cpuScore >= 7) {
      ended = true;
      hud.textContent = playerScore > cpuScore ? "You win Pixel Pong! Click canvas to play again." : "CPU wins this round. Click canvas to rematch.";
    } else {
      hud.textContent = `You ${playerScore} : ${cpuScore} CPU | Rally ${rally} | Best Rally ${bestRally}`;
    }
  }

  function animate() {
    if (!canvas.isConnected) return;
    step();
    draw();
    requestAnimationFrame(animate);
  }

  function movePaddle(clientX) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    player.x = clamp(x - (player.w / 2), 0, canvas.width - player.w);
  }

  canvas.onmousemove = event => movePaddle(event.clientX);
  canvas.ontouchmove = event => {
    if (!event.touches || !event.touches[0]) return;
    movePaddle(event.touches[0].clientX);
  };
  canvas.onclick = () => {
    if (!ended) return;
    playerScore = 0;
    cpuScore = 0;
    ended = false;
    rally = 0;
    resetBall(Math.random() > 0.5 ? 1 : -1);
  };

  resetBall(1);
  animate();
}

function initPixelTapRush(container) {
  container.innerHTML = `
    <div style="display:grid;gap:.5rem">
      <canvas id="tap-canvas" width="240" height="240" style="border:1px solid #2f3a48;background:#050d18;image-rendering:pixelated;cursor:crosshair"></canvas>
      <p id="tap-hud" style="margin:0;color:#8b949e">Hit the glowing pixel tile before it moves. 20 seconds.</p>
      <button id="tap-restart" type="button">Restart</button>
    </div>
  `;
  const canvas = container.querySelector("#tap-canvas");
  const hud = container.querySelector("#tap-hud");
  const restart = container.querySelector("#tap-restart");
  const ctx = canvas.getContext("2d");

  const cell = 20;
  const cols = canvas.width / cell;
  const rows = canvas.height / cell;
  let target = { x: 0, y: 0 };
  let score = 0;
  let misses = 0;
  let timeLeft = 20;
  let best = Number(getGameHighscore("tapRush")) || 0;
  let ended = false;
  let moveTimer = null;
  let clockTimer = null;

  function randomizeTarget() {
    target.x = Math.floor(Math.random() * cols);
    target.y = Math.floor(Math.random() * rows);
  }

  function drawBoard() {
    ctx.fillStyle = "#050d18";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(125,160,210,.14)";
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cell, 0);
      ctx.lineTo(x * cell, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cell);
      ctx.lineTo(canvas.width, y * cell);
      ctx.stroke();
    }

    if (!ended) {
      ctx.fillStyle = "#34d399";
      ctx.fillRect(target.x * cell + 2, target.y * cell + 2, cell - 4, cell - 4);
      ctx.fillStyle = "rgba(52,211,153,.22)";
      ctx.fillRect(target.x * cell - 3, target.y * cell - 3, cell + 6, cell + 6);
    }
  }

  function updateHud() {
    hud.textContent = ended
      ? `Final score ${score} | Misses ${misses} | Highscore ${best}.`
      : `Time ${timeLeft}s | Score ${score} | Misses ${misses} | Highscore ${best}`;
  }

  function stopTimers() {
    if (moveTimer) {
      clearInterval(moveTimer);
      moveTimer = null;
    }
    if (clockTimer) {
      clearInterval(clockTimer);
      clockTimer = null;
    }
  }

  function start() {
    stopTimers();
    score = 0;
    misses = 0;
    timeLeft = 20;
    ended = false;
    randomizeTarget();
    drawBoard();
    updateHud();

    moveTimer = setInterval(() => {
      if (!canvas.isConnected) {
        stopTimers();
        return;
      }
      randomizeTarget();
      drawBoard();
    }, 700);

    clockTimer = setInterval(() => {
      if (!canvas.isConnected) {
        stopTimers();
        return;
      }
      timeLeft -= 1;
      if (timeLeft <= 0) {
        ended = true;
        stopTimers();
      }
      updateHud();
      drawBoard();
    }, 1000);
  }

  canvas.onclick = event => {
    if (ended) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cell);
    const y = Math.floor((event.clientY - rect.top) / cell);
    if (x === target.x && y === target.y) {
      score += 1;
      if (score > best) {
        best = setGameHighscore("tapRush", score, "max") || score;
      }
      randomizeTarget();
    } else {
      misses += 1;
    }
    updateHud();
    drawBoard();
  };

  restart.onclick = start;
  start();
}

function initPixelMemoryMatch(container) {
  const icons = ["▣", "◉", "▲", "◆", "✦", "✚", "☰", "⬢"];
  let cards = [];
  let flipped = [];
  let matched = 0;
  let moves = 0;
  let lock = false;
  let bestMoves = Number(getGameHighscore("memoryMoves"));
  if (!Number.isFinite(bestMoves) || bestMoves <= 0) bestMoves = null;

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = list[i];
      list[i] = list[j];
      list[j] = t;
    }
  }

  function buildDeck() {
    const pairs = icons.concat(icons).map((icon, index) => ({ id: index, icon, up: false, done: false }));
    shuffle(pairs);
    cards = pairs;
    flipped = [];
    matched = 0;
    moves = 0;
    lock = false;
  }

  function render() {
    container.innerHTML = `
      <style>
        .pix-match-grid { display:grid; grid-template-columns:repeat(4,minmax(56px,1fr)); gap:.45rem; }
        .pix-match-card {
          border:1px solid #2f3a48;
          border-radius:8px;
          min-height:60px;
          background:#0b1220;
          color:#79c0ff;
          font-size:1.3rem;
          font-weight:700;
        }
        .pix-match-card.done { border-color:#34d399; color:#34d399; background:#06251f; }
      </style>
      <div style="display:grid;gap:.55rem">
        <div style="display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap;color:#8b949e;font-size:.82rem">
          <span>Pairs: ${matched}/8</span>
          <span>Moves: ${moves}</span>
          <span>Best: ${bestMoves == null ? "-" : bestMoves}</span>
        </div>
        <div class="pix-match-grid">
          ${cards.map((card, index) => `
            <button type="button" class="pix-match-card ${card.done ? "done" : ""}" data-match-index="${index}">${card.up || card.done ? card.icon : "■"}</button>
          `).join("")}
        </div>
        <button id="pix-match-reset" type="button">New Board</button>
      </div>
    `;

    container.querySelectorAll("[data-match-index]").forEach(button => {
      button.onclick = () => {
        const index = Number(button.dataset.matchIndex);
        const card = cards[index];
        if (!card || card.done || card.up || lock) return;

        card.up = true;
        flipped.push(index);
        render();

        if (flipped.length === 2) {
          moves += 1;
          const [aIndex, bIndex] = flipped;
          const a = cards[aIndex];
          const b = cards[bIndex];
          if (a.icon === b.icon) {
            a.done = true;
            b.done = true;
            a.up = false;
            b.up = false;
            matched += 1;
            flipped = [];
            render();
            if (matched === icons.length) {
              const updated = setGameHighscore("memoryMoves", moves, "min");
              if (updated != null) bestMoves = updated;
              setTimeout(() => alert(`Memory complete in ${moves} moves${bestMoves != null ? ` | Best: ${bestMoves}` : ""}!`), 120);
            }
          } else {
            lock = true;
            setTimeout(() => {
              a.up = false;
              b.up = false;
              flipped = [];
              lock = false;
              if (container.isConnected) render();
            }, 550);
          }
        }
      };
    });

    const resetBtn = container.querySelector("#pix-match-reset");
    resetBtn.onclick = () => {
      buildDeck();
      render();
    };
  }

  buildDeck();
  render();
}

function initTamagotchi(container) {
  clearInterval(state.tamagotchiTimer);
  const pet = state.tamagotchi;
  function render() {
    container.innerHTML = `
      <div style="border:1px solid #2f3a48;padding:.8rem;background:#0e1a29">
        <p><strong>Pet Status</strong></p>
        <p>Hunger: ${pet.hunger}% | Happiness: ${pet.happiness}% | Energy: ${pet.energy}% | Alive: ${pet.alive}</p>
        <div class="stat-row">
          <button id="feed">Feed</button>
          <button id="play">Play</button>
          <button id="rest">Rest</button>
        </div>
        <p>${pet.alive ? 'A happy digital sprite chirps!' : 'The pet went offline.'}</p>
      </div>
    `;
    document.getElementById("feed").onclick = () => { if(pet.alive){pet.hunger=Math.max(0, pet.hunger-15);pet.happiness=Math.min(100, pet.happiness+5); render();}};
    document.getElementById("play").onclick = () => { if(pet.alive){pet.happiness=Math.min(100, pet.happiness+12);pet.energy=Math.max(0, pet.energy-10);render();}};
    document.getElementById("rest").onclick = () => { if(pet.alive){pet.energy=Math.min(100, pet.energy+18);pet.hunger=Math.min(100, pet.hunger+4);render();}};
  }

  state.tamagotchiTimer = setInterval(() => {
    if (!pet.alive) return;
    pet.hunger = Math.min(100, pet.hunger + 3);
    pet.energy = Math.max(0, pet.energy - 2);
    if (pet.hunger > 90 || pet.energy < 10) pet.happiness = Math.max(0, pet.happiness - 4);
    if (pet.hunger >= 100 || pet.happiness <= 0 || pet.energy <= 0) pet.alive = false;
    render();
  }, 1800);

  render();
}

function renderMedia() {
  const storageKey = "cyberdeckMediaLibrary";
  const seedVersionKey = "cyberdeckMediaSeedVersion";
  const currentSeedVersion = 2;
  const mediaTypes = ["movie", "show", "book", "manga"];
  const statusTypes = ["planned", "queued", "downloading", "stored", "archived"];
  const archiveWarnings = [
    "Creator Chose Not To Use Archive Warnings",
    "Graphic Depictions Of Violence",
    "Major Character Death",
    "No Archive Warnings Apply",
    "Rape/Non-Con",
    "Underage"
  ];
  let library = [];
  let editingId = null;
  let openProfileId = null;
  let quickFilter = { kind: "", value: "" };

  function makeId() {
    return Date.now() + Math.floor(Math.random() * 100000);
  }

  function toTitleCase(value) {
    return String(value || "").replace(/\b\w/g, letter => letter.toUpperCase());
  }

  function createEntry(type, title) {
    return {
      id: makeId(),
      type,
      title,
      favorite: false,
      coverImage: "",
      fandom: "",
      rating: "",
      warnings: [],
      pairings: [],
      collections: [],
      chapters: "",
      books: "",
      episodes: "",
      length: "",
      seasons: "",
      parts: "",
      mainCharacters: [],
      sideCharacters: [],
      tropes: [],
      path: "",
      sizeGb: "",
      status: "planned",
      tags: [],
      files: [],
      notes: "",
      addedAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  function parseTags(value) {
    return String(value || "")
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);
  }

  function parseList(value) {
    return String(value || "")
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);
  }

  function backfillSeedMedia() {
    const typeMap = {
      movies: "movie",
      shows: "show",
      books: "book",
      manga: "manga"
    };
    const knownTitles = new Set(library.map(item => String(item.title || "").trim().toLowerCase()));
    Object.entries(typeMap).forEach(([group, type]) => {
      (mediaDB[group] || []).forEach(title => {
        const key = String(title || "").trim().toLowerCase();
        if (!key || knownTitles.has(key)) return;
        knownTitles.add(key);
        library.push(createEntry(type, title));
      });
    });
  }

  try {
    const stored = JSON.parse(safeGetStorage(storageKey) || "[]");
    if (Array.isArray(stored)) {
      library = stored
        .filter(item => item && item.id != null)
        .map(item => ({
          id: Number(item.id),
          type: mediaTypes.includes(String(item.type || "").toLowerCase()) ? String(item.type).toLowerCase() : "movie",
          title: String(item.title || "Untitled"),
          favorite: Boolean(item.favorite),
          coverImage: String(item.coverImage || ""),
          fandom: String(item.fandom || ""),
          rating: String(item.rating || ""),
          warnings: Array.isArray(item.warnings) ? item.warnings.map(warning => String(warning)).filter(Boolean) : [],
          pairings: Array.isArray(item.pairings) ? item.pairings.map(pairing => String(pairing)).filter(Boolean) : [],
          collections: Array.isArray(item.collections) ? item.collections.map(collection => String(collection)).filter(Boolean) : [],
          chapters: String(item.chapters || ""),
          books: String(item.books || ""),
          episodes: String(item.episodes || ""),
          length: String(item.length || ""),
          seasons: String(item.seasons || ""),
          parts: String(item.parts || ""),
          mainCharacters: Array.isArray(item.mainCharacters) ? item.mainCharacters.map(char => String(char)).filter(Boolean) : [],
          sideCharacters: Array.isArray(item.sideCharacters) ? item.sideCharacters.map(char => String(char)).filter(Boolean) : [],
          tropes: Array.isArray(item.tropes) ? item.tropes.map(trope => String(trope)).filter(Boolean) : [],
          path: String(item.path || ""),
          sizeGb: String(item.sizeGb || ""),
          status: statusTypes.includes(String(item.status || "").toLowerCase()) ? String(item.status).toLowerCase() : "planned",
          tags: Array.isArray(item.tags) ? item.tags.map(tag => String(tag)).filter(Boolean) : [],
          files: Array.isArray(item.files)
            ? item.files
              .filter(file => file && file.name)
              .map(file => ({
                name: String(file.name),
                sizeBytes: Number(file.sizeBytes) || 0,
                type: String(file.type || ""),
                lastModified: Number(file.lastModified) || 0
              }))
            : [],
          notes: String(item.notes || ""),
          addedAt: Number(item.addedAt) || Date.now(),
          updatedAt: Number(item.updatedAt) || Date.now()
        }));
    }
  } catch (error) {
    console.warn("media library load failed", error);
    library = [];
  }

  if (!safeGetStorage(MEDIA_LIBRARY_PURGE_FLAG)) {
    library = [];
    safeSetStorage(storageKey, "[]");
    safeSetStorage(seedVersionKey, String(currentSeedVersion));
    safeSetStorage(MEDIA_LIBRARY_PURGE_FLAG, "1");
  }

  const lastSeedVersion = Number(safeGetStorage(seedVersionKey) || 0);
  if (lastSeedVersion < currentSeedVersion) {
    backfillSeedMedia();
    safeSetStorage(seedVersionKey, String(currentSeedVersion));
  }

  if (!library.length) {
    mediaDB.movies.forEach(title => library.push(createEntry("movie", title)));
    mediaDB.shows.forEach(title => library.push(createEntry("show", title)));
    mediaDB.books.forEach(title => library.push(createEntry("book", title)));
    mediaDB.manga.forEach(title => library.push(createEntry("manga", title)));
  }

  const html = `
    <style>
      #media-workspace {
        display: grid;
        gap: .7rem;
        grid-template-columns: minmax(260px, 330px) minmax(0, 1fr);
        align-items: start;
        font-family: Georgia, "Times New Roman", serif;
        color: #2a1f1f;
      }
      #media-workspace * { min-width: 0; }
      #media-workspace input,
      #media-workspace select,
      #media-workspace textarea,
      #media-workspace button { width: 100%; font-family: inherit; }
      #media-workspace input,
      #media-workspace select,
      #media-workspace textarea {
        background: #fffdf8;
        border: 1px solid #d7c6b2;
        color: #2a1f1f;
      }
      #media-workspace .media-split {
        display: grid;
        gap: .35rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      #media-workspace .media-inline-actions {
        display: flex;
        gap: .4rem;
        flex-wrap: wrap;
      }
      #media-workspace .media-inline-actions button { width: auto; }
      #media-workspace .media-list-panel { display: grid; gap: .55rem; }
      #media-workspace .media-list-toolbar {
        display: grid;
        gap: .45rem;
        grid-template-columns: minmax(0, 1fr) minmax(130px, 160px) minmax(130px, 160px) minmax(130px, 160px);
        align-items: center;
      }
      #media-workspace .ao3-box {
        border: 1px solid #d7c6b2;
        border-radius: 6px;
        background: #f6efe6;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.55);
      }
      #media-workspace .ao3-head {
        margin: 0;
        color: #8c2f1c;
        font-size: 1.02rem;
        letter-spacing: .02em;
      }
      #media-workspace .ao3-btn {
        background: linear-gradient(180deg, #b8422d, #9f3423);
        border: 1px solid #7f2417;
        color: #fff;
        border-radius: 4px;
      }
      #media-workspace .ao3-btn:hover { background: linear-gradient(180deg, #c84b35, #aa3726); }
      #media-workspace .ao3-muted-btn {
        background: #efe3d6;
        border: 1px solid #c9b39b;
        color: #452f24;
        border-radius: 4px;
      }
      #media-workspace .ao3-delete-btn {
        background: #f5d8d4;
        border: 1px solid #be5e52;
        color: #7a2018;
        border-radius: 4px;
      }
      #media-workspace .ao3-inline-link { color: #8c2f1c; text-decoration: underline; cursor: pointer; }
      #media-workspace .stat-chip {
        background: #efe3d6;
        border-color: #c9b39b;
        color: #000;
        font-weight: 600;
      }
      #media-workspace .tag-pill {
        background: #f8efe3;
        border-color: #d6bea6;
        color: #000;
        font-weight: 600;
      }
      #media-profile-panel .stat-chip,
      #media-summary-wrap .stat-chip {
        background: #efe3d6;
        border: 1px solid #c9b39b;
        color: #000;
        font-weight: 600;
      }
      #media-profile-panel .tag-pill {
        background: #f8efe3;
        border: 1px solid #d6bea6;
        color: #000;
        font-weight: 600;
      }
      #media-workspace .media-card {
        display:grid;
        grid-template-columns:88px minmax(0,1fr);
        gap:.7rem;
        align-items:start;
      }
      #media-workspace .media-cover,
      #media-workspace .media-cover-mini {
        border:1px solid #c9b39b;
        border-radius:6px;
        background:linear-gradient(180deg,#f4eadc,#eadbc8);
        overflow:hidden;
        display:grid;
        place-items:center;
        color:#8c2f1c;
        text-align:center;
      }
      #media-workspace .media-cover {
        width:88px;
        height:124px;
        font-size:.72rem;
        padding:.35rem;
      }
      #media-workspace .media-cover-mini {
        width:52px;
        height:72px;
        font-size:.62rem;
        padding:.2rem;
        flex-shrink:0;
      }
      #media-workspace .media-cover img,
      #media-workspace .media-cover-mini img {
        width:100%;
        height:100%;
        object-fit:cover;
        display:block;
      }
      #media-workspace .warning-picker {
        display:grid;
        gap:.2rem;
      }
      #media-workspace .warning-square-row,
      #media-profile-panel .warning-square-row {
        display:flex;
        gap:.3rem;
        flex-wrap:wrap;
        align-items:center;
      }
      #media-workspace .warning-square,
      #media-profile-panel .warning-square {
        display:inline-grid;
        place-items:center;
        width:2.05rem;
        height:2.05rem;
        border-radius:6px;
        border:1px solid #b98d7a;
        background:#f3dfd6;
        color:#111;
        font-size:.62rem;
        font-weight:700;
        line-height:1;
        letter-spacing:.02em;
      }
      #media-workspace .warning-square-remove {
        cursor:pointer;
      }
      #media-workspace .warning-square-empty {
        color:#6d5d52;
        font-size:.76rem;
      }
      @media (max-width: 980px) {
        #media-workspace { grid-template-columns: 1fr; }
        #media-workspace .media-list-toolbar { grid-template-columns: 1fr; }
      }
      @media (max-width: 620px) {
        #media-workspace .media-split { grid-template-columns: 1fr; }
      }
    </style>

    <section id="media-workspace">
      <aside class="ao3-box" style="display:grid;gap:.5rem;padding:.7rem;overflow:hidden;background:linear-gradient(180deg,#f8f1e8,#f3e9db)">
        <h4 class="ao3-head">Archive New Work</h4>
        <label style="display:grid;gap:.2rem">Type
          <select id="media-type">${mediaTypes.map(type => `<option value="${type}">${toTitleCase(type)}</option>`).join("")}</select>
        </label>
        <label style="display:grid;gap:.2rem">Title
          <input id="media-title" placeholder="Example: Blade Runner 2049" />
        </label>
        <label style="display:grid;gap:.2rem">Cover / Poster URL
          <input id="media-cover" placeholder="https://..." />
        </label>
        <label style="display:grid;gap:.2rem">Fandom / Universe
          <input id="media-fandom" placeholder="Cyberpunk, Star Trek, Original Work" />
        </label>
        <div class="media-split">
          <label style="display:grid;gap:.2rem">Rating
            <input id="media-rating" placeholder="General, Teen, Mature" />
          </label>
          <div class="warning-picker">
            <label style="display:grid;gap:.2rem">AO3 Archive Warnings
              <select id="media-warning-select">
                <option value="">Select warning...</option>
                ${archiveWarnings.map(warning => `<option value="${warning}">${warning}</option>`).join("")}
              </select>
            </label>
            <div class="media-inline-actions">
              <button id="media-warning-add" class="ao3-muted-btn" type="button">Add Warning</button>
              <button id="media-warning-clear" class="ao3-muted-btn" type="button">Clear</button>
            </div>
            <div id="media-warning-list" class="warning-square-row"></div>
          </div>
        </div>
        <label style="display:grid;gap:.2rem">File path or location
          <input id="media-path" placeholder="D:/Media/Movies/..." />
        </label>
        <label style="display:grid;gap:.2rem">Attach local file(s)
          <input id="media-file" type="file" multiple />
        </label>
        <div id="media-files-preview" style="font-size:.78rem;color:#6d5d52"></div>
        <button id="media-clear-files" class="ao3-muted-btn" type="button">Clear attached files</button>
        <label style="display:grid;gap:.2rem">Size (GB)
          <input id="media-size" placeholder="12.5" />
        </label>
        <label style="display:grid;gap:.2rem">Length / Runtime
          <input id="media-length" placeholder="2h 42m, 600 pages, etc." />
        </label>
        <div class="media-split">
          <label style="display:grid;gap:.2rem">Seasons
            <input id="media-seasons" placeholder="6" />
          </label>
          <label style="display:grid;gap:.2rem">Episodes
            <input id="media-episodes" placeholder="120" />
          </label>
          <label style="display:grid;gap:.2rem">Books
            <input id="media-books" placeholder="7" />
          </label>
          <label style="display:grid;gap:.2rem">Chapters
            <input id="media-chapters" placeholder="95" />
          </label>
          <label style="display:grid;gap:.2rem">Parts / Arcs
            <input id="media-parts" placeholder="3" />
          </label>
        </div>
        <label style="display:grid;gap:.2rem">Tags (comma-separated)
          <input id="media-tags" placeholder="4k, dub, complete" />
        </label>
        <label style="display:grid;gap:.2rem">Main characters (comma-separated)
          <input id="media-main-characters" placeholder="Name, Name" />
        </label>
        <label style="display:grid;gap:.2rem">Side characters (comma-separated)
          <input id="media-side-characters" placeholder="Name, Name" />
        </label>
        <label style="display:grid;gap:.2rem">Tropes (comma-separated)
          <input id="media-tropes" placeholder="found family, rivals to lovers" />
        </label>
        <label style="display:grid;gap:.2rem">Pairings / Relationships (comma-separated)
          <input id="media-pairings" placeholder="A/B, found family, ensemble" />
        </label>
        <label style="display:grid;gap:.2rem">Collections / Shelves (comma-separated)
          <input id="media-collections" placeholder="favorites, archive, to watch" />
        </label>
        <label style="display:grid;gap:.2rem">Status
          <select id="media-status">${statusTypes.map(type => `<option value="${type}">${toTitleCase(type)}</option>`).join("")}</select>
        </label>
        <label style="display:grid;gap:.2rem">Notes
          <textarea id="media-notes" style="min-height:10vh"></textarea>
        </label>
        <div class="media-inline-actions">
          <button id="media-save" class="ao3-btn" type="button">Post</button>
          <button id="media-cancel" class="ao3-muted-btn" type="button">Cancel</button>
        </div>
      </aside>

      <section class="media-list-panel">
        <div class="media-list-toolbar">
          <input id="media-search" placeholder="Search title, tag, note, path" />
          <select id="media-filter-type">
            <option value="all">All Types</option>
            ${mediaTypes.map(type => `<option value="${type}">${toTitleCase(type)}</option>`).join("")}
          </select>
          <select id="media-filter-status">
            <option value="all">All Statuses</option>
            ${statusTypes.map(type => `<option value="${type}">${toTitleCase(type)}</option>`).join("")}
          </select>
          <select id="media-sort">
            <option value="updated">Recently Updated</option>
            <option value="added">Recently Added</option>
            <option value="title">Title A-Z</option>
            <option value="favorite">Favorites First</option>
            <option value="size">Largest Size</option>
          </select>
        </div>
        <div id="media-active-filter" style="display:flex;gap:.35rem;flex-wrap:wrap;align-items:center"></div>

        <div id="media-list" style="display:grid;gap:.45rem;flex:1;min-height:0;overflow:auto"></div>
      </section>
    </section>
  `;

  const medium = `
    <section style="display:grid;gap:.5rem;align-content:start;font-family:Georgia, 'Times New Roman', serif">
      <div id="media-profile-panel" style="display:grid;gap:.5rem"></div>
      <div id="media-summary-wrap" style="display:grid;gap:.5rem">
        <h4 style="margin:.1rem 0;color:#8c2f1c">Archive Summary</h4>
        <div id="media-summary" style="padding:.7rem;border:1px solid #d7c6b2;border-radius:6px;background:#f6efe6;color:#2a1f1f"></div>
        <div id="media-storage" style="padding:.7rem;border:1px solid #d7c6b2;border-radius:6px;background:#f6efe6;color:#2a1f1f"></div>
      </div>
    </section>
  `;

  const small = `
    <section style="display:grid;gap:.5rem;align-content:start;font-family:Georgia, 'Times New Roman', serif">
      <h4 style="margin:.1rem 0;color:#8c2f1c">Bookmarks</h4>
      <div id="media-favorites" style="display:grid;gap:.4rem"></div>
    </section>
  `;
  setContent({title: "media"}, html, medium, small);

  const typeInput = document.getElementById("media-type");
  const titleInput = document.getElementById("media-title");
  const coverInput = document.getElementById("media-cover");
  const fandomInput = document.getElementById("media-fandom");
  const ratingInput = document.getElementById("media-rating");
  const warningSelect = document.getElementById("media-warning-select");
  const warningListEl = document.getElementById("media-warning-list");
  const warningAddBtn = document.getElementById("media-warning-add");
  const warningClearBtn = document.getElementById("media-warning-clear");
  const pathInput = document.getElementById("media-path");
  const fileInput = document.getElementById("media-file");
  const filePreviewEl = document.getElementById("media-files-preview");
  const sizeInput = document.getElementById("media-size");
  const lengthInput = document.getElementById("media-length");
  const seasonsInput = document.getElementById("media-seasons");
  const episodesInput = document.getElementById("media-episodes");
  const booksInput = document.getElementById("media-books");
  const chaptersInput = document.getElementById("media-chapters");
  const partsInput = document.getElementById("media-parts");
  const statusInput = document.getElementById("media-status");
  const tagsInput = document.getElementById("media-tags");
  const mainCharactersInput = document.getElementById("media-main-characters");
  const sideCharactersInput = document.getElementById("media-side-characters");
  const tropesInput = document.getElementById("media-tropes");
  const pairingsInput = document.getElementById("media-pairings");
  const collectionsInput = document.getElementById("media-collections");
  const notesInput = document.getElementById("media-notes");
  const searchInput = document.getElementById("media-search");
  const filterType = document.getElementById("media-filter-type");
  const filterStatus = document.getElementById("media-filter-status");
  const sortInput = document.getElementById("media-sort");
  const activeFilterEl = document.getElementById("media-active-filter");
  const listEl = document.getElementById("media-list");
  const profileEl = document.getElementById("media-profile-panel");
  const summaryWrapEl = document.getElementById("media-summary-wrap");
  const summaryEl = document.getElementById("media-summary");
  const storageEl = document.getElementById("media-storage");
  const favoritesEl = document.getElementById("media-favorites");
  let selectedFilesMeta = [];
  let selectedWarnings = [];

  function formatBytes(bytes) {
    const size = Number(bytes) || 0;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  function renderFilesPreview() {
    if (!selectedFilesMeta.length) {
      filePreviewEl.textContent = "No files attached.";
      return;
    }
    filePreviewEl.innerHTML = selectedFilesMeta
      .map(file => `<div>${esc(file.name)} (${formatBytes(file.sizeBytes)})</div>`)
      .join("");
  }

  function persistLibrary() {
    safeSetStorage(storageKey, JSON.stringify(library));
  }

  function renderCover(entry, mini = false) {
    const className = mini ? "media-cover-mini" : "media-cover";
    if (entry.coverImage) {
      return `<div class="${className}"><img src="${esc(entry.coverImage)}" alt="${esc(entry.title)} cover" /></div>`;
    }
    return `<div class="${className}"><strong>${esc(entry.title || "Untitled")}</strong></div>`;
  }

  function warningAbbrev(label) {
    const map = {
      "Creator Chose Not To Use Archive Warnings": "CNTW",
      "Graphic Depictions Of Violence": "GDV",
      "Major Character Death": "MCD",
      "No Archive Warnings Apply": "NAWA",
      "Rape/Non-Con": "RNC",
      "Underage": "UA"
    };
    if (map[label]) return map[label];
    return String(label || "")
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .slice(0, 4)
      .map(word => word[0].toUpperCase())
      .join("") || "WARN";
  }

  function renderWarningSquares(warnings, removable = false) {
    if (!Array.isArray(warnings) || !warnings.length) {
      return `<span class="warning-square-empty">None</span>`;
    }
    return warnings.map(warning => {
      if (removable) {
        return `<button type="button" class="warning-square warning-square-remove" title="${esc(warning)}" data-warning-remove="${esc(warning)}">${esc(warningAbbrev(warning))}</button>`;
      }
      return `<span class="warning-square" title="${esc(warning)}">${esc(warningAbbrev(warning))}</span>`;
    }).join("");
  }

  function setSelectedWarnings(nextWarnings) {
    const unique = Array.from(new Set((nextWarnings || []).map(item => String(item).trim()).filter(Boolean)));
    if (unique.includes("No Archive Warnings Apply")) {
      selectedWarnings = ["No Archive Warnings Apply"];
    } else {
      selectedWarnings = unique.filter(item => item !== "No Archive Warnings Apply");
    }
    warningListEl.innerHTML = renderWarningSquares(selectedWarnings, true);
    warningListEl.querySelectorAll("[data-warning-remove]").forEach(button => {
      button.onclick = () => {
        const value = button.dataset.warningRemove || "";
        setSelectedWarnings(selectedWarnings.filter(item => item !== value));
      };
    });
  }

  function renderFilterChip(kind, value, label) {
    if (!value) return "";
    const isActive = quickFilter.kind === kind && quickFilter.value === value;
    return `<button type="button" class="stat-chip" data-media-filter-kind="${esc(kind)}" data-media-filter-value="${esc(value)}" style="width:auto;cursor:pointer;${isActive ? "background:#b8422d;color:#fff;border-color:#7f2417;" : ""}">${esc(label || value)}</button>`;
  }

  function bindQuickFilterClicks(scope) {
    if (!scope) return;
    scope.querySelectorAll("[data-media-filter-kind]").forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        const kind = button.dataset.mediaFilterKind || "";
        const value = button.dataset.mediaFilterValue || "";
        if (!kind || !value) return;
        if (quickFilter.kind === kind && quickFilter.value === value) {
          quickFilter = { kind: "", value: "" };
        } else {
          quickFilter = { kind, value };
        }
        renderSummary();
        renderActiveFilter();
        renderList();
        renderProfilePanel();
      };
    });
  }

  function renderActiveFilter() {
    if (!quickFilter.kind || !quickFilter.value) {
      activeFilterEl.innerHTML = "";
      return;
    }
    const label = quickFilter.kind === "fandom" ? `Fandom: ${quickFilter.value}` : `Collection: ${quickFilter.value}`;
    activeFilterEl.innerHTML = `
      <span style="font-size:.78rem;color:#6d5d52">Quick filter active</span>
      ${renderFilterChip(quickFilter.kind, quickFilter.value, label)}
      <button id="media-clear-filter" type="button" class="ao3-muted-btn" style="width:auto">Clear</button>
    `;
    bindQuickFilterClicks(activeFilterEl);
    document.getElementById("media-clear-filter").onclick = () => {
      quickFilter = { kind: "", value: "" };
      renderSummary();
      renderActiveFilter();
      renderList();
      renderProfilePanel();
    };
  }

  function renderProfilePanel() {
    const entry = openProfileId != null ? library.find(item => item.id === openProfileId) : null;
    if (!entry) {
      summaryWrapEl.style.display = "grid";
      profileEl.innerHTML = "";
      return;
    }

    summaryWrapEl.style.display = "none";

    const tags = (entry.tags || []).map(tag => `<span class="tag-pill">${esc(tag)}</span>`).join("");
    const mainCharacters = (entry.mainCharacters || []).map(char => `<span class="tag-pill">${esc(char)}</span>`).join("");
    const sideCharacters = (entry.sideCharacters || []).map(char => `<span class="tag-pill">${esc(char)}</span>`).join("");
    const tropes = (entry.tropes || []).map(trope => `<span class="tag-pill">${esc(trope)}</span>`).join("");
    const warningSquares = renderWarningSquares(entry.warnings || []);
    const pairings = (entry.pairings || []).map(pairing => `<span class="tag-pill">${esc(pairing)}</span>`).join("");
    const collections = (entry.collections || []).map(collection => renderFilterChip("collection", collection, collection)).join(" ");
    const files = (entry.files || []).map(file => `<li>${esc(file.name)} <span style="color:#4b352c">(${formatBytes(file.sizeBytes)})</span></li>`).join("");

    profileEl.innerHTML = `
      <article style="padding:.85rem;border:1px solid #d7c6b2;border-radius:8px;background:#fffdf8;display:grid;gap:.75rem;color:#1e1511">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:.5rem;flex-wrap:wrap">
          <div class="stat-row" style="margin:0">
            <span class="stat-chip">${toTitleCase(entry.type)}</span>
            <span class="stat-chip">${toTitleCase(entry.status)}</span>
            ${entry.sizeGb ? `<span class="stat-chip">${esc(entry.sizeGb)} GB</span>` : ""}
            ${entry.favorite ? `<span class="stat-chip">Favorite</span>` : ""}
          </div>
          <button id="media-close-profile" type="button" class="ao3-muted-btn" style="width:auto">Back</button>
        </div>

        <div class="media-card">
          ${renderCover(entry)}
          <div style="min-width:0">
            <h2 style="margin:.1rem 0;color:#8c2f1c">${esc(entry.title)}</h2>
            <div class="stat-row" style="margin:0">
              ${entry.fandom ? renderFilterChip("fandom", entry.fandom, entry.fandom) : ""}
              ${entry.rating ? `<span class="stat-chip">Rating: ${esc(entry.rating)}</span>` : ""}
            </div>
          </div>
        </div>

        <div style="display:flex;gap:.45rem;flex-wrap:wrap">
          <button type="button" id="media-profile-favorite" class="ao3-muted-btn" style="width:auto">${entry.favorite ? "★ Unbookmark" : "☆ Bookmark"}</button>
          <button type="button" id="media-profile-edit" class="ao3-muted-btn" style="width:auto">Edit</button>
          <button type="button" id="media-profile-delete" class="ao3-delete-btn" style="width:auto">Delete</button>
        </div>

        <section style="display:grid;gap:.35rem;border:1px solid #d7c6b2;border-radius:6px;padding:.55rem;background:#f6efe6;color:#2b1d16">
          <h4 style="margin:.1rem 0;color:#8c2f1c">Work Details</h4>
          <div class="stat-row" style="margin:0">
            ${entry.length ? `<span class="stat-chip">Length: ${esc(entry.length)}</span>` : ""}
            ${entry.seasons ? `<span class="stat-chip">Seasons: ${esc(entry.seasons)}</span>` : ""}
            ${entry.episodes ? `<span class="stat-chip">Episodes: ${esc(entry.episodes)}</span>` : ""}
            ${entry.books ? `<span class="stat-chip">Books: ${esc(entry.books)}</span>` : ""}
            ${entry.chapters ? `<span class="stat-chip">Chapters: ${esc(entry.chapters)}</span>` : ""}
            ${entry.parts ? `<span class="stat-chip">Parts: ${esc(entry.parts)}</span>` : ""}
          </div>
          ${mainCharacters ? `<div><strong>Main Characters:</strong><div class="stat-row">${mainCharacters}</div></div>` : ""}
          ${sideCharacters ? `<div><strong>Side Characters:</strong><div class="stat-row">${sideCharacters}</div></div>` : ""}
          ${tropes ? `<div><strong>Tropes:</strong><div class="stat-row">${tropes}</div></div>` : ""}
          <div><strong>Warnings:</strong><div class="warning-square-row">${warningSquares}</div></div>
          ${pairings ? `<div><strong>Pairings:</strong><div class="stat-row">${pairings}</div></div>` : ""}
          ${collections ? `<div><strong>Collections:</strong><div class="stat-row">${collections}</div></div>` : ""}
        </section>

        ${entry.path ? `<p style="margin:0;color:#3a2922"><strong>Path:</strong> ${esc(entry.path)}</p>` : ""}
        ${entry.notes ? `<p style="margin:0;color:#271b16">${esc(entry.notes)}</p>` : ""}
        ${tags ? `<div class="stat-row" style="margin:0">${tags}</div>` : ""}
        ${(entry.files || []).length ? `<section><h4 style="margin:.1rem 0 .35rem 0;color:#8c2f1c">Attached Files</h4><ul style="margin:.2rem 0 0 1rem;padding:0">${files}</ul></section>` : ""}
      </article>
    `;

    bindQuickFilterClicks(profileEl);

    document.getElementById("media-close-profile").onclick = () => {
      openProfileId = null;
      renderProfilePanel();
      renderList();
    };

    document.getElementById("media-profile-favorite").onclick = () => {
      const item = library.find(media => media.id === entry.id);
      if (!item) return;
      item.favorite = !item.favorite;
      item.updatedAt = Date.now();
      persistLibrary();
      renderSummary();
      renderFavorites();
      renderProfilePanel();
      renderList();
    };

    document.getElementById("media-profile-edit").onclick = () => {
      const item = library.find(media => media.id === entry.id);
      if (!item) return;
      populateForm(item);
    };

    document.getElementById("media-profile-delete").onclick = () => {
      const item = library.find(media => media.id === entry.id);
      if (!item) return;
      if (!confirm(`Delete "${item.title}" from media library?`)) return;
      library = library.filter(media => media.id !== item.id);
      if (editingId === item.id) clearForm();
      openProfileId = null;
      persistLibrary();
      renderSummary();
      renderFavorites();
      renderProfilePanel();
      renderList();
    };
  }

  function clearForm() {
    editingId = null;
    typeInput.value = "movie";
    titleInput.value = "";
    coverInput.value = "";
    fandomInput.value = "";
    ratingInput.value = "";
    warningSelect.value = "";
    setSelectedWarnings([]);
    pathInput.value = "";
    fileInput.value = "";
    selectedFilesMeta = [];
    sizeInput.value = "";
    lengthInput.value = "";
    seasonsInput.value = "";
    episodesInput.value = "";
    booksInput.value = "";
    chaptersInput.value = "";
    partsInput.value = "";
    statusInput.value = "planned";
    tagsInput.value = "";
    mainCharactersInput.value = "";
    sideCharactersInput.value = "";
    tropesInput.value = "";
    pairingsInput.value = "";
    collectionsInput.value = "";
    notesInput.value = "";
    renderFilesPreview();
  }

  function populateForm(entry) {
    if (!entry) return;
    editingId = entry.id;
    typeInput.value = entry.type;
    titleInput.value = entry.title;
    coverInput.value = entry.coverImage || "";
    fandomInput.value = entry.fandom || "";
    ratingInput.value = entry.rating || "";
    warningSelect.value = "";
    setSelectedWarnings(entry.warnings || []);
    pathInput.value = entry.path || "";
    fileInput.value = "";
    selectedFilesMeta = Array.isArray(entry.files) ? entry.files.map(file => ({ ...file })) : [];
    sizeInput.value = entry.sizeGb || "";
    lengthInput.value = entry.length || "";
    seasonsInput.value = entry.seasons || "";
    episodesInput.value = entry.episodes || "";
    booksInput.value = entry.books || "";
    chaptersInput.value = entry.chapters || "";
    partsInput.value = entry.parts || "";
    statusInput.value = entry.status;
    tagsInput.value = (entry.tags || []).join(", ");
    mainCharactersInput.value = (entry.mainCharacters || []).join(", ");
    sideCharactersInput.value = (entry.sideCharacters || []).join(", ");
    tropesInput.value = (entry.tropes || []).join(", ");
    pairingsInput.value = (entry.pairings || []).join(", ");
    collectionsInput.value = (entry.collections || []).join(", ");
    notesInput.value = entry.notes || "";
    renderFilesPreview();
  }

  function renderSummary() {
    const totalCount = library.length;
    const byType = mediaTypes.map(type => {
      const count = library.filter(item => item.type === type).length;
      return `<span class="stat-chip">${toTitleCase(type)}: ${count}</span>`;
    }).join(" ");
    summaryEl.innerHTML = `
      <p style="margin:.1rem 0 .45rem 0"><strong>${totalCount}</strong> items in library</p>
      <div class="stat-row">${byType}</div>
    `;

    const totalGb = library.reduce((sum, item) => {
      const value = parseFloat(item.sizeGb);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);
    const byStatus = statusTypes.map(type => {
      const count = library.filter(item => item.status === type).length;
      return `<span class="stat-chip">${toTitleCase(type)}: ${count}</span>`;
    }).join(" ");

    const favoriteCount = library.filter(item => item.favorite).length;
    const fandomCounts = library.reduce((acc, item) => {
      const key = String(item.fandom || "").trim();
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const topFandoms = Object.entries(fandomCounts)
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 4)
      .map(([name, count]) => renderFilterChip("fandom", name, `${name}: ${count}`))
      .join(" ");
    const collectionCounts = library.reduce((acc, item) => {
      (item.collections || []).forEach(collection => {
        const key = String(collection || "").trim();
        if (!key) return;
        acc[key] = (acc[key] || 0) + 1;
      });
      return acc;
    }, {});
    const topCollections = Object.entries(collectionCounts)
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 4)
      .map(([name, count]) => renderFilterChip("collection", name, `${name}: ${count}`))
      .join(" ");

    storageEl.innerHTML = `
      <p style="margin:.1rem 0 .45rem 0">Estimated tracked size: <strong>${totalGb.toFixed(1)} GB</strong></p>
      <div class="stat-row">${byStatus}</div>
      <p style="margin:.45rem 0 0 0;color:#6d5d52">Favorites: <strong>${favoriteCount}</strong></p>
      ${topFandoms ? `<div style="margin-top:.45rem"><strong style="display:block;margin-bottom:.2rem">Top Fandoms</strong><div class="stat-row">${topFandoms}</div></div>` : ""}
      ${topCollections ? `<div style="margin-top:.45rem"><strong style="display:block;margin-bottom:.2rem">Collections</strong><div class="stat-row">${topCollections}</div></div>` : ""}
    `;

    bindQuickFilterClicks(storageEl);
  }

  function renderFavorites() {
    const favorites = library
      .filter(item => item.favorite)
      .sort((left, right) => right.updatedAt - left.updatedAt)
      .slice(0, 8);

    if (!favorites.length) {
      favoritesEl.innerHTML = `<p style="margin:0;color:#6d5d52">No bookmarks yet. Use ☆ on any media item.</p>`;
      return;
    }

    favoritesEl.innerHTML = favorites.map(item => {
      return `
        <article data-open-id="${item.id}" style="padding:.45rem .55rem;border:1px solid #d7c6b2;border-radius:6px;background:#f6efe6;color:#2a1f1f;cursor:pointer">
          <div style="display:flex;justify-content:space-between;gap:.4rem;align-items:center">
            <div style="display:flex;gap:.5rem;align-items:center;min-width:0">
              ${renderCover(item, true)}
              <div>
                <strong style="display:block">${esc(item.title)}</strong>
                <span style="font-size:.78rem;color:#6d5d52">${toTitleCase(item.type)}${item.fandom ? ` • ${esc(item.fandom)}` : item.sizeGb ? ` • ${esc(item.sizeGb)} GB` : ""}</span>
              </div>
            </div>
            <button type="button" data-favorite-id="${item.id}" title="Unfavorite" style="width:auto;background:#efe3d6;border:1px solid #c9b39b;color:#8c2f1c">★</button>
          </div>
        </article>
      `;
    }).join("");

    favoritesEl.querySelectorAll("[data-favorite-id]").forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        const id = Number(button.dataset.favoriteId);
        const entry = library.find(item => item.id === id);
        if (!entry) return;
        entry.favorite = !entry.favorite;
        entry.updatedAt = Date.now();
        persistLibrary();
        renderSummary();
        renderList();
        renderFavorites();
      };
    });

    favoritesEl.querySelectorAll("[data-open-id]").forEach(card => {
      card.onclick = () => {
        openProfileId = Number(card.dataset.openId);
        renderProfilePanel();
        renderList();
      };
    });
  }

  function renderList() {
    const query = searchInput.value.trim().toLowerCase();
    const typeFilter = filterType.value;
    const statusFilter = filterStatus.value;
    const sortBy = sortInput.value;
    if (openProfileId != null && !library.some(item => item.id === openProfileId)) {
      openProfileId = null;
    }

    const items = library
      .filter(item => {
        if (typeFilter !== "all" && item.type !== typeFilter) return false;
        if (statusFilter !== "all" && item.status !== statusFilter) return false;
        if (quickFilter.kind === "fandom" && item.fandom !== quickFilter.value) return false;
        if (quickFilter.kind === "collection" && !(item.collections || []).includes(quickFilter.value)) return false;
        if (!query) return true;
        const hay = `${item.title} ${item.fandom} ${item.rating} ${item.path} ${item.notes} ${item.length} ${item.seasons} ${item.episodes} ${item.books} ${item.chapters} ${item.parts} ${(item.tags || []).join(" ")} ${(item.mainCharacters || []).join(" ")} ${(item.sideCharacters || []).join(" ")} ${(item.tropes || []).join(" ")} ${(item.warnings || []).join(" ")} ${(item.pairings || []).join(" ")} ${(item.collections || []).join(" ")} ${(item.files || []).map(file => file.name).join(" ")}`.toLowerCase();
        return hay.includes(query);
      })
      .sort((left, right) => {
        if (sortBy === "title") return left.title.localeCompare(right.title);
        if (sortBy === "added") return right.addedAt - left.addedAt;
        if (sortBy === "favorite") return Number(right.favorite) - Number(left.favorite) || right.updatedAt - left.updatedAt;
        if (sortBy === "size") return (parseFloat(right.sizeGb) || 0) - (parseFloat(left.sizeGb) || 0);
        return right.updatedAt - left.updatedAt;
      });

    if (!items.length) {
      listEl.innerHTML = `<p style="color:#6d5d52;font-style:italic">No works match current filters.</p>`;
      return;
    }

    listEl.innerHTML = items.map(item => {
      const tags = (item.tags || []).map(tag => `<span class="tag-pill">${esc(tag)}</span>`).join("");
      const fileBadge = item.files && item.files.length ? `<span class="stat-chip">Files: ${item.files.length}</span>` : "";
      const fandomBadge = item.fandom ? renderFilterChip("fandom", item.fandom, item.fandom) : "";
      const ratingBadge = item.rating ? `<span class="stat-chip">${esc(item.rating)}</span>` : "";
      const warningSquares = renderWarningSquares(item.warnings || []);
      const collectionBadges = (item.collections || []).slice(0, 3).map(collection => renderFilterChip("collection", collection, collection)).join(" ");
      const fileNames = item.files && item.files.length
        ? `<p style="margin:.4rem 0 0 0;color:#8b949e"><strong>Files:</strong> ${item.files.map(file => esc(file.name)).join(", ")}</p>`
        : "";
      return `
        <article data-open-id="${item.id}" style="padding:.65rem;border:1px solid ${openProfileId === item.id ? "#9f3423" : "#d7c6b2"};border-radius:6px;background:${openProfileId === item.id ? "#fcf2e5" : "#fffdf8"};cursor:pointer;color:#2a1f1f">
          <div style="display:flex;justify-content:space-between;gap:.5rem;align-items:start;flex-wrap:wrap">
            <div class="media-card" style="grid-template-columns:52px minmax(0,1fr);flex:1">
              ${renderCover(item, true)}
              <div>
                <h4 style="margin:.1rem 0 .3rem 0;color:#8c2f1c">${esc(item.title)}</h4>
                <div class="stat-row">
                  ${item.favorite ? `<span class="stat-chip">Favorite</span>` : ""}
                  <span class="stat-chip">${toTitleCase(item.type)}</span>
                  <span class="stat-chip">${toTitleCase(item.status)}</span>
                  ${fandomBadge}
                  ${ratingBadge}
                  ${item.sizeGb ? `<span class="stat-chip">${esc(item.sizeGb)} GB</span>` : ""}
                  ${fileBadge}
                </div>
              </div>
            </div>
            <div style="display:flex;gap:.35rem">
              <button type="button" data-favorite-id="${item.id}" title="Toggle favorite" style="width:auto;background:#efe3d6;border:1px solid #c9b39b;color:#8c2f1c">${item.favorite ? "★" : "☆"}</button>
              <button type="button" data-edit-id="${item.id}" style="width:auto;background:#efe3d6;border:1px solid #c9b39b;color:#452f24">Edit</button>
              <button type="button" data-delete-id="${item.id}" style="width:auto;background:#f5d8d4;border:1px solid #be5e52;color:#7a2018">Delete</button>
            </div>
          </div>
          ${item.path ? `<p style="margin:.4rem 0 0 0;color:#6d5d52"><strong>Path:</strong> ${esc(item.path)}</p>` : ""}
          ${fileNames.replace("color:#8b949e", "color:#6d5d52")}
          ${item.notes ? `<p style="margin:.4rem 0 0 0;color:#3a2f2a">${esc(item.notes)}</p>` : ""}
          <div class="warning-square-row" style="margin-top:.45rem">${warningSquares}</div>
          ${collectionBadges ? `<div class="stat-row" style="margin-top:.45rem">${collectionBadges}</div>` : ""}
          ${tags ? `<div class="stat-row" style="margin-top:.5rem">${tags}</div>` : ""}
        </article>
      `;
    }).join("");

    bindQuickFilterClicks(listEl);

    listEl.querySelectorAll("[data-open-id]").forEach(card => {
      card.onclick = () => {
        openProfileId = Number(card.dataset.openId);
        renderProfilePanel();
        renderList();
      };
    });

    listEl.querySelectorAll("[data-edit-id]").forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        const id = Number(button.dataset.editId);
        const entry = library.find(item => item.id === id);
        if (!entry) return;
        populateForm(entry);
      };
    });

    listEl.querySelectorAll("[data-favorite-id]").forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        const id = Number(button.dataset.favoriteId);
        const entry = library.find(item => item.id === id);
        if (!entry) return;
        entry.favorite = !entry.favorite;
        entry.updatedAt = Date.now();
        persistLibrary();
        renderSummary();
        renderList();
        renderFavorites();
      };
    });

    listEl.querySelectorAll("[data-delete-id]").forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        const id = Number(button.dataset.deleteId);
        const entry = library.find(item => item.id === id);
        if (!entry) return;
        if (!confirm(`Delete "${entry.title}" from media library?`)) return;
        library = library.filter(item => item.id !== id);
        if (editingId === id) clearForm();
        if (openProfileId === id) openProfileId = null;
        persistLibrary();
        renderSummary();
        renderProfilePanel();
        renderList();
        renderFavorites();
      };
    });
  }

  document.getElementById("media-save").onclick = () => {
    const title = titleInput.value.trim();
    if (!title) {
      alert("Add a title first.");
      titleInput.focus();
      return;
    }

    const payload = {
      type: typeInput.value,
      title,
      coverImage: coverInput.value.trim(),
      fandom: fandomInput.value.trim(),
      rating: ratingInput.value.trim(),
      warnings: selectedWarnings.slice(),
      path: pathInput.value.trim(),
      sizeGb: sizeInput.value.trim(),
      length: lengthInput.value.trim(),
      seasons: seasonsInput.value.trim(),
      episodes: episodesInput.value.trim(),
      books: booksInput.value.trim(),
      chapters: chaptersInput.value.trim(),
      parts: partsInput.value.trim(),
      status: statusInput.value,
      tags: parseTags(tagsInput.value),
      mainCharacters: parseList(mainCharactersInput.value),
      sideCharacters: parseList(sideCharactersInput.value),
      tropes: parseList(tropesInput.value),
      pairings: parseList(pairingsInput.value),
      collections: parseList(collectionsInput.value),
      files: selectedFilesMeta.map(file => ({ ...file })),
      notes: notesInput.value.trim(),
      updatedAt: Date.now()
    };

    if (editingId) {
      const index = library.findIndex(item => item.id === editingId);
      if (index > -1) {
        library[index] = { ...library[index], ...payload };
      }
    } else {
      library.unshift({
        id: makeId(),
        addedAt: Date.now(),
        favorite: false,
        ...payload
      });
    }

    persistLibrary();
    clearForm();
    renderSummary();
    renderList();
    renderFavorites();
  };

  fileInput.addEventListener("change", event => {
    const files = Array.from(event.target.files || []);
    selectedFilesMeta = files.map(file => ({
      name: file.name,
      sizeBytes: Number(file.size) || 0,
      type: file.type || "",
      lastModified: Number(file.lastModified) || 0
    }));

    if (selectedFilesMeta.length) {
      if (!titleInput.value.trim()) {
        titleInput.value = selectedFilesMeta[0].name.replace(/\.[^.]+$/, "");
      }
      if (!pathInput.value.trim()) {
        pathInput.value = selectedFilesMeta.map(file => file.name).join("; ");
      }
      if (!sizeInput.value.trim()) {
        const totalBytes = selectedFilesMeta.reduce((sum, file) => sum + (file.sizeBytes || 0), 0);
        if (totalBytes > 0) {
          sizeInput.value = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
        }
      }
    }

    renderFilesPreview();
  });

  document.getElementById("media-clear-files").onclick = () => {
    fileInput.value = "";
    selectedFilesMeta = [];
    renderFilesPreview();
  };

  warningAddBtn.onclick = () => {
    const value = warningSelect.value;
    if (!value) return;
    setSelectedWarnings([...selectedWarnings, value]);
    warningSelect.value = "";
  };

  warningClearBtn.onclick = () => {
    warningSelect.value = "";
    setSelectedWarnings([]);
  };

  document.getElementById("media-cancel").onclick = clearForm;
  [searchInput, filterType, filterStatus, sortInput].forEach(control => control.addEventListener("input", renderList));

  persistLibrary();
  renderFilesPreview();
  setSelectedWarnings([]);
  renderSummary();
  renderActiveFilter();
  renderProfilePanel();
  renderList();
  renderFavorites();
}

function renderWriting() {
  const storageKey = "cyberdeckWritingJournal";
  const legacyStorageKey = "cyberdeckWritingNotes";

  function createId() {
    return Date.now() + Math.floor(Math.random() * 100000);
  }

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function currentMonthLabel() {
    return new Date().toISOString().slice(0, 7);
  }

  function makeFolder(name) {
    return { id: createId(), name: name || "Journal" };
  }

  function makeNote(folderId, title, body) {
    return {
      id: createId(),
      folderId,
      title: title || `${todayIso()} Entry`,
      body: body || "# Journal Entry\n\nWrite what happened today.",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  function normalizeJournal(raw) {
    if (!raw || typeof raw !== "object") return null;
    if (!Array.isArray(raw.folders) || !Array.isArray(raw.notes)) return null;
    return {
      folders: raw.folders.filter(folder => folder && folder.id != null).map(folder => ({
        id: Number(folder.id),
        name: String(folder.name || "Journal")
      })),
      notes: raw.notes.filter(note => note && note.id != null).map(note => ({
        id: Number(note.id),
        folderId: Number(note.folderId),
        title: String(note.title || "Untitled"),
        body: String(note.body || ""),
        createdAt: Number(note.createdAt) || Date.now(),
        updatedAt: Number(note.updatedAt) || Date.now()
      })),
      selectedFolderId: Number(raw.selectedFolderId) || null,
      selectedNoteId: Number(raw.selectedNoteId) || null
    };
  }

  let journal = null;
  try {
    journal = normalizeJournal(JSON.parse(safeGetStorage(storageKey) || "null"));
  } catch (error) {
    console.warn("writing journal load failed", error);
    journal = null;
  }

  if (!safeGetStorage(WRITING_JOURNAL_PURGE_FLAG)) {
    const emptyFolder = makeFolder(`Journal ${currentMonthLabel()}`);
    journal = {
      folders: [emptyFolder],
      notes: [],
      selectedFolderId: emptyFolder.id,
      selectedNoteId: null
    };
    safeSetStorage(storageKey, JSON.stringify(journal));
    safeSetStorage(legacyStorageKey, "[]");
    safeSetStorage(WRITING_JOURNAL_PURGE_FLAG, "1");
  }

  if (!journal) {
    const defaultFolder = makeFolder(`Journal ${currentMonthLabel()}`);
    journal = {
      folders: [defaultFolder],
      notes: [],
      selectedFolderId: defaultFolder.id,
      selectedNoteId: null
    };
  }

  if (!journal.folders.length) {
    const folder = makeFolder(`Journal ${currentMonthLabel()}`);
    journal.folders.push(folder);
    journal.selectedFolderId = folder.id;
  }

  if (!journal.notes.length) {
    journal.selectedNoteId = null;
  }

  if (!journal.folders.some(folder => folder.id === journal.selectedFolderId)) {
    journal.selectedFolderId = journal.folders[0].id;
  }

  if (!journal.notes.some(note => note.id === journal.selectedNoteId)) {
    const firstInFolder = journal.notes.find(note => note.folderId === journal.selectedFolderId) || journal.notes[0];
    journal.selectedNoteId = firstInFolder ? firstInFolder.id : null;
  }

  const html = `<style>
#writing-term{display:flex;flex-direction:column;background:#050800;color:#00ff41;font-family:'Courier New',Courier,monospace;border:1px solid #00ff41;border-radius:3px;overflow:hidden;box-shadow:0 0 28px rgba(0,255,65,.18),0 0 80px rgba(0,255,65,.05);position:relative;height:100%;min-height:0}
#writing-term::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.22) 3px,rgba(0,0,0,.22) 4px);pointer-events:none;z-index:10}
#wt-topbar{background:#00ff41;color:#050800;font-weight:bold;font-size:.68rem;padding:.2rem .55rem;display:flex;gap:1.5rem;letter-spacing:.07em;flex-shrink:0}
#wt-body{display:grid;grid-template-columns:1fr;flex:1;overflow:hidden;min-height:0}
#wt-sidebar{border-right:1px solid #003d0e;display:flex;flex-direction:column;overflow:hidden}
.wt-pane-head{padding:.2rem .46rem;background:#010d02;border-bottom:1px solid #003d0e;font-size:.66rem;color:#008f11;letter-spacing:.1em;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
.wt-pane-head .wt-c{background:none;border:1px solid #003d0e;color:#00ff41;font-family:'Courier New',monospace;font-size:.62rem;padding:.06rem .26rem;cursor:pointer}
.wt-pane-head .wt-c:hover{background:#003d0e;border-color:#00ff41}
.wt-scroll{overflow-y:auto;flex:1;scrollbar-width:thin;scrollbar-color:#003d0e #050800}
.wt-f-act{padding:.2rem .36rem;display:flex;gap:.22rem;background:#010d02;border-top:1px solid #003d0e;border-bottom:1px solid #003d0e;flex-shrink:0}
.wt-f-act button{flex:1;background:none;border:1px solid #003d0e;color:#008f11;font-family:'Courier New',monospace;font-size:.6rem;padding:.12rem .14rem;cursor:pointer}
.wt-f-act button:hover{color:#00ff41;border-color:#00aa28}
.wt-f-act .wt-d{color:#ff3333;border-color:#4d0000}
.wt-f-act .wt-d:hover{border-color:#ff3333}
#wt-editor{display:flex;flex-direction:column;overflow:hidden}
#wt-ehead{padding:.17rem .46rem;background:#010d02;border-bottom:1px solid #003d0e;display:grid;grid-template-columns:1fr auto auto;gap:.36rem;align-items:center;flex-shrink:0}
#wt-ehead input{background:transparent;border:none;border-bottom:1px dashed #003d0e;color:#00ff41;font-family:'Courier New',monospace;font-size:.8rem;padding:.07rem .26rem;outline:none}
#wt-ehead input:focus{border-bottom-color:#00ff41}
#wt-ehead input::placeholder{color:#003d0e}
#wt-ehead button{background:none;border:1px solid #4d0000;color:#ff3333;font-family:'Courier New',monospace;font-size:.6rem;padding:.09rem .24rem;cursor:pointer}
#wt-ehead button:hover{background:#1a0000;border-color:#ff3333}
#write-status{font-size:.62rem;color:#008f11;min-width:62px;text-align:right;font-family:'Courier New',monospace}
#wt-toolbar{padding:.15rem .36rem;background:#050800;border-bottom:1px solid #003d0e;display:flex;gap:.2rem;flex-wrap:wrap;flex-shrink:0}
#wt-toolbar button{background:none;border:1px solid #003d0e;color:#00aa28;font-family:'Courier New',monospace;font-size:.62rem;padding:.09rem .26rem;cursor:pointer}
#wt-toolbar button:hover{color:#00ff41;border-color:#00aa28;background:#010d02}
#md-input{flex:1;background:#050800;color:#00ff41;border:none;font-family:'Courier New',Courier,monospace;font-size:.82rem;padding:.55rem .7rem;resize:none;outline:none;caret-color:#00ff41;line-height:1.65;min-height:0}
#md-input::selection{background:rgba(0,255,65,.18)}
#wt-modeline{padding:.17rem .5rem;background:#00aa28;color:#050800;font-size:.65rem;display:flex;gap:1.5rem;flex-shrink:0;font-family:'Courier New',monospace;font-weight:bold}
@keyframes wt-blink{0%,49%{opacity:1}50%,100%{opacity:0}}.wt-cur{animation:wt-blink 1s step-start infinite;display:inline-block}
</style>
<div id="writing-term">
  <div id="wt-topbar">
    <span>CYBERDECK/TERMINAL</span>
    <span>WRITING SESSION ACTIVE</span>
    <span>ENC:UTF-8</span>
  </div>
  <div id="wt-body">
    <section id="wt-editor">
      <div id="wt-ehead">
        <input id="note-title" placeholder="entry.txt" />
        <button id="delete-note">rm</button>
        <span id="write-status">READY</span>
      </div>
      <div id="wt-toolbar">
        <button id="md-h1"># H1</button>
        <button id="md-h2">## H2</button>
        <button id="md-bold">**B**</button>
        <button id="md-italic">*I*</button>
        <button id="md-list">- list</button>
        <button id="toggle-live">preview:ON</button>
      </div>
      <textarea id="md-input" spellcheck="false"></textarea>
      <div id="wt-modeline">
        <span>-- INSERT --</span>
        <span>CYBERDECK v0.7</span>
        <span><span class="wt-cur">_</span></span>
      </div>
    </section>
  </div>
</div>
  `;

  const medium = `<style>
#wt-pp{display:flex;flex-direction:column;background:#050800;color:#00ff41;font-family:'Courier New',Courier,monospace;border:1px solid #003d0e;border-radius:3px;overflow:hidden;height:100%;min-height:0}
#wt-pp-head{padding:.2rem .5rem;background:#010d02;border-bottom:1px solid #003d0e;font-size:.66rem;color:#008f11;letter-spacing:.08em;flex-shrink:0}
#md-output{padding:.6rem .75rem;overflow-y:auto;font-family:'Courier New',Courier,monospace;font-size:.78rem;line-height:1.65;color:#00cc35;scrollbar-width:thin;scrollbar-color:#003d0e #050800;flex:1;min-height:0}
#md-output h1,#md-output h2,#md-output h3{color:#00ff41;border-bottom:1px solid #003d0e;padding-bottom:.16rem;margin-top:.55rem}
#md-output strong{color:#00ff41}#md-output em{color:#66ff88;font-style:italic}
#md-output code{background:#010d02;border:1px solid #003d0e;padding:.03rem .2rem;border-radius:2px;font-family:'Courier New',monospace}
#md-output blockquote{border-left:3px solid #008f11;margin-left:0;padding-left:.6rem;color:#008f11}
#md-output a{color:#33ff77}#md-output li{margin:.08rem 0}
</style>
<div id="wt-pp">
  <div id="wt-pp-head">$ cat [SELECTED] | render --markdown</div>
  <article id="md-output"></article>
</div>
  `;

  const tertiary = `<style>
#wt-mini{display:flex;flex-direction:column;background:#050800;color:#00ff41;font-family:'Courier New',Courier,monospace;border:1px solid #003d0e;border-radius:3px;overflow:hidden;flex:1;min-height:0}
#wt-mini .wt-pane-head{padding:.2rem .46rem;background:#010d02;border-bottom:1px solid #003d0e;font-size:.62rem;color:#008f11;letter-spacing:.08em;display:flex;justify-content:space-between;align-items:center}
#wt-mini .wt-scroll{overflow-y:auto;scrollbar-width:thin;scrollbar-color:#003d0e #050800;flex:1;min-height:0}
#wt-mini .wt-pane-head .wt-c{background:none;border:1px solid #003d0e;color:#00ff41;font-family:'Courier New',monospace;font-size:.62rem;padding:.06rem .26rem;cursor:pointer}
#wt-mini .wt-pane-head .wt-c:hover{background:#003d0e;border-color:#00ff41}
#wt-mini .wt-f-act{padding:.2rem .36rem;display:flex;gap:.22rem;background:#010d02;border-top:1px solid #003d0e;border-bottom:1px solid #003d0e;flex-shrink:0}
#wt-mini .wt-f-act button{flex:1;background:none;border:1px solid #003d0e;color:#008f11;font-family:'Courier New',monospace;font-size:.6rem;padding:.12rem .14rem;cursor:pointer}
#wt-mini .wt-f-act button:hover{color:#00ff41;border-color:#00aa28}
#wt-mini .wt-f-act .wt-d{color:#ff3333;border-color:#4d0000}
#wt-mini .wt-f-act .wt-d:hover{border-color:#ff3333}
</style>
<div id="wt-mini">
  <div class="wt-pane-head">
    <span>// DIRECTORIES</span>
    <button id="new-folder" class="wt-c">mkdir</button>
  </div>
  <div class="wt-scroll"><ul id="folder-list" style="list-style:none;padding:0;margin:0;display:grid"></ul></div>
  <div class="wt-f-act">
    <button id="rename-folder">mv</button>
    <button id="delete-folder" class="wt-d">rm -rf</button>
  </div>
  <div class="wt-pane-head" style="border-top:1px solid #003d0e">
    <span>// FILES</span>
    <button id="new-note" class="wt-c">touch</button>
  </div>
  <div class="wt-scroll"><ul id="note-list" style="list-style:none;padding:0;margin:0;display:grid"></ul></div>
</div>
  `;

  setContent({title: "writing"}, medium, html, tertiary);

  const folderList = document.getElementById("folder-list");
  const noteList = document.getElementById("note-list");
  const titleInput = document.getElementById("note-title");
  const input = document.getElementById("md-input");
  const out = document.getElementById("md-output");
  const status = document.getElementById("write-status");
  const liveToggle = document.getElementById("toggle-live");
  const writingControls = [
    document.getElementById("new-folder"),
    document.getElementById("rename-folder"),
    document.getElementById("delete-folder"),
    document.getElementById("new-note"),
    document.getElementById("delete-note"),
    document.getElementById("md-h1"),
    document.getElementById("md-h2"),
    document.getElementById("md-bold"),
    document.getElementById("md-italic"),
    document.getElementById("md-list")
  ];

  if (!folderList || !noteList || !titleInput || !input || !out || !status || !liveToggle || writingControls.some(control => !control)) {
    console.error("Writing view failed to initialize: missing expected DOM nodes.");
    if (els.medium) {
      els.medium.innerHTML = '<div style="padding:.8rem;border:1px solid #4d0000;color:#ff6b6b;background:#130404;border-radius:8px">Writing failed to initialize. Reload and try again.</div>';
    }
    return;
  }

  let isLivePreview = true;
  let saveTimer = null;

  function persistJournal() {
    safeSetStorage(storageKey, JSON.stringify(journal));
    status.textContent = "[SAVED]";
  }

  function getSelectedFolder() {
    return journal.folders.find(folder => folder.id === journal.selectedFolderId) || null;
  }

  function getSelectedNote() {
    return journal.notes.find(note => note.id === journal.selectedNoteId) || null;
  }

  function getNotesInSelectedFolder() {
    return journal.notes
      .filter(note => note.folderId === journal.selectedFolderId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  function ensureNoteSelectionForFolder() {
    const notesInFolder = getNotesInSelectedFolder();
    if (notesInFolder.some(note => note.id === journal.selectedNoteId)) return;

    if (!notesInFolder.length) {
      journal.selectedNoteId = null;
      return;
    }

    journal.selectedNoteId = notesInFolder[0].id;
  }

  function refreshFolders() {
    const folderHtml = journal.folders.map(folder => {
      const isActive = folder.id === journal.selectedFolderId;
      return `<li><button data-folder-id="${folder.id}" style="width:100%;text-align:left;background:${isActive ? "#010d02" : "transparent"};color:${isActive ? "#00ff41" : "#008f11"};border:none;border-left:2px solid ${isActive ? "#00ff41" : "transparent"};padding:.26rem .48rem;cursor:pointer;font-family:'Courier New',monospace;font-size:.74rem;display:block">${isActive ? "▶" : "&nbsp;"} ${esc(folder.name || "Journal")}/</button></li>`;
    }).join("");

    folderList.innerHTML = folderHtml;

    folderList.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        journal.selectedFolderId = Number(btn.dataset.folderId);
        ensureNoteSelectionForFolder();
        hydrateEditor();
      };
    });

  }

  function refreshNotes() {
    const notesInFolder = getNotesInSelectedFolder();
    const notesHtml = notesInFolder.map(note => {
      const isActive = note.id === journal.selectedNoteId;
      return `<li><button data-note-id="${note.id}" style="width:100%;text-align:left;background:${isActive ? "#010d02" : "transparent"};color:${isActive ? "#00ff41" : "#008f11"};border:none;border-left:2px solid ${isActive ? "#00ff41" : "transparent"};padding:.26rem .48rem;cursor:pointer;font-family:'Courier New',monospace;font-size:.74rem;display:block">${isActive ? "➞" : "&nbsp;"} ${esc(note.title || "Untitled")}.txt</button></li>`;
    }).join("");

    noteList.innerHTML = notesHtml;

    noteList.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        journal.selectedNoteId = Number(btn.dataset.noteId);
        hydrateEditor();
      };
    });

  }

  function hydrateEditor() {
    ensureNoteSelectionForFolder();
    const note = getSelectedNote();
    if (!note) {
      titleInput.value = "";
      input.value = "";
      out.innerHTML = "";
      refreshFolders();
      refreshNotes();
      return;
    }
    titleInput.value = note.title || "";
    input.value = note.body || "";
    out.innerHTML = renderMarkdown(input.value || "");
    requestAnimationFrame(syncPreviewScroll);
    refreshFolders();
    refreshNotes();
  }

  function syncPreviewScroll() {
    const maxInputScroll = input.scrollHeight - input.clientHeight;
    const ratio = maxInputScroll > 0 ? input.scrollTop / maxInputScroll : 0;
    const maxPreviewScroll = out.scrollHeight - out.clientHeight;
    out.scrollTop = maxPreviewScroll > 0 ? ratio * maxPreviewScroll : 0;
  }

  function queueSave() {
    status.textContent = "WRITING...";
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      persistJournal();
      if (isLivePreview) {
        out.innerHTML = renderMarkdown(input.value || "");
        requestAnimationFrame(syncPreviewScroll);
      }
    }, 220);
  }

  function applyWrap(before, after) {
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const text = input.value;
    const selected = text.slice(start, end) || "text";
    input.value = text.slice(0, start) + before + selected + after + text.slice(end);
    input.focus();
    const cursor = start + before.length + selected.length + after.length;
    input.setSelectionRange(cursor, cursor);
    input.dispatchEvent(new Event("input"));
  }

  document.getElementById("new-folder").onclick = () => {
    const name = prompt("Folder name", `Journal ${currentMonthLabel()}`);
    if (name == null) return;
    const clean = name.trim();
    if (!clean) return;
    const folder = makeFolder(clean);
    journal.folders.unshift(folder);
    journal.selectedFolderId = folder.id;
    const note = makeNote(folder.id, `${todayIso()} Entry`);
    journal.notes.unshift(note);
    journal.selectedNoteId = note.id;
    persistJournal();
    hydrateEditor();
  };

  document.getElementById("rename-folder").onclick = () => {
    const folder = getSelectedFolder();
    if (!folder) return;
    const name = prompt("Rename folder", folder.name || "Journal");
    if (name == null) return;
    const clean = name.trim();
    if (!clean) return;
    folder.name = clean;
    persistJournal();
    refreshFolders();
  };

  document.getElementById("delete-folder").onclick = () => {
    if (journal.folders.length <= 1) {
      status.textContent = "ERR:KEEP>=1";
      return;
    }

    const folder = getSelectedFolder();
    if (!folder) return;
    const relatedNotes = journal.notes.filter(note => note.folderId === folder.id).length;
    if (!confirm(`Delete folder "${folder.name}" and ${relatedNotes} entr${relatedNotes === 1 ? "y" : "ies"}?`)) return;

    journal.folders = journal.folders.filter(item => item.id !== folder.id);
    journal.notes = journal.notes.filter(note => note.folderId !== folder.id);
    journal.selectedFolderId = journal.folders[0].id;
    ensureNoteSelectionForFolder();
    persistJournal();
    hydrateEditor();
  };

  document.getElementById("new-note").onclick = () => {
    const nextNumber = getNotesInSelectedFolder().length + 1;
    const newNote = makeNote(journal.selectedFolderId, `${todayIso()} Entry ${nextNumber}`, "# Journal Entry\n\nStart writing...");
    journal.notes.unshift(newNote);
    journal.selectedNoteId = newNote.id;
    persistJournal();
    hydrateEditor();
  };

  document.getElementById("delete-note").onclick = () => {
    const note = getSelectedNote();
    if (!note) return;
    if (!confirm(`Delete "${note.title || "Untitled"}"?`)) return;

    journal.notes = journal.notes.filter(item => item.id !== journal.selectedNoteId);
    ensureNoteSelectionForFolder();
    persistJournal();
    hydrateEditor();
  };

  titleInput.addEventListener("input", () => {
    const note = getSelectedNote();
    if (!note) return;
    note.title = titleInput.value.trim() || "Untitled";
    note.updatedAt = Date.now();
    refreshNotes();
    queueSave();
  });

  input.addEventListener("keydown", event => {
    event.stopPropagation();
    if ((event.key === "Enter" || event.code === "NumpadEnter") && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const text = input.value;
      input.value = text.slice(0, start) + "\n" + text.slice(end);
      input.setSelectionRange(start + 1, start + 1);
      input.dispatchEvent(new Event("input"));
    }
  });

  input.addEventListener("input", () => {
    const note = getSelectedNote();
    if (!note) return;
    note.body = input.value;
    note.updatedAt = Date.now();
    if (isLivePreview) {
      out.innerHTML = renderMarkdown(input.value || "");
      requestAnimationFrame(syncPreviewScroll);
    }
    queueSave();
  });

  input.addEventListener("scroll", syncPreviewScroll);

  liveToggle.onclick = () => {
    isLivePreview = !isLivePreview;
    liveToggle.textContent = `preview:${isLivePreview ? "ON" : "OFF"}`;
    if (isLivePreview) {
      out.innerHTML = renderMarkdown(input.value || "");
      requestAnimationFrame(syncPreviewScroll);
    }
  };

  document.getElementById("md-h1").onclick = () => applyWrap("# ", "");
  document.getElementById("md-h2").onclick = () => applyWrap("## ", "");
  document.getElementById("md-bold").onclick = () => applyWrap("**", "**");
  document.getElementById("md-italic").onclick = () => applyWrap("*", "*");
  document.getElementById("md-list").onclick = () => applyWrap("- ", "");

  persistJournal();
  hydrateEditor();
}

function initWritingPencilSprite(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const px = 4;
  let t = 0;

  function drawPencil(x, y, bounce) {
    const by = y + bounce;
    const fill = (dx, dy, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect((x + dx) * px, (by + dy) * px, w * px, h * px);
    };

    fill(0, 3, 18, 4, "#facc15");
    fill(2, 4, 12, 2, "#fef08a");
    fill(18, 3, 2, 4, "#f472b6");
    fill(-3, 3, 3, 4, "#d6b38d");
    fill(-4, 4, 1, 2, "#111827");
    fill(6, 3, 1, 4, "#f59e0b");
    fill(11, 3, 1, 4, "#f59e0b");
  }

  function draw() {
    t += 1;
    ctx.fillStyle = "#050a12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bob = Math.round(Math.sin(t / 10) * 1.5);
    const sparkle = (t % 20) < 10;

    drawPencil(14, 18, bob);

    ctx.fillStyle = sparkle ? "#93c5fd" : "#334155";
    ctx.fillRect(10 * px, 28 * px, px, px);
    ctx.fillRect(33 * px, 14 * px, px, px);
    ctx.fillRect(36 * px, 24 * px, px, px);

    requestAnimationFrame(draw);
  }

  draw();
}

function renderMarkdown(md) {
  return md
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^/,'<p>').concat('</p>');
}

function renderScrapbook() {
  const storageKey = "cyberdeckScrapbookBoard";
  const itemTypes = ["note", "sticker", "photo"];
  const stickerChoices = ["📷", "🎞️", "🖼️", "📌", "✨", "💿", "🌙", "💌", "🧷", "🕯️"];
  const palette = ["#ffcad4", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#bdb2ff"];
  const textureChoices = ["paper", "grid", "dots", "plain"];
  const frameChoices = ["soft", "polaroid", "film", "none"];
  const themeChoices = ["paper", "sunset", "forest", "midnight", "candy"];
  let scrapbook = null;
  let editingId = null;
  let draggedItemId = null;
  let currentImageData = "";
  let pageOpen = true;

  function createId() {
    return Date.now() + Math.floor(Math.random() * 100000);
  }

  function toTitleCase(value) {
    return String(value || "").replace(/\b\w/g, letter => letter.toUpperCase());
  }

  loadPluraldex();
  const alterNameCollator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
  const alterOptions = pluraldexData
    .filter(profile => profile && profile.id != null)
    .map(profile => ({ id: Number(profile.id), name: String(profile.name || "Unnamed") }))
    .sort((left, right) => alterNameCollator.compare(left.name, right.name));

  function createItem(type, overrides) {
    return {
      id: createId(),
      type: type || "note",
      title: "",
      caption: "",
      color: palette[Math.floor(Math.random() * palette.length)],
      image: "",
      sticker: "✨",
      favorite: false,
      texture: "paper",
      frame: type === "photo" ? "polaroid" : "soft",
      tape: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...(overrides || {})
    };
  }

  function createPage(name, itemIds) {
    return {
      id: createId(),
      name: name || "Page",
      itemIds: Array.isArray(itemIds) ? itemIds.slice() : [],
      linkedAlterIds: [],
      layout: "grid",
      theme: "paper",
      coverImage: "",
      backgroundImage: "",
      positions: {}
    };
  }

  function createAlbum(name, pages) {
    return {
      id: createId(),
      name: name || "Scrapbook",
      linkedAlterIds: [],
      pages: Array.isArray(pages) && pages.length ? pages : [createPage("Page 1")]
    };
  }

  function normalizeItem(item) {
    return createItem(String(item && item.type || "note").toLowerCase(), {
      id: Number(item && item.id) || createId(),
      title: String(item && item.title || ""),
      caption: String(item && item.caption || ""),
      color: String(item && item.color || palette[0]),
      image: String(item && item.image || ""),
      sticker: String(item && item.sticker || "✨"),
      favorite: Boolean(item && item.favorite),
      texture: textureChoices.includes(String(item && item.texture || "").toLowerCase()) ? String(item.texture).toLowerCase() : "paper",
      frame: frameChoices.includes(String(item && item.frame || "").toLowerCase()) ? String(item.frame).toLowerCase() : (String(item && item.type || "note").toLowerCase() === "photo" ? "polaroid" : "soft"),
      tape: item && item.tape !== undefined ? Boolean(item.tape) : true,
      createdAt: Number(item && item.createdAt) || Date.now(),
      updatedAt: Number(item && item.updatedAt) || Date.now()
    });
  }

  function buildDefaultScrapbook() {
    const album = createAlbum("Main Book", [createPage("Page 1")]);
    return {
      albums: [album],
      items: [],
      activeAlbumId: album.id,
      activePageId: album.pages[0].id
    };
  }

  try {
    const stored = JSON.parse(safeGetStorage(storageKey) || "null");
    if (Array.isArray(stored)) {
      const legacyItems = stored.filter(Boolean).map(normalizeItem);
      const legacyAlbum = createAlbum("Main Book", [createPage("Page 1", legacyItems.map(item => item.id))]);
      scrapbook = {
        albums: [legacyAlbum],
        items: legacyItems,
        activeAlbumId: legacyAlbum.id,
        activePageId: legacyAlbum.pages[0].id
      };
    } else if (stored && Array.isArray(stored.albums) && Array.isArray(stored.items)) {
      scrapbook = {
        albums: stored.albums.filter(Boolean).map(album => ({
          id: Number(album.id) || createId(),
          name: String(album.name || "Scrapbook"),
          linkedAlterIds: [],
          pages: Array.isArray(album.pages) && album.pages.length
            ? album.pages.filter(Boolean).map(page => ({
              id: Number(page.id) || createId(),
              name: String(page.name || "Page"),
              itemIds: Array.isArray(page.itemIds) ? page.itemIds.map(id => Number(id)).filter(Boolean) : [],
              linkedAlterIds: [],
              layout: String(page.layout || "grid") === "collage" ? "collage" : "grid",
              theme: themeChoices.includes(String(page.theme || "").toLowerCase()) ? String(page.theme).toLowerCase() : "paper",
              coverImage: String(page.coverImage || ""),
              backgroundImage: String(page.backgroundImage || ""),
              positions: page.positions && typeof page.positions === "object" ? page.positions : {}
            }))
            : [createPage("Page 1")]
        })),
        items: stored.items.filter(Boolean).map(normalizeItem),
        activeAlbumId: Number(stored.activeAlbumId) || null,
        activePageId: Number(stored.activePageId) || null
      };
    }
  } catch (error) {
    console.warn("scrapbook load failed", error);
  }

  if (!safeGetStorage(SCRAPBOOK_PURGE_FLAG)) {
    scrapbook = buildDefaultScrapbook();
    safeSetStorage(storageKey, JSON.stringify(scrapbook));
    safeSetStorage(SCRAPBOOK_PURGE_FLAG, "1");
  }

  if (!scrapbook || !scrapbook.albums.length) {
    scrapbook = buildDefaultScrapbook();
  }

  if (!scrapbook.albums.length) {
    scrapbook = buildDefaultScrapbook();
  }

  if (!Array.isArray(scrapbook.items)) {
    scrapbook.items = [];
  }

  function getActiveAlbum() {
    return scrapbook.albums.find(album => album.id === scrapbook.activeAlbumId) || scrapbook.albums[0] || null;
  }

  function getActivePage() {
    const album = getActiveAlbum();
    if (!album) return null;
    return album.pages.find(page => page.id === scrapbook.activePageId) || album.pages[0] || null;
  }

  const initialAlbum = getActiveAlbum();
  if (initialAlbum && !scrapbook.activeAlbumId) scrapbook.activeAlbumId = initialAlbum.id;
  const initialPage = getActivePage();
  if (initialPage && !scrapbook.activePageId) scrapbook.activePageId = initialPage.id;

  const html = `
    <section id="scrapbook-board" style="display:grid;gap:.7rem;align-items:start">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap');
        #scrapbook-board { background:linear-gradient(135deg,#fdf6ec 0%,#f5ede0 50%,#fdf0e8 100%); border-radius:16px; padding:.5rem; }
        #scrapbook-board * { min-width: 0; }
        #scrapbook-board .sb-main { display:grid; gap:.7rem; align-content:start; }
        #scrapbook-board .sb-main.full-page .sb-browser { display:none; }
        #scrapbook-board .sb-main.full-page .sb-page-shell { min-height:78vh; }
        #scrapbook-board .sb-main.full-page .sb-page-canvas { min-height:70vh; }
        #scrapbook-board .sb-grid { display:grid; gap:.85rem; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); }
        #scrapbook-board .sb-page-shell { border:2px solid #c8a97e; border-radius:18px; overflow:hidden; background:#fdf6ec; box-shadow:0 4px 24px rgba(139,90,43,.1),inset 0 0 0 1px rgba(200,169,126,.3); }
        #scrapbook-board .sb-page-header { display:flex; gap:.45rem; flex-wrap:wrap; align-items:center; justify-content:space-between; padding:.55rem .85rem; border-bottom:2px dashed #d4b896; background:linear-gradient(90deg,#f5e6cc,#faebd7,#f5e6cc); }
        #scrapbook-board .sb-page-title { color:#5c3d2a; font-weight:700; font-style:italic; font-size:1.05rem; letter-spacing:.02em; }
        #scrapbook-board .sb-page-title::before { content:"\\1F33F  "; }
        #scrapbook-board .sb-page-tools { display:flex; gap:.4rem; flex-wrap:wrap; }
        #scrapbook-board .sb-page-tools button { width:auto; background:#f5e6cc; border:1.5px solid #c8a97e; color:#5c3d2a; border-radius:20px; font-weight:600; }
        #scrapbook-board .sb-page-tools button:hover { background:#e8d5b7; border-color:#9e7c5b; }
        #scrapbook-board .sb-page-cover { min-height:0; background:#f5ede0 center/cover no-repeat; }
        #scrapbook-board .sb-page-cover.has-cover { min-height:180px; border-bottom:2px dashed #d4b896; }
        #scrapbook-board .sb-page-canvas { padding:.85rem; min-height:320px; background:repeating-linear-gradient(0deg,transparent,transparent 27px,rgba(166,128,95,.12) 28px),linear-gradient(135deg,#fdf6ec,#f7f0e6); }
        #scrapbook-board .sb-theme-paper { background-image:repeating-linear-gradient(0deg,transparent,transparent 27px,rgba(166,128,95,.14) 28px),linear-gradient(150deg,#fdf6ec,#f5e6cc,#faebd7); }
        #scrapbook-board .sb-theme-sunset { background-image:linear-gradient(160deg,#f9ddd0 0%,#f4b8a0 35%,#e89080 65%,#c87878 100%); }
        #scrapbook-board .sb-theme-forest { background-image:linear-gradient(150deg,#e8f0e0 0%,#d0e2c8 40%,#b8d0a8 70%,#9ab890 100%); }
        #scrapbook-board .sb-theme-midnight { background-image:linear-gradient(150deg,#ede0f0 0%,#d8c0e8 45%,#c0a8d8 70%,#a890c0 100%); }
        #scrapbook-board .sb-theme-candy { background-image:linear-gradient(150deg,#fce8f0 0%,#f8d0e4 40%,#f0bcd8 70%,#e8a8cc 100%); }
        #scrapbook-board .sb-layout-collage { display:block; position:relative; min-height:920px; }
        #scrapbook-board .sb-card { position:relative; border:1.5px solid rgba(200,169,126,.8); border-radius:4px; padding:.8rem; background:linear-gradient(160deg,#fffef9,#faf5ed); cursor:pointer; box-shadow:2px 4px 12px rgba(139,90,43,.14),0 1px 2px rgba(139,90,43,.08); transform:rotate(var(--tilt, 0deg)); transition:transform .15s ease,box-shadow .15s ease; overflow:hidden; }
        #scrapbook-board .sb-card:hover { box-shadow:4px 8px 20px rgba(139,90,43,.22); transform:translateY(-3px) rotate(var(--tilt, 0deg)) scale(1.02); }
        #scrapbook-board .sb-card.dragging { opacity:.5; }
        #scrapbook-board .sb-card.drop-target { outline:2px dashed #8fad7c; outline-offset:4px; }
        #scrapbook-board .sb-card.collage-card { position:absolute; width:220px; }
        #scrapbook-board .sb-card.has-tape::before,
        #scrapbook-board .sb-card.has-tape::after { content:""; position:absolute; top:8px; width:52px; height:13px; background:rgba(255,228,140,.78); border:1px solid rgba(255,200,80,.4); box-shadow:0 1px 4px rgba(139,90,43,.12); opacity:.9; }
        #scrapbook-board .sb-card.has-tape::before { left:12px; transform:rotate(-11deg); }
        #scrapbook-board .sb-card.has-tape::after { right:12px; transform:rotate(10deg); }
        #scrapbook-board .sb-body { position:relative; }
        #scrapbook-board .sb-photo { width:100%; aspect-ratio:1 / 1; object-fit:cover; display:block; background:#f0e8dc; }
        #scrapbook-board .sb-photo.frame-polaroid { border:9px solid #fffef9; border-bottom-width:26px; border-radius:2px; box-shadow:2px 4px 10px rgba(139,90,43,.2); }
        #scrapbook-board .sb-photo.frame-film { border:10px solid #4a3728; outline:1px solid #8a6a50; }
        #scrapbook-board .sb-photo.frame-soft { border:6px solid rgba(200,169,126,.5); border-radius:12px; }
        #scrapbook-board .sb-photo.frame-none { border-radius:6px; }
        #scrapbook-board .sb-sticker { min-height:172px; display:grid; place-items:center; font-size:4rem; border-radius:8px; background:rgba(245,229,204,.4); }
        #scrapbook-board .sb-note { min-height:172px; border-radius:4px; padding:1rem; color:#3d2b1f; white-space:pre-wrap; line-height:1.55; font-size:.88rem; }
        #scrapbook-board .sb-texture-paper { background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E"),linear-gradient(160deg,rgba(255,248,235,.9),rgba(250,235,200,.7)); }
        #scrapbook-board .sb-texture-grid { background-image:linear-gradient(rgba(166,128,95,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(166,128,95,.12) 1px,transparent 1px); background-size:20px 20px; }
        #scrapbook-board .sb-texture-dots { background-image:radial-gradient(rgba(139,90,43,.15) 1.4px,transparent 1.4px); background-size:16px 16px; }
        #scrapbook-board .sb-texture-plain { background-image:none; }
        #scrapbook-board .sb-meta { display:flex; justify-content:space-between; gap:.4rem; align-items:center; margin-top:.6rem; border-top:1px dashed rgba(200,169,126,.5); padding-top:.4rem; }
        #scrapbook-board .sb-meta strong { color:#5c3d2a; font-size:.83rem; }
        #scrapbook-board .sb-meta span { color:#9e7c5b; font-size:.75rem; }
        #scrapbook-board .sb-meta button { background:none; border:none; color:#c8a97e; font-size:1rem; cursor:pointer; padding:0 .1rem; }
        #scrapbook-board .sb-meta button:hover { color:#9e7c5b; }
        #scrapbook-board .sb-actions { display:flex; gap:.4rem; flex-wrap:wrap; }
        #scrapbook-board .sb-actions button,
        #scrapbook-board .sb-toolbar button,
        #scrapbook-board .sb-manage button { width:auto; background:#f5e6cc; border:1.5px solid #c8a97e; color:#5c3d2a; border-radius:20px; font-weight:600; }
        #scrapbook-board .sb-actions button:hover,
        #scrapbook-board .sb-toolbar button:hover,
        #scrapbook-board .sb-manage button:hover { background:#e8d5b7; }
        #scrapbook-board .sb-manage select,
        #scrapbook-board .sb-side select,
        #scrapbook-board .sb-side input,
        #scrapbook-board .sb-side textarea { background:#fdf6ec; border:1.5px solid #c8a97e; color:#3d2b1f; border-radius:8px; }
        #scrapbook-board .sb-toolbar,
        #scrapbook-board .sb-manage { display:flex; gap:.45rem; flex-wrap:wrap; align-items:center; }
        #scrapbook-board .sb-manage select { flex:1; min-width:150px; }
        #scrapbook-board .sb-chipline { display:flex; gap:.4rem; flex-wrap:wrap; }
        #scrapbook-board .sb-link-panels { display:grid; gap:.55rem; grid-template-columns:repeat(2,minmax(0,1fr)); }
        #scrapbook-board .sb-link-box { padding:.7rem; border:1.5px dashed #c8a97e; border-radius:12px; background:rgba(253,246,236,.7); }
        #scrapbook-board .sb-link-box h4 { color:#5c3d2a; margin:.1rem 0 .45rem 0; font-style:italic; }
        #scrapbook-board .sb-link-list { display:grid; gap:.35rem; max-height:170px; overflow:auto; }
        #scrapbook-board .sb-link-item { display:flex; gap:.45rem; align-items:center; font-size:.82rem; color:#5c3d2a; }
        #scrapbook-board .sb-side { display:grid; gap:.55rem; padding:.75rem; border:1.5px solid #c8a97e; border-radius:14px; background:linear-gradient(160deg,#fdf6ec,#f7efdf); }
        #scrapbook-board .sb-side h4 { color:#5c3d2a; font-style:italic; }
        #scrapbook-board .sb-side label { color:#7a5c40; font-size:.82rem; }
        @keyframes petal-fall { 0%{transform:translateY(-10px) rotate(0deg);opacity:0} 20%{opacity:1} 100%{transform:translateY(120px) rotate(360deg);opacity:0} }
        #scrapbook-board .sb-petal { position:absolute; pointer-events:none; font-size:.9rem; animation:petal-fall 4s ease-in infinite; }
        @media (max-width: 700px) {
          #scrapbook-board .sb-link-panels { grid-template-columns:1fr; }
        }
      </style>

      <section id="scrapbook-main" class="sb-main full-page">
        <div id="scrapbook-browser" class="sb-browser">
        <div class="sb-manage">
          <select id="scrapbook-album"></select>
          <button id="scrapbook-add-album" type="button">🌿 New Folder</button>
          <button id="scrapbook-rename-album" type="button">✏️ Rename</button>
          <button id="scrapbook-delete-album" type="button" style="background:#f5ddd5;border-color:#c8967e;color:#7a3a2a">🗑 Delete</button>
        </div>
        <div class="sb-manage">
          <select id="scrapbook-page"></select>
          <button id="scrapbook-add-page" type="button">🌸 New Page</button>
          <button id="scrapbook-rename-page" type="button">✏️ Rename</button>
          <button id="scrapbook-delete-page" type="button" style="background:#f5ddd5;border-color:#c8967e;color:#7a3a2a">🗑 Delete</button>
        </div>
        <div class="sb-link-panels">
          <section class="sb-link-box">
            <h4>🌾 Folder Linked Alters</h4>
            <div id="scrapbook-album-links" class="sb-link-list"></div>
          </section>
          <section class="sb-link-box">
            <h4>🌼 Page Linked Alters</h4>
            <div id="scrapbook-page-links" class="sb-link-list"></div>
          </section>
        </div>
        </div>
        <div class="sb-page-shell">
          <div class="sb-page-header">
            <div class="sb-page-title" id="scrapbook-page-title">Page</div>
            <div class="sb-page-tools">
              <button id="scrapbook-toggle-manager" type="button">🪴 Manager</button>
              <button id="scrapbook-new-note" type="button">📝 Note</button>
              <button id="scrapbook-new-sticker" type="button">✨ Sticker</button>
              <button id="scrapbook-new-photo" type="button">📷 Photo</button>
              <button id="scrapbook-print" type="button">🌿 Print</button>
            </div>
          </div>
          <div id="scrapbook-page-cover" class="sb-page-cover"></div>
          <div id="scrapbook-grid" class="sb-grid sb-page-canvas"></div>
        </div>
      </section>
    </section>
  `;

  const medium = `
    <section class="sb-side" style="display:grid;gap:.55rem;align-content:start">
      <h4 style="margin:.1rem 0">🪻 Page Style</h4>
      <label style="display:grid;gap:.2rem">Layout
        <select id="scrapbook-layout"><option value="grid">Grid</option><option value="collage">Collage (Free)</option></select>
      </label>
      <label style="display:grid;gap:.2rem">Theme
        <select id="scrapbook-theme">${themeChoices.map(theme => `<option value="${theme}">${toTitleCase(theme)}</option>`).join("")}</select>
      </label>
      <label style="display:grid;gap:.2rem">Cover image URL
        <input id="scrapbook-cover-image" placeholder="Optional page cover image" />
      </label>
      <label style="display:grid;gap:.2rem">Background image URL
        <input id="scrapbook-background-image" placeholder="Optional page background image" />
      </label>

      <h4 style="margin:.1rem 0">🌷 Card Editor</h4>
      <label style="display:grid;gap:.2rem">Type
        <select id="scrapbook-type">${itemTypes.map(type => `<option value="${type}">${toTitleCase(type)}</option>`).join("")}</select>
      </label>
      <label style="display:grid;gap:.2rem">Title
        <input id="scrapbook-title" placeholder="Card title" />
      </label>
      <label style="display:grid;gap:.2rem">Caption / Note
        <textarea id="scrapbook-caption" style="min-height:16vh"></textarea>
      </label>
      <label style="display:grid;gap:.2rem">Card Colour
        <input id="scrapbook-color" type="color" value="#ffcad4" style="height:42px;padding:.2rem;border-radius:8px" />
      </label>
      <label style="display:grid;gap:.2rem">Paper Texture
        <select id="scrapbook-texture">${textureChoices.map(texture => `<option value="${texture}">${toTitleCase(texture)}</option>`).join("")}</select>
      </label>
      <label style="display:grid;gap:.2rem">Frame Style
        <select id="scrapbook-frame">${frameChoices.map(frame => `<option value="${frame}">${toTitleCase(frame)}</option>`).join("")}</select>
      </label>
      <label style="display:flex;gap:.5rem;align-items:center;color:#7a5c40"><input id="scrapbook-tape" type="checkbox" checked /> 🍯 Washi tape</label>
      <label id="scrapbook-sticker-field" style="display:grid;gap:.2rem">Sticker
        <select id="scrapbook-sticker">${stickerChoices.map(sticker => `<option value="${sticker}">${sticker}</option>`).join("")}</select>
      </label>
      <label id="scrapbook-image-field" style="display:grid;gap:.2rem">Photo upload
        <input id="scrapbook-image-file" type="file" accept="image/*" />
      </label>
      <label id="scrapbook-image-url-field" style="display:grid;gap:.2rem">Image URL
        <input id="scrapbook-image-url" placeholder="Optional image URL override" />
      </label>
      <label style="display:flex;gap:.5rem;align-items:center;color:#7a5c40"><input id="scrapbook-favorite" type="checkbox" /> 🌻 Favourite</label>
      <div class="sb-actions">
        <button id="scrapbook-save" type="button">🌿 Save</button>
        <button id="scrapbook-reset" type="button">↩ Reset</button>
        <button id="scrapbook-delete" type="button" style="background:#f5ddd5;border:1.5px solid #c8967e;color:#7a3a2a;border-radius:20px">🗑 Delete</button>
      </div>

      <h4 style="margin:.1rem 0">🌼 Page Preview</h4>
      <div id="scrapbook-preview" style="padding:.7rem;border:1.5px dashed #c8a97e;border-radius:12px;background:rgba(253,246,236,.8)"></div>
    </section>
  `;

  const small = `
    <section style="display:grid;gap:.55rem;align-content:start;background:linear-gradient(160deg,#fdf6ec,#f7efdf);border:1.5px solid #c8a97e;border-radius:14px;padding:.65rem">
      <h4 style="margin:.1rem 0;color:#5c3d2a;font-style:italic">🌸 Favourites Shelf</h4>
      <p style="margin:0;font-size:.74rem;color:#9e7c5b">your most cherished cards ✿</p>
      <div id="scrapbook-favorites" style="display:grid;gap:.45rem"></div>
    </section>
  `;

  setContent({title: "scrapbook"}, html, medium, small);

  const gridEl = document.getElementById("scrapbook-grid");
  const mainEl = document.getElementById("scrapbook-main");
  const browserEl = document.getElementById("scrapbook-browser");
  const pageTitleEl = document.getElementById("scrapbook-page-title");
  const pageCoverEl = document.getElementById("scrapbook-page-cover");
  const previewEl = document.getElementById("scrapbook-preview");
  const favoritesEl = document.getElementById("scrapbook-favorites");
  const albumLinksEl = document.getElementById("scrapbook-album-links");
  const pageLinksEl = document.getElementById("scrapbook-page-links");
  const albumEl = document.getElementById("scrapbook-album");
  const pageEl = document.getElementById("scrapbook-page");
  const layoutEl = document.getElementById("scrapbook-layout");
  const themeEl = document.getElementById("scrapbook-theme");
  const coverImageEl = document.getElementById("scrapbook-cover-image");
  const backgroundImageEl = document.getElementById("scrapbook-background-image");
  const typeEl = document.getElementById("scrapbook-type");
  const titleEl = document.getElementById("scrapbook-title");
  const captionEl = document.getElementById("scrapbook-caption");
  const colorEl = document.getElementById("scrapbook-color");
  const textureEl = document.getElementById("scrapbook-texture");
  const frameEl = document.getElementById("scrapbook-frame");
  const tapeEl = document.getElementById("scrapbook-tape");
  const stickerEl = document.getElementById("scrapbook-sticker");
  const stickerFieldEl = document.getElementById("scrapbook-sticker-field");
  const imageFieldEl = document.getElementById("scrapbook-image-field");
  const imageUrlFieldEl = document.getElementById("scrapbook-image-url-field");
  const imageFileEl = document.getElementById("scrapbook-image-file");
  const imageUrlEl = document.getElementById("scrapbook-image-url");
  const favoriteEl = document.getElementById("scrapbook-favorite");
  const toggleManagerEl = document.getElementById("scrapbook-toggle-manager");

  function syncMainLayout() {
    const page = getActivePage();
    const canOpen = Boolean(page);
    if (!canOpen) pageOpen = false;
    if (mainEl) {
      mainEl.classList.toggle("full-page", pageOpen && canOpen);
    }
    if (pageTitleEl) {
      pageTitleEl.textContent = page ? `${getActiveAlbum() ? getActiveAlbum().name : "Scrapbook"} / ${page.name}` : "No Page";
    }
    if (toggleManagerEl) {
      toggleManagerEl.textContent = pageOpen ? "Show Manager" : "Open Full Page";
      toggleManagerEl.title = pageOpen ? "Show album/page manager" : "Open page in full view";
    }
    if (browserEl) {
      browserEl.hidden = pageOpen;
    }
  }

  function getItemById(id) {
    return scrapbook.items.find(item => item.id === id) || null;
  }

  function getAlterName(id) {
    const match = alterOptions.find(option => option.id === id);
    return match ? match.name : `Alter ${id}`;
  }

  function openLinkedAlter(id) {
    state.pluraldexSelection = id;
    setActiveTag("pluraldex");
  }

  function renderLinkedAlterChips(ids) {
    if (!ids || !ids.length) return `<span style="color:#8b949e">None linked</span>`;
    return ids.map(id => `<button type="button" class="stat-chip" data-sb-open-alter="${id}">${esc(getAlterName(id))}</button>`).join("");
  }

  function attachLinkedAlterOpenHandlers(root) {
    if (!root) return;
    root.querySelectorAll("[data-sb-open-alter]").forEach(button => {
      button.onclick = () => openLinkedAlter(Number(button.dataset.sbOpenAlter));
    });
  }

  function ensureState() {
    const album = getActiveAlbum();
    if (!album) return;
    if (!album.pages.length) album.pages.push(createPage("Page 1"));
    scrapbook.activeAlbumId = album.id;
    const page = album.pages.find(entry => entry.id === scrapbook.activePageId) || album.pages[0];
    scrapbook.activePageId = page.id;
  }

  function getPageItems() {
    const page = getActivePage();
    if (!page) return [];
    return page.itemIds.map(getItemById).filter(Boolean);
  }

  function getCollagePosition(page, itemId, index) {
    if (!page.positions || typeof page.positions !== "object") page.positions = {};
    if (!page.positions[itemId]) {
      const column = index % 3;
      const row = Math.floor(index / 3);
      page.positions[itemId] = {
        x: 28 + (column * 235),
        y: 24 + (row * 255),
        width: 220
      };
    }
    return page.positions[itemId];
  }

  function applyPageCanvasStyle(page) {
    const themeClass = `sb-theme-${page && page.theme ? page.theme : "paper"}`;
    gridEl.className = `sb-grid sb-page-canvas ${themeClass}${page && page.layout === "collage" ? " sb-layout-collage" : ""}`;
    gridEl.style.backgroundImage = page && page.backgroundImage
      ? `linear-gradient(rgba(9,14,22,.18), rgba(9,14,22,.18)), url("${page.backgroundImage.replace(/"/g, '&quot;')}")`
      : "";
    gridEl.style.backgroundSize = page && page.backgroundImage ? "cover" : "";
    gridEl.style.backgroundPosition = page && page.backgroundImage ? "center" : "";
    pageCoverEl.className = `sb-page-cover${page && page.coverImage ? " has-cover" : ""}`;
    pageCoverEl.style.backgroundImage = page && page.coverImage ? `url("${page.coverImage.replace(/"/g, '&quot;')}")` : "";
  }

  function findLocationForItem(itemId) {
    for (const album of scrapbook.albums) {
      for (const page of album.pages) {
        if (page.itemIds.includes(itemId)) {
          return { albumId: album.id, pageId: page.id };
        }
      }
    }
    return null;
  }

  function persist() {
    ensureState();
    safeSetStorage(storageKey, JSON.stringify(scrapbook));
  }

  function getEditingItem() {
    return getItemById(editingId);
  }

  function updateFieldVisibility() {
    const type = typeEl.value;
    stickerFieldEl.style.display = type === "sticker" ? "grid" : "none";
    imageFieldEl.style.display = type === "photo" ? "grid" : "none";
    imageUrlFieldEl.style.display = type === "photo" ? "grid" : "none";
  }

  function clearEditor() {
    editingId = null;
    currentImageData = "";
    typeEl.value = "note";
    titleEl.value = "";
    captionEl.value = "";
    colorEl.value = palette[0];
    textureEl.value = "paper";
    frameEl.value = "soft";
    tapeEl.checked = true;
    stickerEl.value = "✨";
    imageFileEl.value = "";
    imageUrlEl.value = "";
    favoriteEl.checked = false;
    updateFieldVisibility();
  }

  function populateEditor(item) {
    if (!item) return;
    const location = findLocationForItem(item.id);
    if (location) {
      scrapbook.activeAlbumId = location.albumId;
      scrapbook.activePageId = location.pageId;
    }
    editingId = item.id;
    currentImageData = item.image || "";
    typeEl.value = item.type;
    titleEl.value = item.title || "";
    captionEl.value = item.caption || "";
    colorEl.value = item.color || palette[0];
    textureEl.value = item.texture || "paper";
    frameEl.value = item.frame || (item.type === "photo" ? "polaroid" : "soft");
    tapeEl.checked = Boolean(item.tape);
    stickerEl.value = item.sticker || "✨";
    imageFileEl.value = "";
    imageUrlEl.value = item.image && !item.image.startsWith("data:") ? item.image : "";
    favoriteEl.checked = Boolean(item.favorite);
    updateFieldVisibility();
    renderSelectors();
  }

  function renderSelectors() {
    ensureState();
    const album = getActiveAlbum();
    albumEl.innerHTML = scrapbook.albums.map(entry => `<option value="${entry.id}">${esc(entry.name)}</option>`).join("");
    if (album) albumEl.value = String(album.id);
    const page = getActivePage();
    pageEl.innerHTML = (album ? album.pages : []).map(entry => `<option value="${entry.id}">${esc(entry.name)}</option>`).join("");
    if (page) pageEl.value = String(page.id);
    if (page) {
      layoutEl.value = page.layout || "grid";
      themeEl.value = page.theme || "paper";
      coverImageEl.value = page.coverImage || "";
      backgroundImageEl.value = page.backgroundImage || "";
    }
  }

  function renderAlterLinks() {
    const album = getActiveAlbum();
    const page = getActivePage();

    function renderChecklist(container, selectedIds, scope) {
      if (!alterOptions.length) {
        container.innerHTML = `<p style="margin:0;color:#8b949e">No alters available in Pluraldex yet.</p>`;
        return;
      }
      container.innerHTML = alterOptions.map(option => {
        const checked = selectedIds.includes(option.id) ? " checked" : "";
        return `<label class="sb-link-item"><input type="checkbox" data-sb-link-scope="${scope}" data-sb-link-id="${option.id}"${checked} /> <span>${esc(option.name)}</span></label>`;
      }).join("");
    }

    renderChecklist(albumLinksEl, album ? album.linkedAlterIds || [] : [], "album");
    renderChecklist(pageLinksEl, page ? page.linkedAlterIds || [] : [], "page");

    document.querySelectorAll("[data-sb-link-scope]").forEach(input => {
      input.onchange = () => {
        const id = Number(input.dataset.sbLinkId);
        const target = input.dataset.sbLinkScope === "album" ? getActiveAlbum() : getActivePage();
        if (!target) return;
        const next = new Set(Array.isArray(target.linkedAlterIds) ? target.linkedAlterIds : []);
        if (input.checked) next.add(id); else next.delete(id);
        target.linkedAlterIds = Array.from(next);
        persist();
        renderAlterLinks();
        renderPreview();
      };
    });
  }

  function renderPreview() {
    const album = getActiveAlbum();
    const page = getActivePage();
    const items = getPageItems();
    previewEl.innerHTML = `
      <div style="display:grid;gap:.45rem">
        <strong style="color:#5c3d2a;font-style:italic">${esc(album ? album.name : "Scrapbook")}</strong>
        <span style="color:#9e7c5b;font-size:.82rem">${esc(page ? page.name : "Page")}</span>
        <span style="color:#b89a7a;font-size:.78rem">${page && page.layout === "collage" ? "Drag cards freely around the page canvas." : "Drag cards in the main screen to reorder this page."}</span>
        <div class="sb-chipline">
          <span class="stat-chip" style="background:#f5e6cc;color:#5c3d2a;border-color:#c8a97e">\uD83C\uDF3F ${items.length} cards</span>
          <span class="stat-chip" style="background:#f5e6cc;color:#5c3d2a;border-color:#c8a97e">\u2665 ${items.filter(item => item.favorite).length} loved</span>
          <span class="stat-chip" style="background:#f5e6cc;color:#5c3d2a;border-color:#c8a97e">${toTitleCase(page ? page.layout : "grid")}</span>
          <span class="stat-chip" style="background:#f5e6cc;color:#5c3d2a;border-color:#c8a97e">${toTitleCase(page ? page.theme : "paper")}</span>
        </div>
        <div style="display:grid;gap:.35rem">
          <div><strong style="display:block;margin-bottom:.2rem;color:#7a5c40;font-style:italic">\uD83C\uDF3E Folder Alters</strong><div class="sb-chipline">${renderLinkedAlterChips(album && album.linkedAlterIds || [])}</div></div>
          <div><strong style="display:block;margin-bottom:.2rem;color:#7a5c40;font-style:italic">\uD83C\uDF3C Page Alters</strong><div class="sb-chipline">${renderLinkedAlterChips(page && page.linkedAlterIds || [])}</div></div>
        </div>
        ${items.slice(0, 3).map(item => `<div style="padding:.5rem;border:1.5px dashed #d4b896;border-radius:8px;background:rgba(253,246,236,.8)"><strong style="color:#5c3d2a">${esc(item.title || toTitleCase(item.type))}</strong><div style="font-size:.78rem;color:#9e7c5b">${toTitleCase(item.type)}${item.caption ? ` \u273f ${esc(item.caption.slice(0, 48))}` : ""}</div></div>`).join("") || `<p style="margin:0;color:#9e7c5b;font-style:italic">No cards on this page yet \uD83C\uDF38</p>`}
      </div>
    `;
    attachLinkedAlterOpenHandlers(previewEl);
  }

  function renderFavorites() {
    const favorites = scrapbook.items.filter(item => item.favorite).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6);
    if (!favorites.length) {
      favoritesEl.innerHTML = `<p style="margin:0;color:#9e7c5b;font-style:italic">Favourite cards will nestle here \uD83C\uDF3A</p>`;
      return;
    }
    favoritesEl.innerHTML = favorites.map(item => `<button type="button" data-sb-open="${item.id}" style="text-align:left;padding:.55rem .7rem;border:1.5px dashed #c8a97e;border-radius:10px;background:rgba(253,246,236,.85);color:#5c3d2a;font-size:.82rem">${item.type === "sticker" ? esc(item.sticker || "\u2728") + " " : "\uD83C\uDF3F "}${esc(item.title || "Untitled")}</button>`).join("");
    favoritesEl.querySelectorAll("[data-sb-open]").forEach(button => {
      button.onclick = () => {
        const item = getItemById(Number(button.dataset.sbOpen));
        if (!item) return;
        populateEditor(item);
        renderGrid();
        renderPreview();
        renderFavorites();
      };
    });
  }

  function moveItemWithinPage(sourceId, targetId) {
    const page = getActivePage();
    if (!page || sourceId === targetId) return;
    const sourceIndex = page.itemIds.indexOf(sourceId);
    const targetIndex = page.itemIds.indexOf(targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;
    const next = page.itemIds.slice();
    next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, sourceId);
    page.itemIds = next;
    persist();
    renderGrid();
    renderPreview();
  }

  function cardBody(item) {
    if (item.type === "photo") {
      const frameClass = `frame-${item.frame || "polaroid"}`;
      return item.image
        ? `<img class="sb-photo ${frameClass}" src="${esc(item.image)}" alt="${esc(item.title || "Scrapbook photo")}" />`
        : `<div class="sb-sticker">📷</div>`;
    }
    if (item.type === "sticker") {
      return `<div class="sb-sticker sb-texture-${esc(item.texture || "plain")}" style="background:${esc(item.color)}22">${esc(item.sticker || "✨")}</div>`;
    }
    return `<div class="sb-note sb-texture-${esc(item.texture || "paper")}" style="background:${esc(item.color)}">${esc(item.caption || item.title || "Untitled")}</div>`;
  }

  function renderGrid() {
    renderSelectors();
    const page = getActivePage();
    const items = getPageItems();
    syncMainLayout();
    applyPageCanvasStyle(page);
    gridEl.innerHTML = items.map((item, index) => {
      const tilt = ((index % 5) - 2) * 1.2;
      const position = page && page.layout === "collage" ? getCollagePosition(page, item.id, index) : null;
      return `
        <article class="sb-card ${item.tape ? "has-tape" : ""}${page && page.layout === "collage" ? " collage-card" : ""}" data-sb-id="${item.id}" draggable="true" style="--tilt:${tilt}deg${position ? `;left:${position.x}px;top:${position.y}px;width:${position.width}px` : ""}">
          <div class="sb-body">${cardBody(item)}</div>
          <div class="sb-meta">
            <div>
              <strong style="display:block">${esc(item.title || toTitleCase(item.type))}</strong>
              <span style="font-size:.78rem;color:#8b949e">${toTitleCase(item.type)}</span>
            </div>
            <button type="button" data-sb-fav="${item.id}" title="Toggle favorite">${item.favorite ? "★" : "☆"}</button>
          </div>
        </article>
      `;
    }).join("");

    gridEl.querySelectorAll("[data-sb-id]").forEach(card => {
      card.onclick = () => {
        const item = getItemById(Number(card.dataset.sbId));
        if (!item) return;
        populateEditor(item);
      };
      card.ondragstart = event => {
        draggedItemId = Number(card.dataset.sbId);
        card.classList.add("dragging");
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", String(draggedItemId));
        }
      };
      card.ondragend = () => {
        draggedItemId = null;
        card.classList.remove("dragging");
        gridEl.querySelectorAll(".drop-target").forEach(node => node.classList.remove("drop-target"));
      };
      card.ondragover = event => {
        if (page && page.layout === "collage") return;
        event.preventDefault();
        card.classList.add("drop-target");
      };
      card.ondragleave = () => card.classList.remove("drop-target");
      card.ondrop = event => {
        if (page && page.layout === "collage") return;
        event.preventDefault();
        card.classList.remove("drop-target");
        const targetId = Number(card.dataset.sbId);
        const sourceId = draggedItemId || Number(event.dataTransfer && event.dataTransfer.getData("text/plain"));
        if (!sourceId || !targetId) return;
        moveItemWithinPage(sourceId, targetId);
      };
    });

    gridEl.ondragover = event => {
      if (!page || page.layout !== "collage") return;
      event.preventDefault();
    };
    gridEl.ondrop = event => {
      if (!page || page.layout !== "collage") return;
      event.preventDefault();
      const sourceId = draggedItemId || Number(event.dataTransfer && event.dataTransfer.getData("text/plain"));
      if (!sourceId) return;
      const rect = gridEl.getBoundingClientRect();
      const position = getCollagePosition(page, sourceId, 0);
      position.x = Math.max(12, Math.min(rect.width - (position.width || 220) - 12, event.clientX - rect.left - ((position.width || 220) / 2)));
      position.y = Math.max(12, event.clientY - rect.top - 40);
      const item = getItemById(sourceId);
      if (item) item.updatedAt = Date.now();
      persist();
      renderGrid();
      renderPreview();
    };

    gridEl.querySelectorAll("[data-sb-fav]").forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        const item = getItemById(Number(button.dataset.sbFav));
        if (!item) return;
        item.favorite = !item.favorite;
        item.updatedAt = Date.now();
        persist();
        renderGrid();
        renderPreview();
        renderFavorites();
      };
    });
  }

  function refreshAll() {
    persist();
    syncMainLayout();
    renderGrid();
    renderAlterLinks();
    renderPreview();
    renderFavorites();
  }

  document.getElementById("scrapbook-add-album").onclick = () => {
    const name = prompt("Folder name", `Book ${scrapbook.albums.length + 1}`);
    if (name == null) return;
    const clean = name.trim();
    if (!clean) return;
    const album = createAlbum(clean, [createPage("Page 1")]);
    scrapbook.albums.unshift(album);
    scrapbook.activeAlbumId = album.id;
    scrapbook.activePageId = album.pages[0].id;
    clearEditor();
    refreshAll();
  };

  document.getElementById("scrapbook-rename-album").onclick = () => {
    const album = getActiveAlbum();
    if (!album) return;
    const name = prompt("Rename folder", album.name);
    if (name == null) return;
    const clean = name.trim();
    if (!clean) return;
    album.name = clean;
    refreshAll();
  };

  document.getElementById("scrapbook-delete-album").onclick = () => {
    if (scrapbook.albums.length <= 1) {
      alert("Keep at least one folder.");
      return;
    }
    const album = getActiveAlbum();
    if (!album) return;
    if (!confirm(`Delete folder "${album.name}" and all its pages?`)) return;
    const pageItemIds = album.pages.flatMap(page => page.itemIds);
    scrapbook.items = scrapbook.items.filter(item => !pageItemIds.includes(item.id));
    scrapbook.albums = scrapbook.albums.filter(entry => entry.id !== album.id);
    scrapbook.activeAlbumId = scrapbook.albums[0].id;
    scrapbook.activePageId = scrapbook.albums[0].pages[0].id;
    clearEditor();
    refreshAll();
  };

  document.getElementById("scrapbook-add-page").onclick = () => {
    const album = getActiveAlbum();
    if (!album) return;
    const name = prompt("Page name", `Page ${album.pages.length + 1}`);
    if (name == null) return;
    const clean = name.trim() || `Page ${album.pages.length + 1}`;
    const page = createPage(clean);
    album.pages.push(page);
    scrapbook.activePageId = page.id;
    clearEditor();
    refreshAll();
  };

  document.getElementById("scrapbook-rename-page").onclick = () => {
    const page = getActivePage();
    if (!page) return;
    const name = prompt("Rename page", page.name);
    if (name == null) return;
    const clean = name.trim();
    if (!clean) return;
    page.name = clean;
    refreshAll();
  };

  document.getElementById("scrapbook-delete-page").onclick = () => {
    const album = getActiveAlbum();
    if (!album || album.pages.length <= 1) {
      alert("Keep at least one page in this folder.");
      return;
    }
    const page = getActivePage();
    if (!page) return;
    if (!confirm(`Delete page "${page.name}" and its cards?`)) return;
    scrapbook.items = scrapbook.items.filter(item => !page.itemIds.includes(item.id));
    album.pages = album.pages.filter(entry => entry.id !== page.id);
    scrapbook.activePageId = album.pages[0].id;
    clearEditor();
    refreshAll();
  };

  albumEl.onchange = () => {
    scrapbook.activeAlbumId = Number(albumEl.value);
    const album = getActiveAlbum();
    scrapbook.activePageId = album && album.pages[0] ? album.pages[0].id : null;
    clearEditor();
    refreshAll();
  };

  pageEl.onchange = () => {
    scrapbook.activePageId = Number(pageEl.value);
    pageOpen = true;
    clearEditor();
    refreshAll();
  };

  toggleManagerEl.onclick = () => {
    pageOpen = !pageOpen;
    syncMainLayout();
  };

  [layoutEl, themeEl, coverImageEl, backgroundImageEl].forEach(control => {
    control.oninput = () => {
      const page = getActivePage();
      if (!page) return;
      page.layout = layoutEl.value;
      page.theme = themeEl.value;
      page.coverImage = coverImageEl.value.trim();
      page.backgroundImage = backgroundImageEl.value.trim();
      refreshAll();
    };
  });

  document.getElementById("scrapbook-new-note").onclick = () => {
    clearEditor();
    typeEl.value = "note";
    updateFieldVisibility();
  };
  document.getElementById("scrapbook-new-sticker").onclick = () => {
    clearEditor();
    typeEl.value = "sticker";
    updateFieldVisibility();
  };
  document.getElementById("scrapbook-new-photo").onclick = () => {
    clearEditor();
    typeEl.value = "photo";
    updateFieldVisibility();
  };
  document.getElementById("scrapbook-print").onclick = () => window.print();
  document.getElementById("scrapbook-reset").onclick = clearEditor;
  typeEl.onchange = () => {
    if (typeEl.value === "photo" && frameEl.value === "soft") frameEl.value = "polaroid";
    updateFieldVisibility();
  };

  imageFileEl.onchange = event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type || file.type.indexOf("image/") !== 0) {
      alert("Choose an image file.");
      imageFileEl.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = loadEvent => {
      currentImageData = String(loadEvent.target && loadEvent.target.result || "");
      if (!titleEl.value.trim()) {
        titleEl.value = file.name.replace(/\.[^.]+$/, "");
      }
    };
    reader.readAsDataURL(file);
  };

  document.getElementById("scrapbook-save").onclick = () => {
    const page = getActivePage();
    if (!page) return;
    const type = typeEl.value;
    const payload = {
      type,
      title: titleEl.value.trim(),
      caption: captionEl.value.trim(),
      color: colorEl.value,
      texture: textureEl.value,
      frame: frameEl.value,
      tape: tapeEl.checked,
      image: type === "photo" ? (currentImageData || imageUrlEl.value.trim()) : "",
      sticker: type === "sticker" ? stickerEl.value : "✨",
      favorite: favoriteEl.checked,
      updatedAt: Date.now()
    };

    if (editingId) {
      const index = scrapbook.items.findIndex(item => item.id === editingId);
      if (index > -1) {
        scrapbook.items[index] = { ...scrapbook.items[index], ...payload };
      }
    } else {
      const item = createItem(type, payload);
      scrapbook.items.unshift(item);
      page.itemIds.unshift(item.id);
      if (page.layout === "collage") {
        getCollagePosition(page, item.id, page.itemIds.length - 1);
      }
    }

    clearEditor();
    refreshAll();
  };

  document.getElementById("scrapbook-delete").onclick = () => {
    const item = getEditingItem();
    if (!item) {
      clearEditor();
      return;
    }
    if (!confirm(`Delete scrapbook card "${item.title || toTitleCase(item.type)}"?`)) return;
    scrapbook.items = scrapbook.items.filter(entry => entry.id !== item.id);
    scrapbook.albums.forEach(album => {
      album.pages.forEach(page => {
        page.itemIds = page.itemIds.filter(id => id !== item.id);
      });
    });
    clearEditor();
    refreshAll();
  };

  clearEditor();
  refreshAll();
}

function renderAAC() {
  const storageKey = "cyberdeckAACBoard";
  const categories = ["core", "actions", "social", "feelings", "describe", "people", "needs", "safety", "smoking", "custom"];
  const catMeta = {
    core:     { label: "Core",     color: "#1d4ed8", dark: "#1e3a8a" },
    actions:  { label: "Actions",  color: "#16a34a", dark: "#14532d" },
    social:   { label: "Social",   color: "#9333ea", dark: "#581c87" },
    feelings: { label: "Feelings", color: "#d97706", dark: "#78350f" },
    describe: { label: "Describe", color: "#0284c7", dark: "#0c4a6e" },
    people:   { label: "Things",   color: "#ea580c", dark: "#7c2d12" },
    needs:    { label: "Needs",    color: "#0d9488", dark: "#134e4a" },
    safety:   { label: "Safety",   color: "#dc2626", dark: "#7f1d1d" },
    smoking:  { label: "Smoking",  color: "#166534", dark: "#052e16" },
    custom:   { label: "Custom",   color: "#6b7280", dark: "#1f2937" }
  };
  const defaults = [
    { id: 1,   text: "I",               icon: "🙋",  category: "core",     custom: false },
    { id: 2,   text: "you",             icon: "👉",  category: "core",     custom: false },
    { id: 3,   text: "we",              icon: "👥",  category: "core",     custom: false },
    { id: 4,   text: "it",              icon: "🔲",  category: "core",     custom: false },
    { id: 5,   text: "they",            icon: "🙌",  category: "core",     custom: false },
    { id: 6,   text: "he",              icon: "🧑",  category: "core",     custom: false },
    { id: 7,   text: "she",             icon: "👩",  category: "core",     custom: false },
    { id: 8,   text: "my",              icon: "✋",  category: "core",     custom: false },
    { id: 9,   text: "that",            icon: "☝️",  category: "core",     custom: false },
    { id: 10,  text: "not",             icon: "🚫",  category: "core",     custom: false },
    { id: 20,  text: "want",            icon: "🤲",  category: "actions",  custom: false },
    { id: 21,  text: "go",              icon: "🚶",  category: "actions",  custom: false },
    { id: 22,  text: "eat",             icon: "🍽️",  category: "actions",  custom: false },
    { id: 23,  text: "drink",           icon: "🥤",  category: "actions",  custom: false },
    { id: 24,  text: "help",            icon: "🤝",  category: "actions",  custom: false },
    { id: 25,  text: "stop",            icon: "✋",  category: "actions",  custom: false },
    { id: 26,  text: "more",            icon: "➕",  category: "actions",  custom: false },
    { id: 27,  text: "like",            icon: "❤️",  category: "actions",  custom: false },
    { id: 28,  text: "need",            icon: "🫳",  category: "actions",  custom: false },
    { id: 29,  text: "look",            icon: "👀",  category: "actions",  custom: false },
    { id: 30,  text: "come",            icon: "🫴",  category: "actions",  custom: false },
    { id: 31,  text: "give",            icon: "🎁",  category: "actions",  custom: false },
    { id: 32,  text: "feel",            icon: "💭",  category: "actions",  custom: false },
    { id: 33,  text: "see",             icon: "👁️",  category: "actions",  custom: false },
    { id: 34,  text: "play",            icon: "🎮",  category: "actions",  custom: false },
    { id: 40,  text: "yes",             icon: "✅",  category: "social",   custom: false },
    { id: 41,  text: "no",              icon: "❌",  category: "social",   custom: false },
    { id: 42,  text: "please",          icon: "🙏",  category: "social",   custom: false },
    { id: 43,  text: "thank you",       icon: "😊",  category: "social",   custom: false },
    { id: 44,  text: "sorry",           icon: "😔",  category: "social",   custom: false },
    { id: 45,  text: "hello",           icon: "👋",  category: "social",   custom: false },
    { id: 46,  text: "goodbye",         icon: "🫡",  category: "social",   custom: false },
    { id: 47,  text: "excuse me",       icon: "🤚",  category: "social",   custom: false },
    { id: 48,  text: "maybe",           icon: "🤔",  category: "social",   custom: false },
    { id: 49,  text: "I don't know",    icon: "🤷",  category: "social",   custom: false },
    { id: 50,  text: "happy",           icon: "😄",  category: "feelings", custom: false },
    { id: 51,  text: "sad",             icon: "😢",  category: "feelings", custom: false },
    { id: 52,  text: "angry",           icon: "😠",  category: "feelings", custom: false },
    { id: 53,  text: "scared",          icon: "😨",  category: "feelings", custom: false },
    { id: 54,  text: "tired",           icon: "😴",  category: "feelings", custom: false },
    { id: 55,  text: "sick",            icon: "🤒",  category: "feelings", custom: false },
    { id: 56,  text: "hurt",            icon: "🤕",  category: "feelings", custom: false },
    { id: 57,  text: "okay",            icon: "👍",  category: "feelings", custom: false },
    { id: 58,  text: "excited",         icon: "🤩",  category: "feelings", custom: false },
    { id: 59,  text: "confused",        icon: "😕",  category: "feelings", custom: false },
    { id: 60,  text: "calm",            icon: "😌",  category: "feelings", custom: false },
    { id: 61,  text: "overwhelmed",     icon: "🌊",  category: "feelings", custom: false },
    { id: 70,  text: "good",            icon: "⭐",  category: "describe", custom: false },
    { id: 71,  text: "bad",             icon: "👎",  category: "describe", custom: false },
    { id: 72,  text: "big",             icon: "⬛",  category: "describe", custom: false },
    { id: 73,  text: "little",          icon: "⬜",  category: "describe", custom: false },
    { id: 74,  text: "hot",             icon: "🔥",  category: "describe", custom: false },
    { id: 75,  text: "cold",            icon: "❄️",  category: "describe", custom: false },
    { id: 76,  text: "loud",            icon: "📢",  category: "describe", custom: false },
    { id: 77,  text: "quiet",           icon: "🤫",  category: "describe", custom: false },
    { id: 78,  text: "fast",            icon: "⚡",  category: "describe", custom: false },
    { id: 79,  text: "slow",            icon: "🐢",  category: "describe", custom: false },
    { id: 80,  text: "home",            icon: "🏠",  category: "people",   custom: false },
    { id: 81,  text: "food",            icon: "🍽️",  category: "people",   custom: false },
    { id: 82,  text: "water",           icon: "💧",  category: "people",   custom: false },
    { id: 83,  text: "bathroom",        icon: "🚽",  category: "people",   custom: false },
    { id: 84,  text: "music",           icon: "🎵",  category: "people",   custom: false },
    { id: 85,  text: "outside",         icon: "🌳",  category: "people",   custom: false },
    { id: 86,  text: "TV",              icon: "📺",  category: "people",   custom: false },
    { id: 87,  text: "phone",           icon: "📱",  category: "people",   custom: false },
    { id: 88,  text: "bed",             icon: "🛏️",  category: "people",   custom: false },
    { id: 89,  text: "doctor",          icon: "🩺",  category: "people",   custom: false },
    { id: 90,  text: "break",           icon: "⏸️",  category: "needs",    custom: false },
    { id: 91,  text: "quiet time",      icon: "🤐",  category: "needs",    custom: false },
    { id: 92,  text: "slow down",       icon: "🐌",  category: "needs",    custom: false },
    { id: 93,  text: "too much",        icon: "🌊",  category: "needs",    custom: false },
    { id: 94,  text: "later",           icon: "⌛",  category: "needs",    custom: false },
    { id: 95,  text: "now",             icon: "⚡",  category: "needs",    custom: false },
    { id: 96,  text: "different",       icon: "🔀",  category: "needs",    custom: false },
    { id: 97,  text: "finished",        icon: "✅",  category: "needs",    custom: false },
    { id: 100, text: "I feel unsafe",   icon: "🚨",  category: "safety",   custom: false },
    { id: 101, text: "I need help now", icon: "🆘",  category: "safety",   custom: false },
    { id: 102, text: "stop",            icon: "🛑",  category: "safety",   custom: false },
    { id: 103, text: "call someone",    icon: "📞",  category: "safety",   custom: false },
    { id: 104, text: "leave me alone",  icon: "👋",  category: "safety",   custom: false },
    { id: 105, text: "too much noise",  icon: "🔇",  category: "safety",   custom: false },
    { id: 106, text: "not okay",        icon: "⛔",  category: "safety",   custom: false },
    { id: 107, text: "sensory issue",   icon: "🫂",  category: "safety",   custom: false },
    { id: 110, text: "smoke",           icon: "🚬",  category: "smoking",  custom: false },
    { id: 111, text: "smoke break",     icon: "⏱️",  category: "smoking",  custom: false },
    { id: 112, text: "lighter",         icon: "🔥",  category: "smoking",  custom: false },
    { id: 113, text: "ashtray",         icon: "🫙",  category: "smoking",  custom: false },
    { id: 114, text: "vape",            icon: "💨",  category: "smoking",  custom: false },
    { id: 115, text: "need cigarette",  icon: "🚬",  category: "smoking",  custom: false }
  ];

  let board = [];
  let settings = { rate: 1, pitch: 1, volume: 1, voice: "" };
  let activeCategory = "core";
  let recent = [];
  let sentence = [];

  function toTitleCase(value) {
    return String(value || "").replace(/\b\w/g, l => l.toUpperCase());
  }

  function makeId() {
    return Date.now() + Math.floor(Math.random() * 100000);
  }

  try {
    const stored = JSON.parse(safeGetStorage(storageKey) || "null");
    if (stored && Array.isArray(stored.board)) {
      board = stored.board
        .filter(item => item && item.text)
        .map(item => ({
          id: Number(item.id) || makeId(),
          text: String(item.text),
          icon: String(item.icon || "💬"),
          category: categories.includes(String(item.category || "").toLowerCase()) ? String(item.category).toLowerCase() : "custom",
          custom: Boolean(item.custom)
        }));
      settings = {
        rate: Math.max(0.5, Math.min(2, Number(stored.settings && stored.settings.rate) || 1)),
        pitch: Math.max(0.5, Math.min(2, Number(stored.settings && stored.settings.pitch) || 1)),
        volume: Math.max(0, Math.min(1, Number(stored.settings && stored.settings.volume) || 1)),
        voice: String(stored.settings && stored.settings.voice || "")
      };
    }
  } catch (error) {
    console.warn("aac board load failed", error);
  }

  if (!board.length) {
    board = defaults.map(item => ({ ...item }));
  } else {
    const existingKeys = new Set(
      board.map(item => `${String(item.category || "").toLowerCase()}::${String(item.text || "").trim().toLowerCase()}`)
    );
    defaults.forEach(item => {
      const key = `${String(item.category || "").toLowerCase()}::${String(item.text || "").trim().toLowerCase()}`;
      if (!existingKeys.has(key)) {
        board.push({ ...item });
        existingKeys.add(key);
      }
    });
  }

  const firstNonEmptyCategory = categories.find(cat => board.some(item => item.category === cat));
  if (firstNonEmptyCategory) {
    activeCategory = firstNonEmptyCategory;
  }

  const html = `
    <div id="aac-board">
      <style>
        #aac-board { display:grid; gap:.55rem; }
        #aac-sentence-bar { display:grid; grid-template-columns:1fr auto; gap:.5rem; align-items:stretch; background:#111827; border:2px solid #374151; border-radius:10px; padding:.5rem .65rem; min-height:60px; }
        #aac-sentence-text { font-size:1.08rem; color:#f9fafb; line-height:1.45; align-self:center; min-height:1.5rem; word-break:break-word; }
        #aac-sentence-text.placeholder { color:#6b7280; font-style:italic; }
        #aac-bar-actions { display:flex; gap:.35rem; align-items:center; flex-shrink:0; }
        #aac-bar-actions button { padding:.38rem .58rem; font-size:.8rem; border-radius:8px; border:1px solid #4b5563; background:#1f2937; color:#e5e7eb; cursor:pointer; white-space:nowrap; transition:background .1s; }
        #aac-bar-actions button:hover { background:#374151; }
        #aac-bar-actions #aac-speak-now { background:#1d4ed8; border-color:#3b82f6; color:#fff; font-weight:700; font-size:.85rem; padding:.38rem .75rem; }
        #aac-bar-actions #aac-speak-now:hover { background:#2563eb; }
        #aac-cat-nav { display:flex; gap:.3rem; overflow-x:auto; padding-bottom:.2rem; scrollbar-width:none; }
        #aac-cat-nav::-webkit-scrollbar { display:none; }
        .aac-cat-tab { flex-shrink:0; padding:.3rem .78rem; font-size:.74rem; font-weight:700; border-radius:20px; border:2px solid transparent; cursor:pointer; color:#fff; letter-spacing:.05em; text-transform:uppercase; transition:opacity .12s,transform .08s; }
        .aac-cat-tab:not(.active) { opacity:.5; }
        .aac-cat-tab.active { opacity:1; border-color:rgba(255,255,255,.4); transform:scale(1.05); }
        #aac-symbol-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:.4rem; }
        .aac-sym-btn { display:flex; flex-direction:column; align-items:center; justify-content:center; border:none; border-radius:12px; padding:.55rem .25rem .45rem; cursor:pointer; min-height:88px; transition:filter .1s,transform .08s; position:relative; box-shadow:0 3px 8px rgba(0,0,0,.3); }
        .aac-sym-btn:hover { filter:brightness(1.2); transform:scale(1.05); }
        .aac-sym-btn:active { transform:scale(.96); filter:brightness(.95); }
        .aac-sym-icon { font-size:2.2rem; line-height:1; margin-bottom:.28rem; pointer-events:none; }
        .aac-sym-label { font-size:.69rem; font-weight:700; color:#fff; text-align:center; text-shadow:0 1px 4px rgba(0,0,0,.6); line-height:1.25; word-break:break-word; max-width:100%; pointer-events:none; }
        .aac-sym-del { position:absolute; top:3px; right:4px; background:rgba(0,0,0,.5); border:none; color:#fca5a5; font-size:.65rem; font-weight:700; border-radius:4px; padding:1px 5px; cursor:pointer; line-height:1.4; }
        .aac-sym-del:hover { background:rgba(220,38,38,.7); color:#fff; }
        @media (max-width:600px) { #aac-symbol-grid { grid-template-columns:repeat(4,1fr); } }
      </style>

      <div id="aac-sentence-bar">
        <div id="aac-sentence-text" class="placeholder">Tap symbols to build a message\u2026</div>
        <div id="aac-bar-actions">
          <button id="aac-backspace" title="Remove last word">\u232b</button>
          <button id="aac-clear-sentence" title="Clear all">\u2715 Clear</button>
          <button id="aac-speak-now">\uD83D\uDD0A Speak</button>
        </div>
      </div>

      <div id="aac-cat-nav"></div>
      <div id="aac-symbol-grid"></div>
    </div>
  `;

  const medium = `
    <section style="display:grid;gap:.55rem;align-content:start">
      <h4 style="margin:.1rem 0">Free Text</h4>
      <div style="display:flex;gap:.4rem">
        <input id="aac-input" placeholder="Type a phrase\u2026" style="flex:1" />
        <button id="aac-say" type="button">\uD83D\uDD0A Say</button>
      </div>
      <h4 style="margin:.1rem 0">Add Symbol</h4>
      <input id="aac-new-text" placeholder="Word or phrase" />
      <div style="display:flex;gap:.4rem">
        <input id="aac-new-icon" placeholder="Emoji" style="width:64px;flex-shrink:0" maxlength="4" />
        <select id="aac-new-category" style="flex:1">${categories.map(c => `<option value="${c}">${toTitleCase(catMeta[c] ? catMeta[c].label : c)}</option>`).join("")}</select>
      </div>
      <button id="aac-add" type="button">+ Add to Board</button>
      <h4 style="margin:.1rem 0">Voice</h4>
      <label style="display:grid;gap:.2rem;font-size:.82rem">Voice
        <select id="aac-voice"></select>
      </label>
      <label style="display:grid;gap:.2rem;font-size:.82rem">Speed <span id="aac-rate-label"></span>
        <input id="aac-rate" type="range" min="0.5" max="2" step="0.1" />
      </label>
      <label style="display:grid;gap:.2rem;font-size:.82rem">Pitch <span id="aac-pitch-label"></span>
        <input id="aac-pitch" type="range" min="0.5" max="2" step="0.1" />
      </label>
      <label style="display:grid;gap:.2rem;font-size:.82rem">Volume <span id="aac-volume-label"></span>
        <input id="aac-volume" type="range" min="0" max="1" step="0.05" />
      </label>
      <button id="aac-stop" type="button">\u23F9 Stop Speech</button>
    </section>
  `;

  const small = `
    <section style="display:grid;gap:.5rem;align-content:start">
      <h4 style="margin:.1rem 0">Recent Phrases</h4>
      <div id="aac-recent" style="display:grid;gap:.4rem"></div>
      <button id="aac-clear-recent" type="button" style="margin-top:.3rem">Clear Recent</button>
    </section>
  `;

  setContent({title: "AAC"}, html, medium, small);

  const gridEl = document.getElementById("aac-symbol-grid");
  const catNavEl = document.getElementById("aac-cat-nav");
  const sentenceEl = document.getElementById("aac-sentence-text");
  const recentEl = document.getElementById("aac-recent");
  const voiceEl = document.getElementById("aac-voice");
  const rateEl = document.getElementById("aac-rate");
  const pitchEl = document.getElementById("aac-pitch");
  const volumeEl = document.getElementById("aac-volume");
  const rateLabel = document.getElementById("aac-rate-label");
  const pitchLabel = document.getElementById("aac-pitch-label");
  const volumeLabel = document.getElementById("aac-volume-label");

  function persist() {
    safeSetStorage(storageKey, JSON.stringify({ board, settings }));
  }

  function updateSentenceBar() {
    if (!sentence.length) {
      sentenceEl.textContent = "Tap symbols to build a message\u2026";
      sentenceEl.classList.add("placeholder");
    } else {
      sentenceEl.textContent = sentence.join(" ");
      sentenceEl.classList.remove("placeholder");
    }
  }

  function renderRecent() {
    if (!recent.length) {
      recentEl.innerHTML = `<p style="margin:0;color:#8b949e;font-size:.82rem">No recent phrases yet.</p>`;
      return;
    }
    recentEl.innerHTML = recent
      .map(phrase => `<button type="button" data-replay="${esc(phrase)}" style="text-align:left;padding:.4rem .55rem;border:1px solid #2d3d4b;border-radius:7px;background:#0f1a28;color:#c9d1d9;font-size:.8rem">${esc(phrase)}</button>`)
      .join("");
    recentEl.querySelectorAll("[data-replay]").forEach(button => {
      button.onclick = () => speak(button.dataset.replay || "");
    });
  }

  function renderCategories() {
    catNavEl.innerHTML = categories.map(cat => {
      const meta = catMeta[cat] || { label: toTitleCase(cat), color: "#6b7280" };
      const isActive = cat === activeCategory;
      return `<button class="aac-cat-tab${isActive ? " active" : ""}" data-cat="${cat}" style="background:${meta.color}">${meta.label}</button>`;
    }).join("");
    catNavEl.querySelectorAll(".aac-cat-tab").forEach(button => {
      button.onclick = () => {
        activeCategory = button.dataset.cat || "core";
        renderCategories();
        renderGrid();
      };
    });
  }

  function renderGrid() {
    const items = board.filter(item => item.category === activeCategory);
    const meta = catMeta[activeCategory] || { color: "#374151", dark: "#1f2937" };
    if (!items.length) {
      gridEl.innerHTML = `<p style="grid-column:1/-1;color:#6b7280;font-style:italic;padding:.55rem">No symbols in this category yet.</p>`;
      return;
    }
    gridEl.innerHTML = items.map(item => {
      return `
        <button class="aac-sym-btn" data-id="${item.id}" style="background:linear-gradient(160deg,${meta.color},${meta.dark})">
          ${item.custom ? `<span class="aac-sym-del" data-del="${item.id}">\u2715</span>` : ""}
          <span class="aac-sym-icon">${esc(item.icon || "\uD83D\uDCAC")}</span>
          <span class="aac-sym-label">${esc(item.text)}</span>
        </button>
      `;
    }).join("");
    gridEl.querySelectorAll(".aac-sym-btn").forEach(button => {
      button.onclick = event => {
        if (event.target && event.target.dataset && event.target.dataset.del) return;
        const id = Number(button.dataset.id);
        const item = board.find(b => b.id === id);
        if (!item) return;
        sentence.push(item.text);
        updateSentenceBar();
      };
    });
    gridEl.querySelectorAll(".aac-sym-del").forEach(del => {
      del.onclick = event => {
        event.stopPropagation();
        const id = Number(del.dataset.del);
        board = board.filter(item => item.id !== id || !item.custom);
        persist();
        renderGrid();
      };
    });
  }

  function refreshLabels() {
    rateLabel.textContent = settings.rate.toFixed(1);
    pitchLabel.textContent = settings.pitch.toFixed(1);
    volumeLabel.textContent = settings.volume.toFixed(2);
  }

  function loadVoices() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    voiceEl.innerHTML = `<option value="">Default voice</option>` + voices
      .map(voice => `<option value="${esc(voice.voiceURI)}">${esc(voice.name)} (${esc(voice.lang)})</option>`)
      .join("");
    if (settings.voice) voiceEl.value = settings.voice;
  }

  function speak(text) {
    const clean = String(text || "").trim();
    if (!clean) return;
    if (!window.speechSynthesis) { alert("Speech synthesis not supported"); return; }
    const msg = new SpeechSynthesisUtterance(clean);
    msg.rate = settings.rate;
    msg.pitch = settings.pitch;
    msg.volume = settings.volume;
    const voices = window.speechSynthesis.getVoices();
    if (settings.voice) {
      const found = voices.find(v => v.voiceURI === settings.voice);
      if (found) msg.voice = found;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
    recent.unshift(clean);
    recent = recent.slice(0, 10);
    renderRecent();
  }

  document.getElementById("aac-speak-now").onclick = () => {
    if (!sentence.length) return;
    speak(sentence.join(" "));
    sentence = [];
    updateSentenceBar();
  };
  document.getElementById("aac-backspace").onclick = () => { sentence.pop(); updateSentenceBar(); };
  document.getElementById("aac-clear-sentence").onclick = () => { sentence = []; updateSentenceBar(); };
  document.getElementById("aac-say").onclick = () => speak(document.getElementById("aac-input").value || "");
  document.getElementById("aac-add").onclick = () => {
    const text = document.getElementById("aac-new-text").value.trim();
    const icon = document.getElementById("aac-new-icon").value.trim() || "\uD83D\uDCAC";
    const category = document.getElementById("aac-new-category").value;
    if (!text) { alert("Enter a word or phrase first."); return; }
    board.unshift({ id: makeId(), text, icon, category, custom: true });
    document.getElementById("aac-new-text").value = "";
    document.getElementById("aac-new-icon").value = "";
    persist();
    if (activeCategory !== category) { activeCategory = category; renderCategories(); }
    renderGrid();
  };

  rateEl.value = String(settings.rate);
  pitchEl.value = String(settings.pitch);
  volumeEl.value = String(settings.volume);
  rateEl.oninput = () => { settings.rate = Number(rateEl.value) || 1; refreshLabels(); persist(); };
  pitchEl.oninput = () => { settings.pitch = Number(pitchEl.value) || 1; refreshLabels(); persist(); };
  volumeEl.oninput = () => { settings.volume = Number(volumeEl.value) || 1; refreshLabels(); persist(); };
  voiceEl.onchange = () => { settings.voice = voiceEl.value; persist(); };
  document.getElementById("aac-stop").onclick = () => { if (window.speechSynthesis) window.speechSynthesis.cancel(); };
  document.getElementById("aac-clear-recent").onclick = () => { recent = []; renderRecent(); };

  loadVoices();
  if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  refreshLabels();
  renderCategories();
  renderGrid();
  renderRecent();
  updateSentenceBar();
}

function renderBeacon() {
  const storageKey = "cyberdeckBeaconBoard";
  const defaultChecks = [
    { id: "water", label: "Drank water" },
    { id: "food", label: "Ate recently" },
    { id: "breathe", label: "Grounding / breath check" },
    { id: "contact", label: "Support contact ready" },
    { id: "meds", label: "Medication / care routine checked" },
    { id: "space", label: "Environment feels safe" }
  ];

  let board = {
    checks: {},
    note: "",
    streak: 0,
    history: []
  };

  try {
    const stored = JSON.parse(safeGetStorage(storageKey) || "null");
    if (stored && typeof stored === "object") {
      board = {
        checks: stored.checks && typeof stored.checks === "object" ? stored.checks : {},
        note: String(stored.note || ""),
        streak: Number(stored.streak) || 0,
        history: Array.isArray(stored.history) ? stored.history.slice(0, 12) : []
      };
    }
  } catch (error) {
    console.warn("beacon board load failed", error);
  }

  const html = `
    <section id="beacon-board" style="display:grid;gap:.75rem">
      <style>
        #beacon-board .beacon-shell { border:1px solid #2f353d;border-radius:12px;padding:.75rem;background:linear-gradient(180deg,#0f1a28,#101827);display:grid;gap:.65rem; }
        #beacon-board .beacon-grid { display:grid;gap:.45rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); }
        #beacon-board .beacon-check { display:flex;gap:.5rem;align-items:center;padding:.45rem .55rem;border:1px solid #2f353d;border-radius:8px;background:#0b1422; }
        #beacon-board .beacon-tools { display:flex;gap:.45rem;flex-wrap:wrap; }
        #beacon-board .beacon-tools button { width:auto; }
      </style>

      <section class="beacon-shell">
        <p style="margin:0;color:#9ed0ff">Safety and regulation board.</p>
        <div id="beacon-checks" class="beacon-grid"></div>
        <label style="display:grid;gap:.3rem">Session note
          <textarea id="beacon-note" placeholder="How are you feeling right now?" style="min-height:16vh"></textarea>
        </label>
        <div class="beacon-tools">
          <button id="beacon-eval" type="button">Evaluate</button>
          <button id="beacon-reset" type="button">Reset Checks</button>
        </div>
        <div id="beacon-status" style="color:#8b949e"></div>
      </section>
    </section>
  `;

  const medium = `
    <section style="display:grid;gap:.55rem;align-content:start">
      <h4 style="margin:.2rem 0">Breathing Guide</h4>
      <div style="padding:.65rem;border:1px solid #2f353d;border-radius:10px;background:#0f1a28;display:grid;gap:.5rem">
        <div id="beacon-breath-step" style="font-size:1rem;color:#dbeafe">Ready</div>
        <div id="beacon-breath-count" style="font-size:.82rem;color:#8b949e">Press Start to begin a 30s cycle.</div>
        <div class="stat-row" style="margin:0">
          <button id="beacon-breath-start" type="button">Start</button>
          <button id="beacon-breath-stop" type="button">Stop</button>
        </div>
      </div>

      <h4 style="margin:.2rem 0">Recent Sessions</h4>
      <div id="beacon-history" style="display:grid;gap:.4rem"></div>
    </section>
  `;

  const small = `
    <section style="display:grid;gap:.55rem;align-content:start">
      <h4 style="margin:.2rem 0">Quick Grounding</h4>
      <div id="beacon-prompt" style="padding:.6rem;border:1px solid #2f353d;border-radius:10px;background:#0f1a28;color:#c9d1d9"></div>
      <button id="beacon-next-prompt" type="button">Next Prompt</button>
      <div id="beacon-streak" class="stat-chip" style="justify-self:start"></div>
    </section>
  `;

  setContent({title: "beacon"}, html, medium, small);

  const checksEl = document.getElementById("beacon-checks");
  const noteEl = document.getElementById("beacon-note");
  const statusEl = document.getElementById("beacon-status");
  const historyEl = document.getElementById("beacon-history");
  const promptEl = document.getElementById("beacon-prompt");
  const streakEl = document.getElementById("beacon-streak");
  const breathStepEl = document.getElementById("beacon-breath-step");
  const breathCountEl = document.getElementById("beacon-breath-count");

  const prompts = [
    "Name 5 things you can see right now.",
    "Take one slow breath: in for 4, hold for 4, out for 6.",
    "Relax your shoulders and unclench your jaw.",
    "Sip water and check your body temperature.",
    "Text or ping one safe person if needed.",
    "Name one thing that is true and safe in this moment."
  ];

  let promptIndex = 0;
  let breathTimer = null;

  function saveBoard() {
    safeSetStorage(storageKey, JSON.stringify(board));
  }

  function countChecks() {
    return defaultChecks.filter(item => Boolean(board.checks[item.id])).length;
  }

  function evaluateLevel(score) {
    const ratio = score / defaultChecks.length;
    if (ratio >= 0.84) return { label: "stable", color: "#4ade80" };
    if (ratio >= 0.5) return { label: "watch", color: "#f59e0b" };
    return { label: "critical", color: "#f87171" };
  }

  function addHistory(score, level) {
    board.history.unshift({
      at: Date.now(),
      score,
      total: defaultChecks.length,
      level
    });
    board.history = board.history.slice(0, 12);
  }

  function renderChecks() {
    checksEl.innerHTML = defaultChecks.map(item => {
      const checked = board.checks[item.id] ? " checked" : "";
      return `<label class="beacon-check"><input type="checkbox" data-beacon-check="${item.id}"${checked} /> <span>${esc(item.label)}</span></label>`;
    }).join("");

    checksEl.querySelectorAll("[data-beacon-check]").forEach(input => {
      input.onchange = () => {
        board.checks[input.dataset.beaconCheck] = input.checked;
        saveBoard();
      };
    });
  }

  function renderHistory() {
    if (!board.history.length) {
      historyEl.innerHTML = `<p style="margin:0;color:#8b949e">No sessions yet.</p>`;
      return;
    }
    historyEl.innerHTML = board.history.map(entry => {
      const time = new Date(entry.at).toLocaleString();
      return `<div style="padding:.5rem;border:1px solid #2f353d;border-radius:8px;background:#0f1a28"><strong>${entry.score}/${entry.total}</strong> • ${esc(entry.level)}<div style="font-size:.75rem;color:#8b949e">${esc(time)}</div></div>`;
    }).join("");
  }

  function renderPrompt() {
    promptEl.textContent = prompts[promptIndex % prompts.length];
  }

  function renderStreak() {
    streakEl.textContent = `Stable streak: ${board.streak}`;
  }

  function stopBreathing(resetText) {
    if (breathTimer) {
      clearInterval(breathTimer);
      breathTimer = null;
    }
    if (resetText) {
      breathStepEl.textContent = "Ready";
      breathCountEl.textContent = "Press Start to begin a 30s cycle.";
    }
  }

  function startBreathing() {
    stopBreathing(false);
    const pattern = [
      { label: "Inhale", seconds: 4 },
      { label: "Hold", seconds: 4 },
      { label: "Exhale", seconds: 6 }
    ];
    let stage = 0;
    let stageLeft = pattern[stage].seconds;
    let totalLeft = 30;

    function tick() {
      const current = pattern[stage];
      breathStepEl.textContent = current.label;
      breathCountEl.textContent = `${stageLeft}s in this step • ${totalLeft}s left`;
      stageLeft -= 1;
      totalLeft -= 1;

      if (stageLeft < 0) {
        stage = (stage + 1) % pattern.length;
        stageLeft = pattern[stage].seconds;
      }

      if (totalLeft < 0) {
        stopBreathing(false);
        breathStepEl.textContent = "Complete";
        breathCountEl.textContent = "Cycle complete. Run another if needed.";
      }
    }

    tick();
    breathTimer = setInterval(tick, 1000);
  }

  noteEl.value = board.note;
  noteEl.oninput = () => {
    board.note = noteEl.value;
    saveBoard();
  };

  document.getElementById("beacon-next-prompt").onclick = () => {
    promptIndex = (promptIndex + 1) % prompts.length;
    renderPrompt();
  };

  document.getElementById("beacon-breath-start").onclick = startBreathing;
  document.getElementById("beacon-breath-stop").onclick = () => stopBreathing(true);

  document.getElementById("beacon-reset").onclick = () => {
    board.checks = {};
    statusEl.textContent = "Checks reset.";
    renderChecks();
    saveBoard();
  };

  document.getElementById("beacon-eval").onclick = () => {
    const score = countChecks();
    const level = evaluateLevel(score);
    if (level.label === "stable") board.streak += 1;
    else board.streak = 0;
    addHistory(score, level.label);
    statusEl.innerHTML = `Stability score: <strong style="color:${level.color}">${score}/${defaultChecks.length}</strong> • ${level.label}`;
    renderHistory();
    renderStreak();
    saveBoard();
  };

  renderChecks();
  renderHistory();
  renderPrompt();
  renderStreak();
}

function renderPartners() {
  const storageKey = "cyberdeckPartnersData";
  const defaultRelTypes = [
    { id: 1, name: "partner",        color: "#f472b6" },
    { id: 2, name: "qpr",            color: "#a78bfa" },
    { id: 3, name: "datemate",       color: "#fb923c" },
    { id: 4, name: "queerplatonic",  color: "#34d399" },
    { id: 5, name: "friend",         color: "#60a5fa" },
  ];

  let raw = safeGetStorage(storageKey);
  let data;
  try { data = raw ? JSON.parse(raw) : null; } catch(e) { data = null; }
  if (!data) data = { people: [], relationships: [], relTypes: JSON.parse(JSON.stringify(defaultRelTypes)), positions: {} };
  if (!Array.isArray(data.relTypes) || !data.relTypes.length) data.relTypes = JSON.parse(JSON.stringify(defaultRelTypes));
  if (!data.positions) data.positions = {};
  // Ensure self node always exists (id = 0)
  if (!data.people.find(p => p.id === 0)) {
    data.people.unshift({ id: 0, name: "self", color: "#a21caf", notes: "", isSelf: true });
  }
  data.people[data.people.findIndex(p => p.id === 0)].isSelf = true;

  function save() { safeSetStorage(storageKey, JSON.stringify(data)); }
  function nextId(arr) { return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1; }

  // ── HTML ──
  const large = `<style>
    #screen-large, #screen-large > #large-content { height:100%; min-height:0; display:flex; flex-direction:column; overflow:hidden; }
    #pw-shell { display:grid; grid-template-rows:auto 1fr; gap:.6rem; padding:.8rem; flex:1; min-height:0;
      border:1px solid rgba(244,114,182,.3); border-radius:16px;
      background: radial-gradient(120% 120% at 10% -10%, rgba(244,114,182,.1), transparent 42%),
        radial-gradient(100% 100% at 90% 100%, rgba(167,139,250,.12), transparent 44%),
        linear-gradient(160deg, #180f1e 0%, #1a1030 55%, #1c1440 100%);
      box-shadow: 0 18px 34px rgba(4,6,14,.42); }
    #pw-toolbar { display:flex; gap:.5rem; flex-wrap:wrap; align-items:center; }
    #pw-toolbar button { padding:.28rem .72rem; border-radius:8px; border:1px solid rgba(244,114,182,.45);
      background:rgba(244,114,182,.12); color:#fce7f3; font-size:.8rem; cursor:pointer; transition:background .15s; }
    #pw-toolbar button:hover { background:rgba(244,114,182,.25); }
    #pw-toolbar button.active { background:rgba(244,114,182,.38); border-color:#f472b6; box-shadow:0 0 8px rgba(244,114,182,.3); }
    #pw-mode-label { color:#ddd6fe; font-size:.78rem; font-family:"Palatino Linotype",serif; margin-left:auto; }
    #pw-canvas-wrap { position:relative; border:1px solid rgba(244,114,182,.18); border-radius:12px;
      overflow:hidden; background:rgba(10,6,18,.65); min-height:0; height:100%; min-height:480px; }
    #pw-canvas { display:block; width:100%; height:100%; }
    #pw-empty { position:absolute; inset:0; display:grid; place-items:center;
      color:rgba(244,114,182,.32); font-size:.88rem; font-family:"Palatino Linotype",serif;
      pointer-events:none; text-align:center; line-height:2; }
  </style>
  <section id="pw-shell">
    <div id="pw-toolbar">
      <button id="pw-add-person">+ person</button>
      <button id="pw-arrange-btn">arrange</button>
      <span id="pw-mode-label">// relationship web</span>
    </div>
    <div id="pw-canvas-wrap">
      <canvas id="pw-canvas"></canvas>
      <div id="pw-empty">add people to begin the web<br><span style="font-size:.75rem;opacity:.5">use the toolbar above</span></div>
    </div>
  </section>`;

  const medium = `<section style="height:100%;display:grid;place-items:center;
    border:1px solid rgba(244,114,182,.22);border-radius:14px;
    background:linear-gradient(160deg,#180f1e,#1a1030);padding:.7rem">
    <div style="text-align:center;color:rgba(244,114,182,.35);font-family:'Palatino Linotype',serif;font-size:.86rem;line-height:2">
      select a person<br>in the web to view their profile
    </div>
  </section>`;

  const small = `<div id="pw-reltype-shell" style="height:100%"></div>`;

  setContent({ title: "partners" }, large, medium, small);

  // ── Canvas ──
  const canvas = document.getElementById("pw-canvas");
  const ctx = canvas.getContext("2d");
  const wrap = document.getElementById("pw-canvas-wrap");
  const emptyMsg = document.getElementById("pw-empty");
  const NODE_R = 30;

  let ws = { drag:null, dragOX:0, dragOY:0, moved:false, selId:null, downNodeId:null };

  function getPos(id) {
    if (id === 0) {
      // self is always snapped to canvas center
      const cw = canvas.width || 400, ch = canvas.height || 300;
      data.positions[0] = { x: cw / 2, y: ch / 2 };
    } else if (!data.positions[id]) {
      const others = data.people.filter(p => p.id !== 0);
      const idx = others.findIndex(p => p.id === id);
      const n = Math.max(others.length, 1);
      const angle = (idx / n) * Math.PI * 2 - Math.PI / 2;
      const cw = canvas.width || 400, ch = canvas.height || 300;
      const r = Math.min(cw, ch) * 0.32;
      data.positions[id] = { x: cw/2 + r * Math.cos(angle), y: ch/2 + r * Math.sin(angle) };
    }
    return data.positions[id];
  }

  function nodeAt(x, y) {
    // Prefer non-self hits so overlapping nodes remain selectable.
    const ordered = data.people.slice().sort((a, b) => Number(a.id === 0) - Number(b.id === 0));
    return ordered.find(p => {
      const isSelf = p.id === 0;
      const r = isSelf ? NODE_R + 10 : NODE_R;
      const pos = getPos(p.id); const dx = pos.x - x, dy = pos.y - y;
      return dx*dx + dy*dy <= r*r;
    }) || null;
  }

  function enforceSelfOrbit(minGap = NODE_R + 88) {
    const center = getPos(0);
    let changed = false;
    data.people.filter(p => p.id !== 0).forEach(p => {
      const pos = getPos(p.id);
      let dx = pos.x - center.x;
      let dy = pos.y - center.y;
      let d = Math.sqrt(dx*dx + dy*dy);
      if (d < minGap) {
        if (d < 0.001) {
          const a = Math.random() * Math.PI * 2;
          dx = Math.cos(a);
          dy = Math.sin(a);
          d = 1;
        }
        const nx = dx / d;
        const ny = dy / d;
        pos.x = center.x + nx * minGap;
        pos.y = center.y + ny * minGap;
        changed = true;
      }
    });
    return changed;
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    enforceSelfOrbit();

    // edges
    const linkedPairs = new Set();
    data.relationships.forEach(rel => {
      const fp = data.people.find(p => p.id === rel.from);
      const tp = data.people.find(p => p.id === rel.to);
      if (!fp || !tp) return;
      const pairKey = rel.from < rel.to ? `${rel.from}-${rel.to}` : `${rel.to}-${rel.from}`;
      linkedPairs.add(pairKey);
      const a = getPos(fp.id), b = getPos(tp.id);
      const rt = data.relTypes.find(r => r.id === rel.typeId);
      const col = rt ? rt.color : "#888";
      ctx.save();
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.globalAlpha = .78;
      ctx.stroke(); ctx.restore();
      if (rt) {
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        ctx.save();
        ctx.font = "bold 9px 'Palatino Linotype',serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        const tw = ctx.measureText(rt.name).width;
        ctx.fillStyle = "rgba(18,6,30,.8)"; ctx.globalAlpha = .9;
        if (ctx.roundRect) ctx.roundRect(mx - tw/2 - 3, my - 14, tw + 6, 13, 3);
        else ctx.rect(mx - tw/2 - 3, my - 14, tw + 6, 13);
        ctx.fill();
        ctx.fillStyle = col; ctx.globalAlpha = .95;
        ctx.fillText(rt.name, mx, my - 7);
        ctx.restore();
      }
    });

    // Fallback links: keep each node visually connected to self with a colored line.
    const self = data.people.find(p => p.id === 0);
    if (self) {
      const sPos = getPos(0);
      const fallbackRelColor = (data.relTypes && data.relTypes[0] && data.relTypes[0].color) || "#a78bfa";
      data.people.filter(p => p.id !== 0).forEach(p => {
        const pairKey = p.id < 0 ? `${p.id}-0` : `0-${p.id}`;
        if (linkedPairs.has(pairKey)) return;
        const pos = getPos(p.id);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sPos.x, sPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = fallbackRelColor;
        ctx.lineWidth = 4.2;
        ctx.globalAlpha = .68;
        ctx.stroke();
        ctx.restore();
      });
    }

    // connect-mode dashed preview
    if (ws.connMode && ws.connFrom) {
      const a = getPos(ws.connFrom.id);
      ctx.save();
      ctx.setLineDash([5, 4]); ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 1.5; ctx.globalAlpha = .55;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(ws.mx, ws.my); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
    }

    // nodes
    data.people.forEach(p => {
      const isSelf = p.id === 0;
      const r = isSelf ? NODE_R + 10 : NODE_R;
      const pos = getPos(p.id), sel = ws.selId === p.id;
      ctx.save();
      if (isSelf) {
        // pulsing outer ring for self
        ctx.beginPath(); ctx.arc(pos.x, pos.y, r + 7, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(192,38,211,.35)"; ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]);
      }
      if (sel) { ctx.shadowColor = isSelf ? "#c026d3" : "#f472b6"; ctx.shadowBlur = 26; }
      ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.fillStyle = p.color || "#2d1a3a"; ctx.fill();
      ctx.strokeStyle = sel ? (isSelf ? "#e879f9" : "#f9a8d4") : (isSelf ? "rgba(192,38,211,.7)" : "rgba(244,114,182,.35)");
      ctx.lineWidth = sel ? 3 : (isSelf ? 2.5 : 1.5); ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.font = `bold ${isSelf ? 14 : 13}px 'Palatino Linotype',serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#fce7f3";
      ctx.fillText(isSelf ? "✦" : (p.name || "?").split(/\s+/).map(w => w[0] || "").join("").toUpperCase().slice(0, 2), pos.x, pos.y);
      ctx.restore();
      ctx.save();
      ctx.font = `${isSelf ? "bold " : ""}11px 'Palatino Linotype',serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillStyle = sel ? "#fce7f3" : (isSelf ? "#e879f9" : "#e9d5ff");
      ctx.fillText(p.name || "?", pos.x, pos.y + r + 5);
      ctx.restore();
    });

    // hide empty msg — self is always present so use other people count
    if (emptyMsg) emptyMsg.style.display = data.people.filter(p => p.id !== 0).length ? "none" : "grid";
  }

  // ── Auto layout (force-directed) ──
  function autoLayout() {
    const nodes = data.people.filter(p => p.id !== 0);
    if (!nodes.length) return;
    const cw = canvas.width || 400, ch = canvas.height || 300;
    const cx = cw / 2, cy = ch / 2;
    nodes.forEach(p => getPos(p.id));
    const K_R = 28000, K_S = 0.075, K_G = 0.008;
    const REST = Math.min(cw, ch) * 0.42, DAMP = 0.8;
    const vel = {};
    nodes.forEach(p => vel[p.id] = { x: 0, y: 0 });
    for (let iter = 0; iter < 160; iter++) {
      const F = {};
      nodes.forEach(p => F[p.id] = { x: 0, y: 0 });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const pa = data.positions[nodes[i].id], pb = data.positions[nodes[j].id];
          let dx = pa.x - pb.x, dy = pa.y - pb.y;
          if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
            // Break exact overlap so repulsion can separate nodes.
            const a = Math.random() * Math.PI * 2;
            dx = Math.cos(a) * 0.2;
            dy = Math.sin(a) * 0.2;
          }
          const d2 = dx*dx + dy*dy || 1, d = Math.sqrt(d2), f = K_R / d2;
          F[nodes[i].id].x += f*dx/d; F[nodes[i].id].y += f*dy/d;
          F[nodes[j].id].x -= f*dx/d; F[nodes[j].id].y -= f*dy/d;
        }
      }
      data.relationships.forEach(rel => {
        const aPos = rel.from === 0 ? { x:cx, y:cy } : data.positions[rel.from];
        const bPos = rel.to   === 0 ? { x:cx, y:cy } : data.positions[rel.to];
        if (!aPos || !bPos) return;
        let dx = bPos.x - aPos.x, dy = bPos.y - aPos.y;
        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
          // Break exact overlap on linked nodes (e.g., self + one node).
          const a = Math.random() * Math.PI * 2;
          dx = Math.cos(a) * 0.2;
          dy = Math.sin(a) * 0.2;
        }
        const d = Math.sqrt(dx*dx + dy*dy) || 1, f = K_S * (d - REST);
        const fx = f*dx/d, fy = f*dy/d;
        if (rel.from !== 0 && F[rel.from]) { F[rel.from].x += fx; F[rel.from].y += fy; }
        if (rel.to   !== 0 && F[rel.to])   { F[rel.to].x   -= fx; F[rel.to].y   -= fy; }
      });
      nodes.forEach(p => {
        const pos = data.positions[p.id];
        F[p.id].x += K_G * (cx - pos.x); F[p.id].y += K_G * (cy - pos.y);
        // Keep non-self nodes out of the self center hit area.
        const sdx = pos.x - cx, sdy = pos.y - cy;
        const sd = Math.sqrt(sdx*sdx + sdy*sdy) || 1;
        const minSelfGap = NODE_R + 88;
        if (sd < minSelfGap) {
          const push = (minSelfGap - sd) * 0.9;
          F[p.id].x += (sdx / sd) * push;
          F[p.id].y += (sdy / sd) * push;
        }
        vel[p.id].x = (vel[p.id].x + F[p.id].x) * DAMP;
        vel[p.id].y = (vel[p.id].y + F[p.id].y) * DAMP;
        pos.x += vel[p.id].x; pos.y += vel[p.id].y;
        const pad = NODE_R + 24;
        pos.x = Math.max(pad, Math.min(cw - pad, pos.x));
        pos.y = Math.max(pad, Math.min(ch - pad, pos.y));
      });
    }
    save(); draw();
  }

  function sizeCanvas() {
    canvas.width = wrap.clientWidth || 400;
    canvas.height = wrap.clientHeight || 300;
    if (enforceSelfOrbit()) save();
    draw();
  }

  const _ro = new ResizeObserver(sizeCanvas);
  _ro.observe(wrap);
  requestAnimationFrame(sizeCanvas);

  // ── Mouse events ──
  function xy(e) {
    const r = canvas.getBoundingClientRect(), s = e.touches ? e.touches[0] : e;
    return { x: s.clientX - r.left, y: s.clientY - r.top };
  }

  canvas.addEventListener("mousedown", e => {
    const { x, y } = xy(e);
    const node = nodeAt(x, y);
    ws.downNodeId = node ? node.id : null;
    // self node is not draggable
    if (node && node.id !== 0) { const pos = getPos(node.id); ws.drag = node; ws.dragOX = x - pos.x; ws.dragOY = y - pos.y; ws.moved = false; }
    else if (node && node.id === 0) { ws.drag = null; }
  });

  canvas.addEventListener("mousemove", e => {
    const { x, y } = xy(e);
    if (ws.drag) {
      const pos = getPos(ws.drag.id), nx = x - ws.dragOX, ny = y - ws.dragOY;
      if ((nx - pos.x) ** 2 + (ny - pos.y) ** 2 > 4) ws.moved = true;
      data.positions[ws.drag.id] = { x: nx, y: ny };
      canvas.style.cursor = "grabbing"; draw();
    } else {
      canvas.style.cursor = nodeAt(x, y) ? "pointer" : "default";
    }
  });

  canvas.addEventListener("mouseup", e => {
    const { x, y } = xy(e);
    const releaseNode = nodeAt(x, y);
    const dragNode = ws.drag;
    if (dragNode && !ws.moved) {
      ws.selId = dragNode.id; showProfile(dragNode); draw();
    } else if (dragNode && ws.moved) {
      enforceSelfOrbit();
      save(); draw();
    } else if (!dragNode && releaseNode && ws.downNodeId === releaseNode.id) {
      // Handle click-only selection for non-draggable nodes like self.
      ws.selId = releaseNode.id; showProfile(releaseNode); draw();
    }
    ws.downNodeId = null;
    ws.drag = null; ws.moved = false;
    canvas.style.cursor = "default";
  });

  canvas.addEventListener("mouseleave", () => { ws.drag = null; });

  // ── Toolbar ──
  document.getElementById("pw-add-person").addEventListener("click", () => showAddPersonDialog());
  document.getElementById("pw-arrange-btn").addEventListener("click", () => autoLayout());

  // ── Profile panel (medium) ──
  function profileEmpty() {
    els.medium.innerHTML = `<section style="height:100%;display:grid;place-items:center;
      border:1px solid rgba(244,114,182,.22);border-radius:14px;
      background:linear-gradient(160deg,#180f1e,#1a1030);padding:.7rem">
      <div style="text-align:center;color:rgba(244,114,182,.35);font-family:'Palatino Linotype',serif;font-size:.86rem;line-height:2">
        select a person<br>in the web to view their profile
      </div></section>`;
  }

  function showProfile(person) {
    if (!person) { profileEmpty(); return; }
    const rels = data.relationships
      .filter(r => r.from === person.id || r.to === person.id)
      .map(r => ({
        rel: r,
        other: data.people.find(p => p.id === (r.from === person.id ? r.to : r.from)),
        rt: data.relTypes.find(t => t.id === r.typeId)
      }));
    const relHtml = rels.length
      ? rels.map(({ other, rt, rel }) => `
          <div style="display:flex;align-items:center;gap:.4rem;padding:.26rem 0;border-bottom:1px solid rgba(244,114,182,.1)">
            <span style="width:9px;height:9px;border-radius:50%;background:${esc(rt ? rt.color : '#888')};flex-shrink:0"></span>
            <span style="color:#fce7f3;font-size:.8rem;flex:1">${esc(other ? other.name : "unknown")}</span>
            <span style="color:rgba(244,114,182,.5);font-size:.73rem">${esc(rt ? rt.name : "")}</span>
            <button data-relid="${rel.id}" class="pw-del-rel" title="Remove" style="border:none;background:none;color:rgba(244,114,182,.3);cursor:pointer;font-size:1rem;padding:0;line-height:1">×</button>
          </div>`).join("")
      : `<div style="color:rgba(244,114,182,.28);font-size:.78rem;padding:.2rem 0">no connections yet</div>`;

    els.medium.innerHTML = `<style>
      #pw-prof { height:100%;display:grid;grid-template-rows:auto 1fr auto;gap:.5rem;padding:.75rem;
        border:1px solid rgba(244,114,182,.28);border-radius:14px;
        background:linear-gradient(160deg,#180f1e 0%,#1a1030 55%,#1c1440 100%); }
      .pwp-lbl { color:rgba(244,114,182,.5);font-size:.7rem;text-transform:uppercase;letter-spacing:.07em; }
      .pwp-btn { padding:.28rem .65rem;border-radius:8px;border:1px solid rgba(244,114,182,.4);
        background:rgba(244,114,182,.1);color:#fce7f3;cursor:pointer;font-size:.78rem; }
      .pwp-btn:hover { background:rgba(244,114,182,.22); }
      .pwp-btn.danger { border-color:rgba(239,68,68,.4);background:rgba(239,68,68,.1);color:#fca5a5; }
      .pwp-btn.danger:hover { background:rgba(239,68,68,.22); }
    </style>
    <section id="pw-prof">
      <div>
        <div style="display:flex;align-items:center;gap:.55rem;margin-bottom:.5rem">
          <div style="width:36px;height:36px;border-radius:50%;background:${esc(person.color||'#2d1a3a')};border:2px solid ${person.id===0?'rgba(192,38,211,.7)':'rgba(244,114,182,.35)'};flex-shrink:0;display:grid;place-items:center;color:#fce7f3;font-size:1rem">${person.id===0?'✦':''}</div>
          <div style="font:700 .97rem 'Palatino Linotype',serif;color:${person.id===0?'#e879f9':'#fce7f3'};flex:1">${esc(person.name||"Unnamed")}${person.id===0?' <span style="font-size:.7rem;opacity:.6;font-weight:400">(you)</span>':''}</div>
          <button class="pwp-btn" id="pwp-edit">edit</button>
          ${person.id===0?'':`<button class="pwp-btn danger" id="pwp-delete">×</button>`}
        </div>
        ${person.notes ? `<div style="color:#ddd6fe;font-size:.8rem;line-height:1.5;padding:.3rem .5rem;border-left:2px solid rgba(244,114,182,.3);margin-bottom:.45rem">${esc(person.notes)}</div>` : ""}
      </div>
      <div>
        <div class="pwp-lbl" style="margin-bottom:.35rem">connections</div>
        <div id="pwp-rels">${relHtml}</div>
      </div>
    </section>`;

    document.getElementById("pwp-edit").onclick = () => showEditPersonForm(person);
    const _delBtn = document.getElementById("pwp-delete");
    if (_delBtn) _delBtn.onclick = () => {
      if (!confirm(`Delete ${person.name}?`)) return;
      data.people = data.people.filter(p => p.id !== person.id);
      data.relationships = data.relationships.filter(r => r.from !== person.id && r.to !== person.id);
      delete data.positions[person.id];
      if (ws.selId === person.id) ws.selId = null;
      save(); autoLayout(); profileEmpty();
    };
    document.querySelectorAll(".pw-del-rel").forEach(btn => {
      btn.onclick = () => {
        data.relationships = data.relationships.filter(r => r.id !== Number(btn.dataset.relid));
        save(); autoLayout(); showProfile(person);
      };
    });
  }

  function showEditPersonForm(person) {
    function buildRelList() {
      const rels = data.relationships
        .filter(r => r.from === person.id || r.to === person.id)
        .map(r => ({
          rel: r,
          other: data.people.find(p => p.id === (r.from === person.id ? r.to : r.from)),
          rt: data.relTypes.find(t => t.id === r.typeId)
        }));
      if (!rels.length) return `<div style="color:rgba(244,114,182,.28);font-size:.78rem;padding:.2rem 0">no connections yet</div>`;
      return rels.map(({ other, rt, rel }) => `
        <div style="display:flex;align-items:center;gap:.4rem;padding:.26rem 0;border-bottom:1px solid rgba(244,114,182,.1)">
          <span style="width:9px;height:9px;border-radius:50%;background:${esc(rt ? rt.color : '#888')};flex-shrink:0"></span>
          <span style="color:#fce7f3;font-size:.8rem;flex:1">${esc(other ? other.name : 'unknown')}</span>
          <span style="color:rgba(244,114,182,.5);font-size:.73rem">${esc(rt ? rt.name : '')}</span>
          <button data-relid="${rel.id}" class="pwpe-del-rel" style="border:none;background:none;color:rgba(244,114,182,.3);cursor:pointer;font-size:1rem;padding:0;line-height:1" title="remove">×</button>
        </div>`).join('');
    }
    const peopleOpts = data.people
      .filter(p => p.id !== person.id)
      .map(p => `<option value="${p.id}" style="background:#1e0e2e">${esc(p.name || '?')}</option>`).join('');
    const rtOpts = data.relTypes
      .map(rt => `<option value="${rt.id}" style="background:#1e0e2e">${esc(rt.name)}</option>`).join('');

    els.medium.innerHTML = `<style>
      #pwpe { height:100%;display:grid;grid-template-rows:1fr auto;gap:.6rem;padding:.75rem;
        border:1px solid rgba(244,114,182,.28);border-radius:14px;background:linear-gradient(160deg,#180f1e,#1a1030); }
      .pwpef { display:grid;gap:.12rem;margin-bottom:.42rem; }
      .pwpef label { color:rgba(244,114,182,.5);font-size:.7rem;text-transform:uppercase;letter-spacing:.07em; }
      .pwpef input,.pwpef textarea { background:rgba(16,8,28,.7);border:1px solid rgba(244,114,182,.3);
        border-radius:7px;color:#fce7f3;padding:.32rem .5rem;font-size:.82rem;resize:vertical;width:100%; }
      .pwpef input[type=color] { padding:.1rem .2rem;height:28px;width:48px; }
      .pwpe-sel { background:rgba(16,8,28,.7);border:1px solid rgba(167,139,250,.3);
        border-radius:7px;color:#ede9fe;padding:.28rem .4rem;font-size:.76rem;flex:1;min-width:0; }
      .pwpe-add-btn { padding:.28rem .6rem;border-radius:7px;border:1px solid rgba(167,139,250,.4);
        background:rgba(167,139,250,.12);color:#ede9fe;cursor:pointer;font-size:.82rem;flex-shrink:0; }
      .pwpe-add-btn:hover { background:rgba(167,139,250,.26); }
      .pwpe-del-rel:hover { color:#f97316 !important; }
    </style>
    <section id="pwpe">
      <div style="overflow-y:auto;min-height:0;display:grid;align-content:start;gap:0">
        <div class="pwpef"><label>name</label><input id="pwpe-name" value="${esc(person.name||'')}" /></div>
        <div class="pwpef"><label>node color</label><input type="color" id="pwpe-color" value="${esc(person.color||'#2d1a3a')}" /></div>
        <div class="pwpef"><label>notes</label><textarea id="pwpe-notes" rows="4">${esc(person.notes||'')}</textarea></div>
        <div style="border-top:1px solid rgba(244,114,182,.15);padding-top:.55rem;margin-top:.1rem">
          <div style="color:rgba(244,114,182,.5);font-size:.7rem;text-transform:uppercase;letter-spacing:.07em;margin-bottom:.32rem">connections</div>
          <div id="pwpe-rels-list">${buildRelList()}</div>
          ${peopleOpts && rtOpts ? `
          <div style="margin-top:.48rem">
            <div style="color:rgba(167,139,250,.45);font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.28rem">add connection</div>
            <div style="display:flex;gap:.3rem;align-items:center">
              <select id="pwpe-conn-to" class="pwpe-sel"><option value="" style="background:#1e0e2e">— person —</option>${peopleOpts}</select>
              <select id="pwpe-conn-type" class="pwpe-sel"><option value="" style="background:#1e0e2e">— type —</option>${rtOpts}</select>
              <button id="pwpe-conn-add" class="pwpe-add-btn">+</button>
            </div>
          </div>` : `<div style="color:rgba(244,114,182,.2);font-size:.74rem;margin-top:.35rem">add people &amp; rel types first</div>`}
        </div>
      </div>
      <div style="display:flex;gap:.45rem">
        <button id="pwpe-cancel" style="flex:1;padding:.32rem;border-radius:8px;border:1px solid rgba(244,114,182,.28);background:transparent;color:#fce7f3;cursor:pointer;font-size:.8rem">cancel</button>
        <button id="pwpe-save" style="flex:1;padding:.32rem;border-radius:8px;border:1px solid rgba(244,114,182,.55);background:rgba(244,114,182,.2);color:#fce7f3;cursor:pointer;font-size:.8rem">save</button>
      </div>
    </section>`;

    function refreshRelList() {
      const el = document.getElementById("pwpe-rels-list");
      if (el) el.innerHTML = buildRelList();
      attachRelListeners();
    }
    function attachRelListeners() {
      document.querySelectorAll(".pwpe-del-rel").forEach(btn => {
        btn.onclick = () => {
          data.relationships = data.relationships.filter(r => r.id !== Number(btn.dataset.relid));
          save(); autoLayout(); refreshRelList();
        };
      });
    }
    attachRelListeners();

    const addBtn = document.getElementById("pwpe-conn-add");
    if (addBtn) addBtn.onclick = () => {
      const toValue = document.getElementById("pwpe-conn-to").value;
      const typeValue = document.getElementById("pwpe-conn-type").value;
      if (toValue === "" || typeValue === "") return;
      const toId = Number(toValue);
      const typeId = Number(typeValue);
      const exists = data.relationships.find(r =>
        (r.from === person.id && r.to === toId) ||
        (r.from === toId && r.to === person.id));
      if (!exists) {
        data.relationships.push({ id: nextId(data.relationships), from: person.id, to: toId, typeId });
        save(); autoLayout(); refreshRelList();
      }
      document.getElementById("pwpe-conn-to").value = "";
      document.getElementById("pwpe-conn-type").value = "";
    };

    document.getElementById("pwpe-cancel").onclick = () => showProfile(person);
    document.getElementById("pwpe-save").onclick = () => {
      person.name  = document.getElementById("pwpe-name").value.trim() || "Unnamed";
      person.color = document.getElementById("pwpe-color").value;
      person.notes = document.getElementById("pwpe-notes").value.trim();
      save(); autoLayout(); showProfile(person);
    };
  }

  // ── Overlay dialog helper ──
  function makeOverlay(innerHtml, accentColor) {
    const ac = accentColor || "244,114,182";
    const ov = document.createElement("div");
    ov.style.cssText = "position:absolute;inset:0;display:grid;place-items:center;background:rgba(18,6,30,.88);z-index:10;border-radius:12px";
    ov.innerHTML = `<div style="background:linear-gradient(160deg,#1e0e2e,#1a1040);border:1px solid rgba(${ac},.35);border-radius:14px;padding:1.2rem;width:min(310px,90%);display:grid;gap:.65rem">${innerHtml}</div>`;
    wrap.appendChild(ov);
    return ov;
  }

  function showAddPersonDialog() {
    const ov = makeOverlay(`
      <div style="font:700 .95rem 'Palatino Linotype',serif;color:#fce7f3">+ add person</div>
      <label style="display:grid;gap:.2rem;color:rgba(244,114,182,.5);font-size:.73rem;text-transform:uppercase;letter-spacing:.06em">name
        <input id="pov-name" autofocus style="background:rgba(16,8,28,.8);border:1px solid rgba(244,114,182,.28);border-radius:7px;color:#fce7f3;padding:.35rem .5rem;font-size:.85rem" />
      </label>
      <label style="display:grid;gap:.2rem;color:rgba(244,114,182,.5);font-size:.73rem;text-transform:uppercase;letter-spacing:.06em">node color
        <input type="color" id="pov-color" value="#2d1a3a" style="height:28px;width:48px;padding:.1rem .2rem;background:none;border:1px solid rgba(244,114,182,.28);border-radius:7px;cursor:pointer" />
      </label>
      <label style="display:grid;gap:.2rem;color:rgba(244,114,182,.5);font-size:.73rem;text-transform:uppercase;letter-spacing:.06em">notes
        <textarea id="pov-notes" rows="3" style="background:rgba(16,8,28,.8);border:1px solid rgba(244,114,182,.28);border-radius:7px;color:#fce7f3;padding:.35rem .5rem;font-size:.82rem;resize:vertical"></textarea>
      </label>
      <div style="display:flex;gap:.5rem">
        <button id="pov-cancel" style="flex:1;padding:.35rem;border-radius:8px;border:1px solid rgba(244,114,182,.25);background:transparent;color:#fce7f3;cursor:pointer;font-size:.8rem">cancel</button>
        <button id="pov-add" style="flex:1;padding:.35rem;border-radius:8px;border:1px solid rgba(244,114,182,.55);background:rgba(244,114,182,.2);color:#fce7f3;cursor:pointer;font-size:.8rem">add</button>
      </div>`);
    setTimeout(() => { const n = document.getElementById("pov-name"); if (n) n.focus(); }, 0);
    document.getElementById("pov-cancel").onclick = () => wrap.removeChild(ov);
    document.getElementById("pov-add").onclick = () => {
      const name  = document.getElementById("pov-name").value.trim() || "Unnamed";
      const color = document.getElementById("pov-color").value;
      const notes = document.getElementById("pov-notes").value.trim();
      const id = nextId(data.people);
      data.people.push({ id, name, color, notes });
      const cx = canvas.width  / 2 + (Math.random() - .5) * (canvas.width  * .38);
      const cy = canvas.height / 2 + (Math.random() - .5) * (canvas.height * .38);
      data.positions[id] = { x: cx, y: cy };
      save(); autoLayout(); wrap.removeChild(ov);
    };
  }

  function showConnectDialog(fromPerson, toPerson) {
    if (!data.relTypes.length) { alert("Add a relationship type first."); return; }
    const opts = data.relTypes.map(rt => `<option value="${rt.id}" style="background:#1e0e2e">${esc(rt.name)}</option>`).join("");
    const ov = makeOverlay(`
      <div style="font:700 .95rem 'Palatino Linotype',serif;color:#ede9fe">connect</div>
      <div style="color:#ddd6fe;font-size:.82rem">${esc(fromPerson.name||"?")} ↔ ${esc(toPerson.name||"?")}</div>
      <label style="display:grid;gap:.2rem;color:rgba(167,139,250,.5);font-size:.73rem;text-transform:uppercase;letter-spacing:.06em">relationship type
        <select id="cov-rt" style="background:rgba(16,8,28,.8);border:1px solid rgba(167,139,250,.28);border-radius:7px;color:#ede9fe;padding:.35rem .5rem;font-size:.85rem">${opts}</select>
      </label>
      <div style="display:flex;gap:.5rem">
        <button id="cov-cancel" style="flex:1;padding:.35rem;border-radius:8px;border:1px solid rgba(167,139,250,.25);background:transparent;color:#ede9fe;cursor:pointer;font-size:.8rem">cancel</button>
        <button id="cov-ok" style="flex:1;padding:.35rem;border-radius:8px;border:1px solid rgba(167,139,250,.55);background:rgba(167,139,250,.2);color:#ede9fe;cursor:pointer;font-size:.8rem">connect</button>
      </div>`, "167,139,250");
    document.getElementById("cov-cancel").onclick = () => wrap.removeChild(ov);
    document.getElementById("cov-ok").onclick = () => {
      const typeId = Number(document.getElementById("cov-rt").value);
      const exists = data.relationships.find(r =>
        (r.from === fromPerson.id && r.to === toPerson.id) ||
        (r.from === toPerson.id  && r.to === fromPerson.id));
      if (!exists) {
        data.relationships.push({ id: nextId(data.relationships), from: fromPerson.id, to: toPerson.id, typeId });
        save();
      }
      draw(); wrap.removeChild(ov);
    };
  }

  function showAddRelTypeDialog() {
    const ov = makeOverlay(`
      <div style="font:700 .95rem 'Palatino Linotype',serif;color:#ede9fe">+ relationship type</div>
      <label style="display:grid;gap:.2rem;color:rgba(167,139,250,.5);font-size:.73rem;text-transform:uppercase;letter-spacing:.06em">name
        <input id="rtov-name" autofocus style="background:rgba(16,8,28,.8);border:1px solid rgba(167,139,250,.28);border-radius:7px;color:#ede9fe;padding:.35rem .5rem;font-size:.85rem" />
      </label>
      <label style="display:grid;gap:.2rem;color:rgba(167,139,250,.5);font-size:.73rem;text-transform:uppercase;letter-spacing:.06em">color
        <input type="color" id="rtov-color" value="#a78bfa" style="height:28px;width:48px;padding:.1rem .2rem;background:none;border:1px solid rgba(167,139,250,.28);border-radius:7px;cursor:pointer" />
      </label>
      <label style="display:grid;gap:.2rem;color:rgba(167,139,250,.5);font-size:.73rem;text-transform:uppercase;letter-spacing:.06em">description (optional)
        <input id="rtov-desc" style="background:rgba(16,8,28,.8);border:1px solid rgba(167,139,250,.28);border-radius:7px;color:#ede9fe;padding:.35rem .5rem;font-size:.85rem" />
      </label>
      <div style="display:flex;gap:.5rem">
        <button id="rtov-cancel" style="flex:1;padding:.35rem;border-radius:8px;border:1px solid rgba(167,139,250,.25);background:transparent;color:#ede9fe;cursor:pointer;font-size:.8rem">cancel</button>
        <button id="rtov-add" style="flex:1;padding:.35rem;border-radius:8px;border:1px solid rgba(167,139,250,.55);background:rgba(167,139,250,.2);color:#ede9fe;cursor:pointer;font-size:.8rem">add</button>
      </div>`, "167,139,250");
    setTimeout(() => { const n = document.getElementById("rtov-name"); if (n) n.focus(); }, 0);
    document.getElementById("rtov-cancel").onclick = () => wrap.removeChild(ov);
    document.getElementById("rtov-add").onclick = () => {
      const name = document.getElementById("rtov-name").value.trim();
      if (!name) return;
      const color = document.getElementById("rtov-color").value;
      const desc  = document.getElementById("rtov-desc").value.trim();
      data.relTypes.push({ id: nextId(data.relTypes), name, color, description: desc });
      save(); renderRelTypeDir(); wrap.removeChild(ov);
    };
  }

  // ── Rel-type directory (small panel) ──
  function renderRelTypeDir() {
    const shell = document.getElementById("pw-reltype-shell");
    if (!shell) return;
    const items = data.relTypes.map(rt => `
      <div style="display:flex;align-items:center;gap:.4rem;padding:.3rem .45rem;border-radius:8px;border:1px solid rgba(167,139,250,.18);background:rgba(167,139,250,.07)">
        <span style="width:11px;height:11px;border-radius:50%;background:${esc(rt.color)};flex-shrink:0"></span>
        <span style="flex:1;color:#ede9fe;font-size:.8rem">${esc(rt.name)}</span>
        ${rt.description ? `<span style="color:rgba(167,139,250,.42);font-size:.72rem;margin-right:.2rem">${esc(rt.description)}</span>` : ""}
        <button data-id="${rt.id}" class="pwrt-del" style="border:none;background:none;color:rgba(167,139,250,.32);cursor:pointer;font-size:1rem;padding:0;line-height:1" title="delete">×</button>
      </div>`).join("") || `<div style="color:rgba(167,139,250,.28);font-size:.78rem;padding:.4rem">no types defined</div>`;

    shell.innerHTML = `<style>
      #pw-reltype-shell { height:100%;display:grid;grid-template-rows:auto 1fr;gap:.5rem;padding:.65rem;
        border:1px solid rgba(167,139,250,.25);border-radius:14px;
        background:linear-gradient(160deg,#160e26 0%,#1a1230 100%); }
      .pwrt-head { display:flex;align-items:center;gap:.4rem; }
      .pwrt-head span { color:#ddd6fe;font:700 .82rem "Palatino Linotype",serif;flex:1; }
      .pwrt-add { padding:.2rem .55rem;border-radius:7px;border:1px solid rgba(167,139,250,.35);
        background:rgba(167,139,250,.1);color:#ede9fe;cursor:pointer;font-size:.75rem; }
      .pwrt-add:hover { background:rgba(167,139,250,.22); }
      .pwrt-list { overflow-y:auto;display:grid;align-content:start;gap:.28rem; }
      .pwrt-del:hover { color:#f97316 !important; }
    </style>
    <div class="pwrt-head"><span>// rel types</span><button class="pwrt-add" id="pwrt-add-btn">+ add</button></div>
    <div class="pwrt-list">${items}</div>`;

    document.getElementById("pwrt-add-btn").onclick = () => showAddRelTypeDialog();
    shell.querySelectorAll(".pwrt-del").forEach(btn => {
      btn.onclick = () => {
        const id = Number(btn.dataset.id);
        if (data.relationships.some(r => r.typeId === id)) {
          if (!confirm("This type is used by existing connections. Delete anyway?")) return;
          data.relationships = data.relationships.filter(r => r.typeId !== id);
        }
        data.relTypes = data.relTypes.filter(rt => rt.id !== id);
        save(); draw(); renderRelTypeDir();
      };
    });
  }

  renderRelTypeDir();
}

function renderFamily() {
  const SK = "cyberdeckFamilyTree";
  let raw; try { raw = JSON.parse(safeGetStorage(SK) || "null"); } catch(e) { raw = null; }
  let ft = (raw && Array.isArray(raw.people)) ? raw : { people: [], bonds: [], positions: {} };
  if (!Array.isArray(ft.bonds)) ft.bonds = [];
  if (!ft.positions || typeof ft.positions !== "object") ft.positions = {};

  function ftNormalizeBondType(value) {
    const rawType = String(value || "").trim().toLowerCase();
    if (!rawType || rawType === "biological") return "biological";
    if (rawType === "adopted" || rawType === "adoptive") return "adoptive";
    if (rawType === "found") return "found";
    if (rawType === "chosen") return "chosen";
    if (rawType === "step") return "step";
    if (rawType === "pet") return "pet";
    if (rawType === "in-law" || rawType === "in law" || rawType === "inlaw") return "in-law";
    if (rawType === "step in-law" || rawType === "step-in-law" || rawType === "step in law") return "step in-law";
    return "biological";
  }

  // Ensure the self node (id 0) always exists
  if (!ft.people.find(p => p.id === 0)) {
    ft.people.unshift({ id: 0, name: "self", color: "#34d399", pronouns: "", gender: "", dob: "", dod: "", species: "", notes: "", isSelf: true });
  }
  ft.people[ft.people.findIndex(p => p.id === 0)].isSelf = true;
  ft.bonds.forEach(b => {
    if (b && b.type === "parent") b.bondType = ftNormalizeBondType(b.bondType);
  });

  function ftSave() { safeSetStorage(SK, JSON.stringify(ft)); }
  function ftNextId(arr) { return arr.length ? Math.max(0, ...arr.map(x => +(x.id) || 0)) + 1 : 1; }
  function ftEsc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  const BOND_TYPES    = ["biological","found","adoptive","chosen","step","in-law","step in-law","pet"];
  const PARTNER_TYPES = ["married","partnered","divorced","separated","other"];
  const NW = 134, NH = 62, NR = 8;

  function ftBondColor(type) {
    const bondType = ftNormalizeBondType(type);
    return bondType === "adoptive" ? "rgba(147,197,253,.75)"
      : bondType === "found" ? "rgba(244,114,182,.72)"
      : bondType === "chosen" ? "rgba(167,139,250,.7)"
      : bondType === "step" ? "rgba(252,211,77,.65)"
      : bondType === "in-law" ? "rgba(251,191,36,.72)"
      : bondType === "step in-law" ? "rgba(248,113,113,.68)"
      : bondType === "pet" ? "rgba(56,189,248,.78)"
      : "rgba(134,239,172,.65)";
  }

  function ftBondStroke(type) {
    const bondType = ftNormalizeBondType(type);
    return bondType === "biological" ? { dash: [], width: 2.2, cap: "round", legend: "solid" }
      : bondType === "found" ? { dash: [12, 6], width: 2.1, cap: "round", legend: "dashed" }
      : bondType === "adoptive" ? { dash: [2, 5], width: 2.6, cap: "round", legend: "dotted" }
      : bondType === "chosen" ? { dash: [14, 4, 3, 4], width: 2.1, cap: "round", legend: "long-short" }
      : bondType === "step" ? { dash: [8, 4, 2, 4], width: 2, cap: "round", legend: "dash-dot" }
      : bondType === "in-law" ? { dash: [5, 5], width: 1.9, cap: "square", legend: "fine dash" }
      : bondType === "step in-law" ? { dash: [10, 4, 2, 4, 2, 4], width: 2, cap: "round", legend: "dash-dot-dot" }
      : bondType === "pet" ? { dash: [1, 4], width: 3, cap: "round", legend: "beaded" }
      : { dash: [], width: 2.2, cap: "round", legend: "solid" };
  }

  function ftLegendLine(type) {
    const bondType = ftNormalizeBondType(type);
    const color = ftBondColor(bondType).replace(/\.\d+\)/, ")");
    const style = ftBondStroke(bondType);
    const dash = style.legend === "solid" ? `linear-gradient(90deg, ${color}, ${color})`
      : style.legend === "dashed" ? `repeating-linear-gradient(90deg, ${color} 0 12px, transparent 12px 18px)`
      : style.legend === "dotted" ? `repeating-linear-gradient(90deg, ${color} 0 2px, transparent 2px 8px)`
      : style.legend === "long-short" ? `repeating-linear-gradient(90deg, ${color} 0 14px, transparent 14px 18px, ${color} 18px 21px, transparent 21px 27px)`
      : style.legend === "dash-dot" ? `repeating-linear-gradient(90deg, ${color} 0 8px, transparent 8px 12px, ${color} 12px 14px, transparent 14px 18px)`
      : style.legend === "fine dash" ? `repeating-linear-gradient(90deg, ${color} 0 5px, transparent 5px 10px)`
      : style.legend === "dash-dot-dot" ? `repeating-linear-gradient(90deg, ${color} 0 10px, transparent 10px 14px, ${color} 14px 16px, transparent 16px 20px, ${color} 20px 22px, transparent 22px 26px)`
      : `repeating-linear-gradient(90deg, ${color} 0 2px, transparent 2px 7px)`;
    return `<span style="display:inline-flex;align-items:center;gap:.28rem;flex-shrink:0"><span style="width:28px;height:${Math.max(3, Math.round(style.width))}px;border-radius:999px;display:inline-block;background:${dash};flex-shrink:0"></span>${bondType === "pet" ? `<span style="color:${color};font-size:.82rem;line-height:1">🐾</span>` : ""}</span>`;
  }

  // ── HTML ──────────────────────────────────────────────────────────────────
  const large = `<style>
    #screen-large, #screen-large > #large-content { height:100%; min-height:0; display:flex; flex-direction:column; overflow:hidden; }
    #ft-shell { display:grid; grid-template-rows:auto 1fr; gap:.55rem; padding:.75rem; flex:1; min-height:0;
      border:1px solid rgba(134,239,172,.28); border-radius:16px;
      background:
        radial-gradient(120% 130% at 8% -12%, rgba(134,239,172,.1), transparent 45%),
        radial-gradient(110% 120% at 95% 100%, rgba(52,211,153,.08), transparent 44%),
        linear-gradient(160deg, #0d1a10 0%, #0f1c14 55%, #111f16 100%);
      box-shadow:0 18px 34px rgba(4,6,14,.42); }
    #ft-toolbar { display:flex; gap:.45rem; flex-wrap:wrap; align-items:center; }
    #ft-toolbar button { padding:.26rem .68rem; border-radius:8px; border:1px solid rgba(134,239,172,.38);
      background:rgba(134,239,172,.1); color:#d1fae5; font-size:.79rem; cursor:pointer; transition:background .15s; }
    #ft-toolbar button:hover { background:rgba(134,239,172,.22); }
    #ft-mode-label { color:#a7f3d0; font-size:.76rem; margin-left:auto; font-family:"Palatino Linotype",serif; font-style:italic; }
    #ft-canvas-wrap { position:relative; flex:1; min-height:0; border:1px solid rgba(134,239,172,.16); border-radius:12px;
      overflow:hidden; background:rgba(6,14,8,.7); }
    #ft-canvas { display:block; width:100%; height:100%; cursor:grab; }
    #ft-canvas.ft-panning { cursor:grabbing; }
    #ft-empty { position:absolute; inset:0; display:grid; place-items:center;
      color:rgba(134,239,172,.28); font-size:.86rem; font-family:"Palatino Linotype",serif;
      pointer-events:none; text-align:center; line-height:2.2; }
    #ft-panel { display:flex; flex-direction:column; gap:.52rem; padding:.7rem;
      border:1px solid rgba(134,239,172,.2); border-radius:14px;
      background:linear-gradient(165deg,#0d1a10,#0f1c14); height:100%; min-height:0;
      overflow-y:auto; font-size:.84rem; box-sizing:border-box; }
    #ft-panel h3 { margin:0 0 .3rem; color:#a7f3d0; font-family:"Palatino Linotype",serif; font-size:.96rem; }
    #ft-panel label { display:grid; gap:.17rem; color:#6ee7b7; font-size:.78rem; }
    #ft-panel input, #ft-panel select, #ft-panel textarea {
      background:#071209; border:1px solid rgba(134,239,172,.28); color:#d1fae5;
      border-radius:6px; padding:.36rem .48rem; font-size:.82rem; }
    #ft-panel input:focus, #ft-panel select:focus, #ft-panel textarea:focus { outline:none; border-color:#86efac; }
    #ft-panel .ft-row { display:grid; grid-template-columns:1fr 1fr; gap:.42rem; }
    #ft-panel .ft-actions { display:flex; gap:.38rem; flex-wrap:wrap; margin-top:.35rem; }
    #ft-panel .ft-actions button { flex:1; min-width:60px; padding:.33rem .45rem; border-radius:8px;
      border:1px solid rgba(134,239,172,.35); background:rgba(134,239,172,.1);
      color:#d1fae5; font-size:.79rem; cursor:pointer; }
    #ft-panel .ft-actions button:hover { background:rgba(134,239,172,.22); }
    #ft-panel .ft-actions .ft-danger { border-color:rgba(248,81,73,.45); background:rgba(248,81,73,.1); color:#fca5a5; }
    #ft-panel .ft-actions .ft-danger:hover { background:rgba(248,81,73,.22); }
    #ft-panel .ft-bond-row { display:flex; justify-content:space-between; align-items:center;
      padding:.26rem .42rem; border:1px solid rgba(134,239,172,.14); border-radius:6px;
      background:rgba(6,14,8,.55); font-size:.77rem; color:#a7f3d0; }
    #ft-panel .ft-bond-row button { background:none; border:none; color:#f87171; cursor:pointer; font-size:.82rem; padding:0 .18rem; }
    #ft-panel .ft-divider { border:none; border-top:1px solid rgba(134,239,172,.14); margin:.35rem 0; }
    #ft-panel .ft-chip { display:inline-block; background:rgba(134,239,172,.1); color:#a7f3d0;
      border:1px solid rgba(134,239,172,.22); border-radius:999px; padding:.1rem .48rem;
      font-size:.72rem; margin:.08rem .12rem 0 0; }
    #ft-panel .ft-sub { font-size:.72rem; color:rgba(110,231,183,.55); }
  </style>
  <section id="ft-shell">
    <div id="ft-toolbar">
      <button id="ft-add-person">+ person</button>
      <button id="ft-arrange">⟳ auto-arrange</button>
      <button id="ft-zoom-in">+</button>
      <button id="ft-zoom-out">−</button>
      <button id="ft-reset-view">⌂</button>
      <span id="ft-mode-label">// family tree</span>
    </div>
    <div id="ft-canvas-wrap">
      <canvas id="ft-canvas"></canvas>
      <div id="ft-empty">add people to begin the family tree<br><span style="font-size:.72rem;opacity:.5">use + person in the toolbar above</span></div>
    </div>
  </section>`;

  const medium = `<div id="ft-panel">
    <h3>Family Tree</h3>
    <p style="margin:0;color:#6ee7b7;font-size:.78rem">Click a person on the tree to view or edit them,<br>or use <strong style="color:#a7f3d0">+ person</strong> to add someone new.</p>
  </div>`;

  const small = `<div style="display:flex;flex-direction:column;gap:.45rem;padding:.62rem;
    border:1px solid rgba(134,239,172,.18);border-radius:14px;
    background:linear-gradient(165deg,#0d1a10,#0f1c14);height:100%;min-height:0;overflow:hidden;box-sizing:border-box">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-shrink:0">
      <span style="color:#a7f3d0;font-family:'Palatino Linotype',serif;font-size:.86rem;font-style:italic">Members</span>
      <span id="ft-count" style="color:#6ee7b7;font-size:.72rem"></span>
    </div>
    <div id="ft-people-list" style="overflow-y:auto;display:grid;gap:.26rem;align-content:start;flex:1;min-height:0"></div>
    <div style="display:grid;gap:.24rem;flex-shrink:0;border-top:1px solid rgba(134,239,172,.14);padding-top:.45rem">
      <div style="color:#a7f3d0;font-family:'Palatino Linotype',serif;font-size:.8rem;font-style:italic">Relationship Types</div>
      <div id="ft-legend" style="display:grid;gap:.18rem"></div>
    </div>
  </div>`;

  setContent({ title: "family" }, large, medium, small);

  // ── Canvas setup ──────────────────────────────────────────────────────────
  const canvas  = document.getElementById("ft-canvas");
  if (!canvas) return;
  const ctx     = canvas.getContext("2d");
  const wrap    = document.getElementById("ft-canvas-wrap");
  const emptyEl = document.getElementById("ft-empty");
  const panel   = document.getElementById("ft-panel");
  if (!ctx || !wrap || !emptyEl || !panel) return;

  let camX = 0, camY = 0, ftScale = 1;
  let selId = null;
  let ws = { drag: null, dragOX: 0, dragOY: 0, moved: false, panStart: null, panCam: null };

  function ftResize() {
    const r = wrap.getBoundingClientRect();
    canvas.width  = r.width;
    canvas.height = r.height;
    ftDraw();
  }

  function ftToWorld(cx, cy) {
    const w = canvas.width, h = canvas.height;
    return {
      x: (cx - w / 2) / ftScale + w / 2 - camX,
      y: (cy - h / 2) / ftScale + h / 2 - camY
    };
  }

  function ftEnsurePos(id) {
    if (!ft.positions[id]) {
      const w = canvas.width || 600, h = canvas.height || 400;
      const n = ft.people.findIndex(p => p.id === id);
      const total = ft.people.length;
      const angle = total > 1 ? (n / total) * Math.PI * 2 - Math.PI / 2 : 0;
      const r = Math.min(w, h) * 0.28;
      ft.positions[id] = {
        x: w / 2 + (total > 1 ? Math.cos(angle) * r : 0) - NW / 2,
        y: h / 2 + (total > 1 ? Math.sin(angle) * r : 0) - NH / 2
      };
    }
    return ft.positions[id];
  }

  function ftNodeAt(wx, wy) {
    return ft.people.slice().reverse().find(p => {
      const pos = ftEnsurePos(p.id);
      return wx >= pos.x && wx <= pos.x + NW && wy >= pos.y && wy <= pos.y + NH;
    }) || null;
  }

  function ftRoundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function ftDraw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!ft.people.length) { emptyEl.style.display = "grid"; return; }
    emptyEl.style.display = "none";

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(ftScale, ftScale);
    ctx.translate(-w / 2 + camX, -h / 2 + camY);

    // ── Bonds ──
    ft.bonds.forEach(bond => {
      const pa = ft.people.find(p => p.id === bond.fromId);
      const pb = ft.people.find(p => p.id === bond.toId);
      if (!pa || !pb) return;
      const posA = ftEnsurePos(pa.id), posB = ftEnsurePos(pb.id);

      ctx.save();
      if (bond.type === "partner") {
        const ax = posA.x + NW / 2, ay = posA.y + NH / 2;
        const bx = posB.x + NW / 2, by = posB.y + NH / 2;
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = bond.relType === "divorced"   ? "rgba(248,114,114,.65)"
          : bond.relType === "separated" ? "rgba(251,191,36,.55)"
          : "rgba(134,239,172,.5)";
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
        ctx.setLineDash([]);
        const mx = (ax + bx) / 2, my = (ay + by) / 2;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(167,243,208,.9)";
        ctx.fillText(
          bond.relType === "married" ? "💍"
            : bond.relType === "divorced" ? "✂️"
            : bond.relType === "separated" ? "…"
            : "♡",
          mx, my - 7
        );
      } else {
        // parent → child: bezier from parent bottom to child top
        const fx = posA.x + NW / 2, fy = posA.y + NH;
        const tx = posB.x + NW / 2, ty = posB.y;
        const stroke = ftBondStroke(bond.bondType);
        ctx.setLineDash(stroke.dash);
        ctx.lineCap = stroke.cap;
        ctx.strokeStyle = ftBondColor(bond.bondType);
        ctx.lineWidth = stroke.width;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.bezierCurveTo(fx, fy + 36, tx, ty - 36, tx, ty);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineCap = "butt";
        // arrowhead
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx - 5, ty - 9);
        ctx.lineTo(tx + 5, ty - 9);
        ctx.closePath();
        ctx.fill();
        // bond type label if non-biological
        if (bond.bondType && ftNormalizeBondType(bond.bondType) !== "biological") {
          const lx = (fx + tx) / 2 + 6, ly = (fy + ty) / 2;
          ctx.fillStyle = ftBondColor(bond.bondType);
          ctx.font = "9px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(ftNormalizeBondType(bond.bondType), lx, ly);
        }
        if (ftNormalizeBondType(bond.bondType) === "pet") {
          const px = (fx + tx) / 2 - 10;
          const py = (fy + ty) / 2 - 10;
          ctx.fillStyle = ftBondColor(bond.bondType);
          ctx.font = "12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("🐾", px, py);
        }
      }
      ctx.restore();
    });

    // ── Nodes ──
    ft.people.forEach(person => {
      const pos = ftEnsurePos(person.id);
      const x = pos.x, y = pos.y;
      const isSel = person.id === selId;
      const col = person.color || "#34d399";
      const isSelf = person.isSelf;

      ctx.save();
      ctx.shadowColor = isSel ? col : "rgba(0,0,0,.55)";
      ctx.shadowBlur  = isSel ? 18 : 7;

      // outer ring for self node
      if (isSelf) {
        ftRoundRect(x - 4, y - 4, NW + 8, NH + 8, NR + 4);
        ctx.strokeStyle = "rgba(52,211,153,.38)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // body
      ftRoundRect(x, y, NW, NH, NR);
      ctx.fillStyle = isSel ? "rgba(14,30,16,.97)" : (isSelf ? "rgba(10,24,13,.97)" : "rgba(8,16,9,.94)");
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = isSel ? col : (isSelf ? "rgba(52,211,153,.55)" : "rgba(134,239,172,.2)");
      ctx.lineWidth   = isSel ? 2 : (isSelf ? 1.5 : 1);
      ctx.stroke();

      // color header bar
      ctx.save();
      ftRoundRect(x, y, NW, 11, NR);
      ctx.clip();
      ctx.fillStyle = col;
      ctx.fillRect(x, y, NW, 11);
      ctx.restore();

      // name
      ctx.fillStyle = isSel ? "#ecfdf5" : "#a7f3d0";
      ctx.font = "bold 11.5px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      let nameStr = String(person.name || "?");
      if (ctx.measureText(nameStr).width > NW - 14) {
        while (nameStr.length > 2 && ctx.measureText(nameStr + "…").width > NW - 14)
          nameStr = nameStr.slice(0, -1);
        nameStr += "…";
      }
      ctx.fillText(nameStr, x + NW / 2, y + 15);

      // pronouns + birth year
      ctx.fillStyle = "rgba(167,243,208,.5)";
      ctx.font = "9px Inter, sans-serif";
      const sub = [person.pronouns, person.dob && person.dob.slice(0, 4)].filter(Boolean).join(" · ");
      if (sub) ctx.fillText(sub, x + NW / 2, y + 32);

      // deceased
      if (person.dod) {
        ctx.fillStyle = "rgba(167,243,208,.3)";
        ctx.fillText("† " + (person.dod.slice(0, 4) || ""), x + NW / 2, y + 46);
      }

      ctx.restore();
    });

    ctx.restore();
  }

  // ── Canvas interaction ────────────────────────────────────────────────────
  function ftCoords(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { cx: t.clientX - r.left, cy: t.clientY - r.top };
  }

  canvas.addEventListener("mousedown", e => {
    const { cx, cy } = ftCoords(e);
    const { x: wx, y: wy } = ftToWorld(cx, cy);
    const hit = ftNodeAt(wx, wy);
    if (hit) {
      const pos = ftEnsurePos(hit.id);
      ws.drag = hit.id; ws.dragOX = wx - pos.x; ws.dragOY = wy - pos.y; ws.moved = false;
    } else {
      ws.panStart = { cx, cy }; ws.panCam = { x: camX, y: camY };
      canvas.classList.add("ft-panning");
    }
  });

  canvas.addEventListener("mousemove", e => {
    const { cx, cy } = ftCoords(e);
    const { x: wx, y: wy } = ftToWorld(cx, cy);
    if (ws.drag != null) {
      ws.moved = true;
      const pos = ftEnsurePos(ws.drag);
      pos.x = wx - ws.dragOX; pos.y = wy - ws.dragOY;
      ftDraw();
    } else if (ws.panStart) {
      camX = ws.panCam.x + (cx - ws.panStart.cx);
      camY = ws.panCam.y + (cy - ws.panStart.cy);
      ftDraw();
    }
  });

  canvas.addEventListener("mouseup", () => {
    if (ws.drag != null) {
      if (!ws.moved) {
        selId = selId === ws.drag ? null : ws.drag;
        ftRenderPanel(); ftRenderList(); ftDraw();
      } else { ftSave(); }
    }
    canvas.classList.remove("ft-panning");
    ws.drag = null; ws.panStart = null;
  });

  canvas.addEventListener("mouseleave", () => {
    if (ws.drag != null) ftSave();
    ws.drag = null; ws.panStart = null;
    canvas.classList.remove("ft-panning");
  });

  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    const f = e.deltaY < 0 ? 1.12 : 0.89;
    ftScale = Math.min(4, Math.max(0.18, ftScale * f));
    ftDraw();
  }, { passive: false });

  document.getElementById("ft-zoom-in").onclick  = () => { ftScale = Math.min(4, ftScale * 1.2); ftDraw(); };
  document.getElementById("ft-zoom-out").onclick = () => { ftScale = Math.max(0.18, ftScale * 0.82); ftDraw(); };
  document.getElementById("ft-reset-view").onclick = () => { camX = 0; camY = 0; ftScale = 1; ftDraw(); };
  document.getElementById("ft-add-person").onclick = () => { selId = null; ftRenderPanel(); ftRenderList(); ftDraw(); };

  // ── Auto-arrange ──────────────────────────────────────────────────────────
  document.getElementById("ft-arrange").onclick = () => {
    if (!ft.people.length) return;

    const childrenOf = new Map(), parentsOf = new Map();
    ft.people.forEach(p => { childrenOf.set(p.id, []); parentsOf.set(p.id, []); });
    ft.bonds.forEach(b => {
      if (b.type === "parent") {
        childrenOf.get(b.fromId)?.push(b.toId);
        parentsOf.get(b.toId)?.push(b.fromId);
      }
    });

    const partnerOf = new Map();
    ft.bonds.forEach(b => {
      if (b.type === "partner") {
        partnerOf.set(b.fromId, b.toId);
        partnerOf.set(b.toId, b.fromId);
      }
    });

    const gen = new Map();
    const roots = ft.people.filter(p => !parentsOf.get(p.id)?.length);
    const queue = (roots.length ? roots : [ft.people[0]]).map(p => ({ id: p.id, g: 0 }));
    while (queue.length) {
      const { id, g } = queue.shift();
      if (gen.has(id)) continue;
      gen.set(id, g);
      const partner = partnerOf.get(id);
      if (partner != null && !gen.has(partner)) { gen.set(partner, g); queue.push({ id: partner, g }); }
      childrenOf.get(id)?.forEach(cid => { if (!gen.has(cid)) queue.push({ id: cid, g: g + 1 }); });
    }
    ft.people.forEach(p => { if (!gen.has(p.id)) gen.set(p.id, 0); });

    const byGen = new Map();
    gen.forEach((g, id) => { if (!byGen.has(g)) byGen.set(g, []); byGen.get(g).push(id); });

    const XGAP = NW + 48, YGAP = NH + 100;
    const genNums = [...byGen.keys()].sort((a, b) => a - b);
    const cx0 = (canvas.width || 600) / 2;
    const startY = (canvas.height || 400) / 2 - ((genNums.length - 1) * YGAP) / 2;

    genNums.forEach((g, gi) => {
      const ids = byGen.get(g);
      // keep partners adjacent
      const seen = new Set(), ordered = [];
      ids.forEach(id => {
        if (seen.has(id)) return;
        seen.add(id); ordered.push(id);
        const pt = partnerOf.get(id);
        if (pt != null && ids.includes(pt) && !seen.has(pt)) { seen.add(pt); ordered.push(pt); }
      });
      const startX = cx0 - (ordered.length * XGAP) / 2 + XGAP / 2 - NW / 2;
      ordered.forEach((id, i) => {
        ft.positions[id] = { x: startX + i * XGAP, y: startY + gi * YGAP };
      });
    });

    ftSave(); ftDraw();
  };

  // ── Panel (medium) ────────────────────────────────────────────────────────
  function ftRenderPanel() {
    const person = selId != null ? ft.people.find(p => p.id === selId) : null;
    if (!person) ftShowAddForm(); else ftShowPersonView(person);
  }

  function ftReadForm() {
    return {
      name:     (document.getElementById("ft-f-name")     || {}).value?.trim() || "",
      pronouns: (document.getElementById("ft-f-pronouns") || {}).value?.trim() || "",
      gender:   (document.getElementById("ft-f-gender")   || {}).value?.trim() || "",
      dob:      (document.getElementById("ft-f-dob")      || {}).value?.trim() || "",
      dod:      (document.getElementById("ft-f-dod")      || {}).value?.trim() || "",
      species:  (document.getElementById("ft-f-species")  || {}).value?.trim() || "",
      notes:    (document.getElementById("ft-f-notes")    || {}).value?.trim() || "",
      color:    (document.getElementById("ft-f-color")    || {}).value || "#34d399"
    };
  }

  function ftShowAddForm(prefill) {
    const p = prefill || {};
    const isEdit = p.id != null;
    const isSelfNode = p.isSelf === true;
    panel.innerHTML = `
      <h3>${isSelfNode ? "Edit Self" : isEdit ? "Edit Person" : "Add Person"}</h3>
      ${isSelfNode ? `<p style="margin:0 0 .4rem;font-size:.75rem;color:rgba(110,231,183,.5)">This is you — this node cannot be deleted.</p>` : ""}
      <label>Name
        <input id="ft-f-name" value="${ftEsc(p.name || "")}" placeholder="Full name" />
      </label>
      <div class="ft-row">
        <label>Pronouns <input id="ft-f-pronouns" value="${ftEsc(p.pronouns || "")}" placeholder="they/them" /></label>
        <label>Gender <input id="ft-f-gender" value="${ftEsc(p.gender || "")}" placeholder="optional" /></label>
      </div>
      <div class="ft-row">
        <label>Date of birth <input id="ft-f-dob" value="${ftEsc(p.dob || "")}" placeholder="YYYY-MM-DD" /></label>
        <label>Date of death <input id="ft-f-dod" value="${ftEsc(p.dod || "")}" placeholder="YYYY-MM-DD" /></label>
      </div>
      <label>Species / type <input id="ft-f-species" value="${ftEsc(p.species || "")}" placeholder="human, vampire, fae…" /></label>
      <label>Notes <textarea id="ft-f-notes" style="min-height:7vh;resize:vertical">${ftEsc(p.notes || "")}</textarea></label>
      <label>Colour <input id="ft-f-color" type="color" value="${ftEsc(p.color || "#34d399")}" style="height:36px;padding:.14rem;border-radius:6px" /></label>
      <div class="ft-actions">
        <button id="ft-f-save">${isEdit ? "Save" : "Add"}</button>
        <button id="ft-f-cancel">Cancel</button>
        ${isEdit && !isSelfNode ? '<button id="ft-f-delete" class="ft-danger">Delete</button>' : ""}
      </div>`;

    const saveBtn = panel.querySelector("#ft-f-save");
    if (saveBtn) saveBtn.onclick = () => {
      const vals = ftReadForm();
      if (!vals.name) { alert("Name is required."); return; }
      if (isEdit) {
        const idx = ft.people.findIndex(x => x.id === p.id);
        if (idx > -1) Object.assign(ft.people[idx], vals);
        selId = p.id;
      } else {
        const np = { id: ftNextId(ft.people), ...vals };
        ft.people.push(np);
        selId = np.id;
      }
      ftSave(); ftDraw(); ftRenderList(); ftShowPersonView(ft.people.find(x => x.id === selId));
    };

    const cancelBtn = panel.querySelector("#ft-f-cancel");
    if (cancelBtn) cancelBtn.onclick = () => {
      selId = null; ftRenderPanel(); ftRenderList(); ftDraw();
    };

    const delBtn = panel.querySelector("#ft-f-delete");
    if (delBtn) {
      delBtn.onclick = () => {
        if (!confirm(`Delete "${p.name || "this person"}"? This also removes their relationships.`)) return;
        ft.people = ft.people.filter(x => x.id !== p.id);
        ft.bonds  = ft.bonds.filter(b => b.fromId !== p.id && b.toId !== p.id);
        delete ft.positions[p.id];
        selId = null;
        ftSave(); ftDraw(); ftRenderList(); ftRenderPanel();
      };
    }
  }

  function ftShowPersonView(person) {
    if (!person) { ftShowAddForm(); return; }

    const parents  = ft.bonds.filter(b => b.type === "parent" && b.toId   === person.id);
    const children = ft.bonds.filter(b => b.type === "parent" && b.fromId === person.id);
    const partners = ft.bonds.filter(b => b.type === "partner" && (b.fromId === person.id || b.toId === person.id));

    const othersForSelect = ft.people.filter(q => q.id !== person.id)
      .map(q => `<option value="${q.id}">${ftEsc(q.name || "Unnamed")}</option>`).join("");

    function bondRowHtml(bond, label, sub) {
      return `<div class="ft-bond-row">
        <span>${ftEsc(label)} <span class="ft-sub">(${ftEsc(sub)})</span></span>
        <button data-delbond="${bond.id}" title="remove">×</button>
      </div>`;
    }

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:.4rem">
        <h3 style="margin:0">${ftEsc(person.name || "Unnamed")}</h3>
        <span style="width:16px;height:16px;border-radius:50%;background:${ftEsc(person.color || "#34d399")};flex-shrink:0;display:inline-block"></span>
      </div>
      <div>
        ${person.pronouns ? `<span class="ft-chip">${ftEsc(person.pronouns)}</span>` : ""}
        ${person.gender   ? `<span class="ft-chip">${ftEsc(person.gender)}</span>`   : ""}
        ${person.species  ? `<span class="ft-chip">${ftEsc(person.species)}</span>`  : ""}
      </div>
      ${(person.dob || person.dod) ? `<p style="margin:.2rem 0;font-size:.76rem;color:#6ee7b7">
        ${person.dob ? "b. " + ftEsc(person.dob) : ""}
        ${person.dob && person.dod ? " · " : ""}
        ${person.dod ? "† " + ftEsc(person.dod) : ""}
      </p>` : ""}
      ${person.notes ? `<p style="margin:.3rem 0;color:#a7f3d0;font-size:.79rem;line-height:1.5;white-space:pre-wrap">${ftEsc(person.notes)}</p>` : ""}

      <hr class="ft-divider">
      <div style="font-size:.76rem;color:#6ee7b7;margin-bottom:.3rem">Relationships</div>

      ${parents.length  ? `<div class="ft-sub" style="margin-bottom:.2rem">parents</div>${parents.map(b => {
          const other = ft.people.find(p => p.id === b.fromId);
          return bondRowHtml(b, other?.name || "?", ftNormalizeBondType(b.bondType));
        }).join("")}` : ""}

      ${children.length ? `<div class="ft-sub" style="margin:.25rem 0 .2rem">children</div>${children.map(b => {
          const other = ft.people.find(p => p.id === b.toId);
          return bondRowHtml(b, other?.name || "?", ftNormalizeBondType(b.bondType));
        }).join("")}` : ""}

      ${partners.length ? `<div class="ft-sub" style="margin:.25rem 0 .2rem">partner(s)</div>${partners.map(b => {
          const otherId = b.fromId === person.id ? b.toId : b.fromId;
          const other = ft.people.find(p => p.id === otherId);
          return bondRowHtml(b, other?.name || "?", b.relType || "partnered");
        }).join("")}` : ""}

      ${ft.people.length > 1 ? `
        <hr class="ft-divider">
        <div style="font-size:.76rem;color:#6ee7b7;margin-bottom:.35rem">Add relationship</div>
        <label>Type
          <select id="ft-rt">
            <option value="par-parent">is parent of →</option>
            <option value="par-child">is child of →</option>
            <option value="partner">partner with</option>
          </select>
        </label>
        <label style="margin-top:.3rem">Person
          <select id="ft-rp"><option value="">— select —</option>${othersForSelect}</select>
        </label>
        <div id="ft-rbt-wrap">
          <label style="margin-top:.3rem">Bond type
            <select id="ft-rbt">${BOND_TYPES.map(t => `<option value="${t}">${t}</option>`).join("")}</select>
          </label>
        </div>
        <div id="ft-rpt-wrap" style="display:none">
          <label style="margin-top:.3rem">Partner type
            <select id="ft-rpt">${PARTNER_TYPES.map(t => `<option value="${t}">${t}</option>`).join("")}</select>
          </label>
        </div>
        <div class="ft-actions" style="margin-top:.4rem">
          <button id="ft-rel-add">Add</button>
        </div>` : `<p class="ft-sub">Add more people to create relationships.</p>`}

      <hr class="ft-divider">
      <div class="ft-actions">
        <button id="ft-edit-btn">Edit</button>
        <button id="ft-desel-btn">Deselect</button>
      </div>`;

    // rel type toggle
    const rtEl  = panel.querySelector("#ft-rt");
    const rbtWr = panel.querySelector("#ft-rbt-wrap");
    const rptWr = panel.querySelector("#ft-rpt-wrap");
    if (rtEl) {
      function ftUpdateRelWrap() {
        const v = rtEl.value;
        if (rbtWr) rbtWr.style.display = (v === "par-parent" || v === "par-child") ? "" : "none";
        if (rptWr) rptWr.style.display = v === "partner" ? "" : "none";
      }
      rtEl.onchange = ftUpdateRelWrap;
      ftUpdateRelWrap();
    }

    const addRelBtn = panel.querySelector("#ft-rel-add");
    if (addRelBtn) {
      addRelBtn.onclick = () => {
        const relTypeEl = panel.querySelector("#ft-rt");
        const otherEl   = panel.querySelector("#ft-rp");
        const relType = relTypeEl ? relTypeEl.value : "par-parent";
        const otherId = Number(otherEl ? otherEl.value : "0");
        if (!otherId) { alert("Select a person."); return; }
        if (relType === "partner") {
          const pTypeEl = panel.querySelector("#ft-rpt");
          const pType = pTypeEl ? pTypeEl.value : "partnered";
          ft.bonds = ft.bonds.filter(b => !(b.type === "partner" &&
            ((b.fromId === person.id && b.toId === otherId) || (b.fromId === otherId && b.toId === person.id))));
          ft.bonds.push({ id: ftNextId(ft.bonds), type: "partner", fromId: person.id, toId: otherId, relType: pType });
        } else {
          const bTypeEl = panel.querySelector("#ft-rbt");
          const bType = ftNormalizeBondType(bTypeEl ? bTypeEl.value : "biological");
          if (relType === "par-parent") {
            ft.bonds.push({ id: ftNextId(ft.bonds), type: "parent", fromId: person.id, toId: otherId, bondType: bType });
          } else {
            ft.bonds.push({ id: ftNextId(ft.bonds), type: "parent", fromId: otherId, toId: person.id, bondType: bType });
          }
        }
        ftSave(); ftDraw(); ftShowPersonView(person);
      };
    }

    panel.querySelectorAll("button[data-delbond]").forEach(btn => {
      btn.onclick = () => {
        ft.bonds = ft.bonds.filter(b => b.id !== Number(btn.dataset.delbond));
        ftSave(); ftDraw(); ftShowPersonView(person);
      };
    });

    const editBtn = panel.querySelector("#ft-edit-btn");
    if (editBtn) editBtn.onclick = () => ftShowAddForm(person);

    const deselectBtn = panel.querySelector("#ft-desel-btn");
    if (deselectBtn) deselectBtn.onclick = () => { selId = null; ftRenderPanel(); ftRenderList(); ftDraw(); };
  }

  // ── Small panel list ──────────────────────────────────────────────────────
  function ftRenderList() {
    const listEl  = document.getElementById("ft-people-list");
    const countEl = document.getElementById("ft-count");
    const legendEl = document.getElementById("ft-legend");
    if (!listEl) return;
    if (countEl) countEl.textContent = `${ft.people.length} member${ft.people.length !== 1 ? "s" : ""}`;
    if (legendEl) {
      legendEl.innerHTML = BOND_TYPES.map(type => `<div style="display:flex;align-items:center;gap:.38rem;padding:.16rem .26rem;border-radius:7px;border:1px solid rgba(134,239,172,.1);background:rgba(6,14,8,.34)">
        ${ftLegendLine(type)}
        <span style="color:#d1fae5;font-size:.74rem">${ftEsc(type)}</span>
      </div>`).join("");
    }
    listEl.innerHTML = ft.people.map(p => {
      const isSel = p.id === selId;
      return `<button data-ftpid="${p.id}" style="
        display:flex;gap:.42rem;align-items:center;width:100%;text-align:left;
        background:${isSel ? "rgba(134,239,172,.14)" : "transparent"};
        border:1px solid ${isSel ? "rgba(134,239,172,.38)" : "rgba(134,239,172,.09)"};
        border-radius:8px;color:${isSel ? "#d1fae5" : "#a7f3d0"};
        padding:.28rem .46rem;cursor:pointer;font-size:.77rem;font-family:inherit">
        <span style="width:9px;height:9px;border-radius:50%;background:${ftEsc(p.color || "#34d399")};flex-shrink:0"></span>
        <span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${ftEsc(p.name || "Unnamed")}</span>
        ${p.dob ? `<span style="color:rgba(110,231,183,.38);font-size:.69rem;margin-left:auto">${ftEsc(p.dob.slice(0, 4))}</span>` : ""}
      </button>`;
    }).join("");
    listEl.querySelectorAll("button[data-ftpid]").forEach(btn => {
      btn.onclick = () => {
        selId = Number(btn.dataset.ftpid);
        ftRenderPanel(); ftRenderList(); ftDraw();
      };
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  new ResizeObserver(ftResize).observe(wrap);
  ftResize();
  ftRenderPanel();
  ftRenderList();
}

function renderFriends() {
  const CONFIG_KEY = "cyberdeckFriendsConfig";
  const AUTH_KEY = "cyberdeckFriendsAuth";
  const PROFILE_KEY = "cyberdeckFriendsProfile";
  const CACHE_KEY = "cyberdeckFriendsCache";

  function nowIso() {
    return new Date().toISOString();
  }

  function loadConfig() {
    try {
      const raw = JSON.parse(safeGetStorage(CONFIG_KEY) || "null");
      return {
        url: String(raw && raw.url ? raw.url : "").trim()
      };
    } catch (_error) {
      return { url: "" };
    }
  }

  function loadAuth() {
    try {
      const raw = JSON.parse(safeGetStorage(AUTH_KEY) || "null");
      return {
        accessToken: String(raw && raw.accessToken ? raw.accessToken : "").trim(),
        refreshToken: String(raw && raw.refreshToken ? raw.refreshToken : "").trim(),
        userId: String(raw && raw.userId ? raw.userId : "").trim(),
        email: String(raw && raw.email ? raw.email : "").trim(),
        username: String(raw && raw.username ? raw.username : "").trim().toLowerCase()
      };
    } catch (_error) {
      return { accessToken: "", refreshToken: "", userId: "", email: "", username: "" };
    }
  }

  function loadProfile() {
    try {
      const raw = JSON.parse(safeGetStorage(PROFILE_KEY) || "null");
      const defaultPrivacy = {
        username: "public",
        email: "private",
        displayName: "friends",
        status: "friends"
      };
      const loadedPrivacy = raw && raw.privacy && typeof raw.privacy === "object" ? raw.privacy : {};
      return {
        displayName: String(raw && raw.displayName ? raw.displayName : "").trim(),
        status: String(raw && raw.status ? raw.status : "online").trim(),
        privacy: {
          username: normalizePrivacyTier(loadedPrivacy.username, defaultPrivacy.username),
          email: normalizePrivacyTier(loadedPrivacy.email, defaultPrivacy.email),
          displayName: normalizePrivacyTier(loadedPrivacy.displayName, defaultPrivacy.displayName),
          status: normalizePrivacyTier(loadedPrivacy.status, defaultPrivacy.status)
        }
      };
    } catch (_error) {
      return {
        displayName: "",
        status: "online",
        privacy: {
          username: "public",
          email: "private",
          displayName: "friends",
          status: "friends"
        }
      };
    }
  }

  let config = loadConfig();
  let auth = loadAuth();
  let profile = loadProfile();

  function saveConfig() {
    safeSetStorage(CONFIG_KEY, JSON.stringify(config));
  }

  function saveAuth() {
    safeSetStorage(AUTH_KEY, JSON.stringify(auth));
  }

  function saveProfile() {
    safeSetStorage(PROFILE_KEY, JSON.stringify(profile));
  }

  function sanitizeUsername(value) {
    return String(value || "").trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
  }

  function cleanUrl(url) {
    return String(url || "").trim().replace(/\/+$/, "");
  }

  function defaultBackendUrl() {
    const origin = String(window.location && window.location.origin || "").trim();
    if (!origin || origin === "null") return "";
    if (!/^https?:\/\//i.test(origin)) return "";
    return cleanUrl(origin);
  }

  function assertConfigured() {
    config.url = cleanUrl(config.url) || defaultBackendUrl();
    if (!config.url) {
      throw new Error("Add your backend URL in the middle panel (e.g., http://localhost:8787).");
    }
  }

  function requireAuth() {
    if (!auth.accessToken || !auth.userId || !auth.username) {
      throw new Error("Log in first using email, password, and username.");
    }
  }

  async function api(path, method = "GET", body = null) {
    assertConfigured();
    requireAuth();
    const endpoint = `${config.url}/api/${path}`;
    const headers = {
      "Authorization": `Bearer ${auth.accessToken}`,
      "Content-Type": "application/json"
    };
    const response = await fetch(endpoint, {
      method,
      headers,
      body: body == null ? undefined : JSON.stringify(body)
    });
    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch (_error) {
      payload = text || null;
    }
    if (!response.ok) {
      const detail = payload && payload.message ? payload.message : text || `${response.status} ${response.statusText}`;
      throw new Error(String(detail));
    }
    return payload;
  }

  async function authCall(path, method = "POST", body = null) {
    assertConfigured();
    const endpoint = `${config.url}/api/auth/${path}`;
    const headers = { "Content-Type": "application/json" };
    const response = await fetch(endpoint, {
      method,
      headers,
      body: body == null ? undefined : JSON.stringify(body)
    });
    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch (_error) {
      payload = text || null;
    }
    if (!response.ok) {
      const detail = payload && payload.message ? payload.message : text || `${response.status} ${response.statusText}`;
      throw new Error(String(detail));
    }
    return payload;
  }

  const html = `
    <section id="friends-online" style="display:grid;gap:.75rem">
      <style>
        #friends-online { padding:.65rem; border:1px solid #1f4f51; border-radius:14px; background:
          radial-gradient(120% 130% at 0% 0%, rgba(45,212,191,.16), transparent 45%),
          linear-gradient(165deg,#082224,#113033 54%,#0d2225); }
        #friends-online .frh { display:flex; align-items:end; justify-content:space-between; gap:.6rem; flex-wrap:wrap; }
        #friends-online .frh-title { color:#dcfdfa; font:700 1.04rem "Palatino Linotype","Book Antiqua",Georgia,serif; }
        #friends-online .frh-sub { color:#99f6e4; font-size:.8rem; }
        #friends-online .fr-card { border:1px solid rgba(153,246,228,.3); border-radius:12px; padding:.65rem; background:rgba(5,18,19,.58); }
        #friends-online .fr-list { display:grid; gap:.45rem; max-height:52vh; overflow:auto; }
        #friends-online .fr-item { border:1px solid rgba(153,246,228,.24); border-radius:10px; padding:.48rem .56rem; background:rgba(3,12,13,.62); }
        #friends-online .fr-item strong { color:#ccfbf1; }
        #friends-online .fr-item small { color:#99f6e4; }
        #friends-online .fr-row { display:flex; gap:.4rem; flex-wrap:wrap; margin-top:.35rem; }
      </style>

      <div class="frh">
        <div>
          <div class="frh-title">Online Friends</div>
          <div class="frh-sub">Cross-device friend requests and accepted friends</div>
        </div>
        <button id="friends-refresh" type="button" style="width:auto">Refresh</button>
      </div>

      <section class="fr-card">
        <div id="friends-alert" style="color:#a7f3d0;font-size:.8rem">Save connection, create account or log in, then click Refresh.</div>
        <div id="friends-self" style="margin-top:.4rem;color:#ccfbf1;font-size:.82rem"></div>
      </section>

      <section class="fr-card" style="display:grid;gap:.45rem">
        <label style="display:grid;gap:.2rem;color:#99f6e4;font-size:.78rem">Add friend by username
          <input id="friends-target" placeholder="friend_username" style="background:#071516;border:1px solid #2f6768;border-radius:8px;color:#dcfdfa;padding:.44rem" />
        </label>
        <button id="friends-send" type="button" style="width:auto">Send Request</button>
      </section>

      <section class="fr-card" style="display:grid;gap:.45rem">
        <h4 style="margin:.1rem 0;color:#ccfbf1">Incoming Requests</h4>
        <div id="friends-incoming" class="fr-list"></div>
      </section>

      <section class="fr-card" style="display:grid;gap:.45rem">
        <h4 style="margin:.1rem 0;color:#ccfbf1">Friends</h4>
        <div id="friends-list" class="fr-list"></div>
      </section>
    </section>
  `;

  const medium = `
    <section style="display:grid;gap:.65rem;align-content:start">
      <h4 style="margin:.1rem 0">Login + Connection</h4>
      <label style="display:grid;gap:.2rem;color:#8b949e;font-size:.78rem">Email
        <input id="friends-auth-email" type="email" placeholder="you@example.com" value="${esc(auth.email)}" />
      </label>
      <label style="display:grid;gap:.2rem;color:#8b949e;font-size:.78rem">Password
        <input id="friends-auth-password" type="password" placeholder="********" value="" />
      </label>
      <label style="display:grid;gap:.2rem;color:#8b949e;font-size:.78rem">Username
        <input id="friends-auth-username" placeholder="olive" value="${esc(auth.username)}" />
      </label>
      <div style="display:flex;gap:.45rem;flex-wrap:wrap">
        <button id="friends-signup" type="button" style="width:auto">Sign Up</button>
        <button id="friends-login" type="button" style="width:auto">Log In</button>
        <button id="friends-logout" type="button" style="width:auto;background:#3f1f1f;border-color:#7f1d1d;color:#fecaca">Log Out</button>
      </div>

      <div style="height:1px;background:#2a333d"></div>

      <h4 style="margin:.1rem 0">Profile</h4>
      <label style="display:grid;gap:.2rem;color:#8b949e;font-size:.78rem">Display name
        <input id="friends-display" placeholder="Olive" value="${esc(profile.displayName)}" />
      </label>
      <label style="display:grid;gap:.2rem;color:#8b949e;font-size:.78rem">Status
        <select id="friends-status">
          <option value="online" ${profile.status === "online" ? "selected" : ""}>online</option>
          <option value="away" ${profile.status === "away" ? "selected" : ""}>away</option>
          <option value="busy" ${profile.status === "busy" ? "selected" : ""}>busy</option>
          <option value="offline" ${profile.status === "offline" ? "selected" : ""}>offline</option>
        </select>
      </label>
      <div style="display:grid;gap:.45rem">
        <h4 style="margin:.1rem 0">Privacy Tiers</h4>
        <label style="display:grid;gap:.2rem;color:#8b949e;font-size:.78rem">Username visibility
          <select id="friends-privacy-username">${renderPrivacyTierOptions(profile.privacy.username)}</select>
        </label>
        <label style="display:grid;gap:.2rem;color:#8b949e;font-size:.78rem">Email visibility
          <select id="friends-privacy-email">${renderPrivacyTierOptions(profile.privacy.email)}</select>
        </label>
        <label style="display:grid;gap:.2rem;color:#8b949e;font-size:.78rem">Display name visibility
          <select id="friends-privacy-displayName">${renderPrivacyTierOptions(profile.privacy.displayName)}</select>
        </label>
        <label style="display:grid;gap:.2rem;color:#8b949e;font-size:.78rem">Status visibility
          <select id="friends-privacy-status">${renderPrivacyTierOptions(profile.privacy.status)}</select>
        </label>
      </div>
      <button id="friends-save-profile" type="button">Save Profile</button>

      <div style="height:1px;background:#2a333d"></div>

      <label style="display:grid;gap:.2rem;color:#8b949e;font-size:.78rem">Backend URL
        <input id="friends-sb-url" placeholder="auto (same origin)" value="${esc(config.url || defaultBackendUrl())}" />
      </label>
      <button id="friends-save-config" type="button">Save Connection</button>
      <button id="friends-go-settings" type="button" style="width:auto;background:#1f2937">Open Settings Tab</button>
    </section>
  `;

  const small = `
    <section style="display:grid;gap:.6rem;align-content:start">
      <h4 style="margin:.1rem 0">Backend Setup</h4>
      <p style="margin:0;color:#8b949e;font-size:.76rem">Start the backend server on your machine:</p>
      <code style="display:block;background:#050a0f;border:1px solid #234447;color:#9ae6b4;font-size:.7rem;padding:.5rem;border-radius:8px;line-height:1.4;white-space:pre-wrap;word-break:break-all">npm run backend</code>
      <p style="margin:0;color:#8b949e;font-size:.76rem">The server will run on <strong>http://localhost:8787</strong> by default.</p>
      <p style="margin:0;color:#fbbf24;font-size:.72rem"><strong>Important:</strong> Run this command from the Cyberdeck workspace directory.</p>
      <p style="margin:0;color:#8b949e;font-size:.76rem">Enter the URL above to connect, then create an account and start adding friends!</p>
    </section>
  `;

  setContent({ title: "friends" }, html, medium, small);

  const alertEl = document.getElementById("friends-alert");
  const selfEl = document.getElementById("friends-self");
  const incomingEl = document.getElementById("friends-incoming");
  const friendsEl = document.getElementById("friends-list");

  function flash(message, isError = false) {
    if (!alertEl) return;
    alertEl.textContent = message;
    alertEl.style.color = isError ? "#fca5a5" : "#a7f3d0";
  }

  function renderSelf() {
    if (!selfEl) return;
    if (!auth.userId) {
      selfEl.innerHTML = `<strong>Not logged in</strong> • add email, password, and username.`;
      return;
    }
    const name = profile.displayName || auth.username || "(unset)";
    selfEl.innerHTML = `<strong>${esc(name)}</strong> • @${esc(auth.username || "unset")} • ${esc(auth.email || "no-email")} • ${esc(profile.status)}`;
  }

  function getRelationshipContext(requestRow) {
    if (!requestRow || requestRow.status !== "accepted") {
      return { isSelf: false, isFriend: false, isTrusted: false };
    }
    const isFromSide = String(requestRow.from_user) === auth.userId;
    return {
      isSelf: false,
      isFriend: true,
      isTrusted: isFromSide ? !!requestRow.trusted_by_from : !!requestRow.trusted_by_to
    };
  }

  function canAccessTier(tier, relation) {
    const normalized = normalizePrivacyTier(tier, "private");
    if (relation.isSelf) return true;
    if (normalized === "public") return true;
    if (normalized === "friends") return !!relation.isFriend;
    if (normalized === "trusted") return !!relation.isTrusted;
    return false;
  }

  function readVisibleField(sourceRow, key, tier, relation, fallbackLabel = "Hidden") {
    if (canAccessTier(tier, relation)) return sourceRow[key] || "";
    return fallbackLabel;
  }

  function renderIncoming(items, profileByUserId) {
    if (!incomingEl) return;
    if (!items.length) {
      incomingEl.innerHTML = `<p style="margin:0;color:#8b949e;font-size:.8rem">No incoming requests.</p>`;
      return;
    }
    incomingEl.innerHTML = items.map(item => {
      const sender = profileByUserId.get(String(item.from_user)) || { username: "unknown", display_name: "Unknown user" };
      return `<article class="fr-item">
        <strong>@${esc(sender.username || "unknown")}</strong>
        <div><small>${esc(sender.display_name || "Unknown user")}</small></div>
        <div><small>${esc(new Date(item.created_at).toLocaleString())}</small></div>
        <div class="fr-row">
          <button data-fr-accept="${esc(item.id)}" type="button" style="width:auto">Accept</button>
          <button data-fr-reject="${esc(item.id)}" type="button" style="width:auto;background:#4b1d1d;border-color:#7f1d1d;color:#fecaca">Reject</button>
        </div>
      </article>`;
    }).join("");

    incomingEl.querySelectorAll("[data-fr-accept]").forEach(btn => {
      btn.onclick = () => updateRequestStatus(btn.dataset.frAccept, "accepted");
    });
    incomingEl.querySelectorAll("[data-fr-reject]").forEach(btn => {
      btn.onclick = () => updateRequestStatus(btn.dataset.frReject, "rejected");
    });
  }

  function renderFriendsList(items) {
    if (!friendsEl) return;
    if (!items.length) {
      friendsEl.innerHTML = `<p style="margin:0;color:#8b949e;font-size:.8rem">No accepted friends yet.</p>`;
      return;
    }
    friendsEl.innerHTML = items.map(item => `<article class="fr-item">
      <strong>${esc(item.displayName || "Hidden")}</strong>
      <div><small>@${esc(item.username || "Hidden")} • ${esc(item.status || "Hidden")}</small></div>
      ${item.email ? `<div><small>${esc(item.email)}</small></div>` : ""}
      <div><small>${item.trusted ? "trusted friend" : "regular friend"}</small></div>
      <div class="fr-row">
        <button data-view-modules="${esc(item.username)}" type="button" style="width:auto">View Modules</button>
        <button data-fr-trust="${esc(item.requestId)}" data-fr-trusted="${item.trusted ? "1" : "0"}" type="button" style="width:auto">${item.trusted ? "Untrust" : "Trust"}</button>
        <button data-fr-remove="${esc(item.requestId)}" type="button" style="width:auto;background:#4b1d1d;border-color:#7f1d1d;color:#fecaca">Remove</button>
      </div>
    </article>`).join("");

    friendsEl.querySelectorAll("[data-view-modules]").forEach(btn => {
      btn.onclick = () => viewFriendModules(btn.dataset.viewModules);
    });
    friendsEl.querySelectorAll("[data-fr-trust]").forEach(btn => {
      btn.onclick = () => setTrustedFriend(btn.dataset.frTrust, btn.dataset.frTrusted !== "1");
    });
    friendsEl.querySelectorAll("[data-fr-remove]").forEach(btn => {
      btn.onclick = () => removeFriend(btn.dataset.frRemove);
    });
  }

  async function upsertProfile() {
    requireAuth();
    saveProfile();
    await api("profile", "PUT", {
      displayName: profile.displayName || auth.username,
      status: profile.status || "online",
      privacy: profile.privacy
    });
  }

  async function loadNetwork() {
    try {
      flash("Loading network...");
      await upsertProfile();
      const data = await api("network", "GET");
      const incoming = (data && data.incoming) || [];
      const friends = (data && data.friends) || [];
      
      safeSetStorage(CACHE_KEY, JSON.stringify({ at: nowIso(), friends }));
      
      const incomingMap = new Map();
      incoming.forEach(item => {
        incomingMap.set(item.username, item);
      });
      
      renderIncoming(incoming, incomingMap);
      renderFriendsList(friends);
      renderSelf();
      flash(`Loaded ${friends.length} friend${friends.length === 1 ? "" : "s"}.`);
    } catch (error) {
      flash(error.message || "Failed to load network.", true);
    }
  }

  async function sendRequest() {
    try {
      const targetEl = document.getElementById("friends-target");
      const target = sanitizeUsername(targetEl ? targetEl.value : "");
      if (!target) throw new Error("Enter a friend username.");
      if (target === auth.username) throw new Error("You cannot friend yourself.");

      await upsertProfile();
      await api("friends/request", "POST", { username: target });
      if (targetEl) targetEl.value = "";
      flash(`Request sent to @${target}.`);
      await loadNetwork();
    } catch (error) {
      flash(error.message || "Failed to send request.", true);
    }
  }

  async function updateRequestStatus(requestId, status) {
    try {
      if (!requestId) throw new Error("Invalid request id.");
      await api(`friends/request/${requestId}`, "PATCH", { status });
      flash(`Request ${status}.`);
      await loadNetwork();
    } catch (error) {
      flash(error.message || "Could not update request.", true);
    }
  }

  async function removeFriend(requestId) {
    try {
      if (!requestId) throw new Error("Invalid request id.");
      await api(`friends/request/${requestId}`, "DELETE");
      flash("Friend removed.");
      await loadNetwork();
    } catch (error) {
      flash(error.message || "Could not remove friend.", true);
    }
  }

  async function setTrustedFriend(requestId, trusted) {
    try {
      if (!requestId) throw new Error("Invalid request id.");
      await api(`friends/request/${requestId}/trust`, "PATCH", { trusted });
      flash(trusted ? "Friend marked trusted." : "Friend removed from trusted tier.");
      await loadNetwork();
    } catch (error) {
      flash(error.message || "Could not update trust tier.", true);
    }
  }

  async function syncModuleToBackend(moduleName, data) {
    try {
      requireAuth();
      await api(`modules/${moduleName}`, "PUT", { data });
    } catch (error) {
      console.warn(`Could not sync ${moduleName} to backend:`, error.message);
    }
  }

  async function fetchFriendModule(username, moduleName) {
    try {
      const response = await api(`user/${encodeURIComponent(username)}/modules/${moduleName}`, "GET");
      return response && response.data;
    } catch (error) {
      return null;
    }
  }

  async function viewFriendModules(username) {
    try {
      requireAuth();
      const response = await api(`user/${encodeURIComponent(username)}/modules`, "GET");
      const modules = response && response.modules ? response.modules : [];
      
      if (modules.length === 0) {
        flash("No accessible modules for this friend.");
        return;
      }

      let moduleHtml = `<div style="color:#dcfdfa;padding:.5rem;border:1px solid rgba(153,246,228,.3);border-radius:8px;background:rgba(5,18,19,.58)">
        <strong>${esc(username)}'s Modules</strong>
        <div style="margin-top:.5rem;display:grid;gap:.3rem">`;
      
      for (const mod of modules) {
        moduleHtml += `<button data-view-module="${esc(mod)}" style="text-align:left;width:100%;background:#071516;border:1px solid #2f6768;color:#99f6e4;padding:.3rem;border-radius:6px;cursor:pointer">${mod}</button>`;
      }
      moduleHtml += `</div></div>`;
      
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = moduleHtml;
      const parent = friendsEl ? friendsEl.parentElement : null;
      if (parent) {
        const old = parent.querySelector("[data-modules-view]");
        if (old) old.remove();
        tempDiv.setAttribute("data-modules-view", "true");
        parent.appendChild(tempDiv);
        
        tempDiv.querySelectorAll("[data-view-module]").forEach(btn => {
          btn.onclick = () => displayFriendModule(username, btn.dataset.viewModule, tempDiv);
        });
      }
    } catch (error) {
      flash(error.message || "Could not load friend modules.", true);
    }
  }

  async function displayFriendModule(username, moduleName, container) {
    try {
      const data = await fetchFriendModule(username, moduleName);
      if (!data) {
        flash(`Cannot access ${moduleName}.`, true);
        return;
      }
      
      let displayHtml = `<div style="color:#dcfdfa;padding:.5rem;border:1px solid rgba(153,246,228,.3);border-radius:8px;background:rgba(5,18,19,.58);margin-top:.4rem">
        <strong>${esc(username)}'s ${moduleName}</strong>
        <button style="float:right;width:auto;padding:.2rem .4rem;font-size:.75rem" onclick="this.closest('[data-modules-view]').remove()">Close</button>
        <div style="clear:both;margin-top:.4rem;font-size:.8rem;color:#a7f3d0;max-height:30vh;overflow:auto;white-space:pre-wrap;word-wrap:break-word">`;
      
      if (typeof data === "string" || typeof data === "number") {
        displayHtml += esc(String(data));
      } else {
        displayHtml += esc(JSON.stringify(data, null, 2));
      }
      
      displayHtml += `</div></div>`;
      container.innerHTML += displayHtml;
    } catch (error) {
      flash(error.message || "Could not display module.", true);
    }
  }

  async function signUp() {
    try {
      const email = String((document.getElementById("friends-auth-email") || {}).value || "").trim();
      const password = String((document.getElementById("friends-auth-password") || {}).value || "").trim();
      const username = sanitizeUsername((document.getElementById("friends-auth-username") || {}).value || "");
      if (!email || !password || !username) throw new Error("Email, password, and username are required for sign up.");
      const result = await authCall("signup", "POST", { email, password, username });

      auth.email = email;
      auth.username = username;
      if (result && result.token && result.user && result.user.id) {
        auth.accessToken = result.token;
        auth.refreshToken = "";
        auth.userId = String(result.user.id);
      } else {
        throw new Error("Signup failed: invalid response.");
      }
      saveAuth();
      renderSelf();
      await upsertProfile();
      flash("Account created and logged in.");
      await loadNetwork();
      await syncAllModulesToBackend();
    } catch (error) {
      flash(error.message || "Sign up failed.", true);
    }
  }

  async function logIn() {
    try {
      const email = String((document.getElementById("friends-auth-email") || {}).value || "").trim();
      const password = String((document.getElementById("friends-auth-password") || {}).value || "").trim();
      const usernameInput = sanitizeUsername((document.getElementById("friends-auth-username") || {}).value || "");
      if (!email || !password) throw new Error("Email and password are required to log in.");

      const result = await authCall("login", "POST", { email, password });
      if (!result || !result.token || !result.user || !result.user.id) throw new Error("Login response was incomplete.");

      auth.accessToken = result.token;
      auth.refreshToken = "";
      auth.userId = String(result.user.id);
      auth.email = email;
      auth.username = result.user.username || "";
      if (!auth.username) throw new Error("Username missing. This should not happen.");

      saveAuth();
      await upsertProfile();
      renderSelf();
      flash("Logged in.");
      await loadNetwork();
      await syncAllModulesToBackend();
    } catch (error) {
      flash(error.message || "Login failed.", true);
    }
  }

  // Module syncing setup
  const MODULES_TO_SYNC = ["cyberdeckFrontTracker", "cyberdeckPluraldex", "cyberdeckScrapbookBoard", "cyberdeckTimeline", "cyberdeckTriggers"];
  const MODULE_NAMES = ["fronts", "pluraldex", "scrapbook", "timeline", "triggers"];
  let lastSyncTime = 0;
  
  async function syncAllModulesToBackend() {
    if (!auth.userId || !auth.accessToken) return;
    
    const now = Date.now();
    if (now - lastSyncTime < 30000) return; // Sync every 30 seconds max
    lastSyncTime = now;
    
    for (let i = 0; i < MODULES_TO_SYNC.length; i++) {
      const storageKey = MODULES_TO_SYNC[i];
      const moduleName = MODULE_NAMES[i];
      const data = safeGetStorage(storageKey);
      if (data !== null) {
        try {
          await syncModuleToBackend(moduleName, data);
        } catch (_error) {
          // Silent fail - don't spam errors
        }
      }
    }
  }
  
  // Start syncing modules every 60 seconds
  setInterval(syncAllModulesToBackend, 60000);

  async function logOut() {
    try {
      if (auth.accessToken) await authCall("logout", "POST", {});
    } catch (_error) {
    } finally {
      auth = { accessToken: "", refreshToken: "", userId: "", email: "", username: "" };
      saveAuth();
      renderIncoming([], new Map());
      renderFriendsList([]);
      renderSelf();
      flash("Logged out.");
    }
  }

  const signUpBtn = document.getElementById("friends-signup");
  if (signUpBtn) signUpBtn.onclick = signUp;
  const loginBtn = document.getElementById("friends-login");
  if (loginBtn) loginBtn.onclick = logIn;
  const logoutBtn = document.getElementById("friends-logout");
  if (logoutBtn) logoutBtn.onclick = logOut;

  const saveProfileBtn = document.getElementById("friends-save-profile");
  if (saveProfileBtn) {
    saveProfileBtn.onclick = async () => {
      profile.displayName = String((document.getElementById("friends-display") || {}).value || "").trim();
      profile.status = String((document.getElementById("friends-status") || {}).value || "online").trim();
      profile.privacy = {
        username: normalizePrivacyTier((document.getElementById("friends-privacy-username") || {}).value || profile.privacy.username, "public"),
        email: normalizePrivacyTier((document.getElementById("friends-privacy-email") || {}).value || profile.privacy.email, "private"),
        displayName: normalizePrivacyTier((document.getElementById("friends-privacy-displayName") || {}).value || profile.privacy.displayName, "friends"),
        status: normalizePrivacyTier((document.getElementById("friends-privacy-status") || {}).value || profile.privacy.status, "friends")
      };
      saveProfile();
      renderSelf();
      if (auth.userId) {
        try {
          await upsertProfile();
          flash("Profile saved online.");
        } catch (error) {
          flash(error.message || "Could not save profile online.", true);
        }
      } else {
        flash("Profile saved locally. Log in to sync online.");
      }
    };
  }

  const saveConfigBtn = document.getElementById("friends-save-config");
  if (saveConfigBtn) {
    saveConfigBtn.onclick = () => {
      config.url = String((document.getElementById("friends-sb-url") || {}).value || "").trim();
      saveConfig();
      flash("Connection saved locally.");
    };
  }

  const goSettingsBtn = document.getElementById("friends-go-settings");
  if (goSettingsBtn) goSettingsBtn.onclick = () => setActiveTag("settings");
  const refreshBtn = document.getElementById("friends-refresh");
  if (refreshBtn) refreshBtn.onclick = loadNetwork;
  const sendBtn = document.getElementById("friends-send");
  if (sendBtn) sendBtn.onclick = sendRequest;

  renderSelf();
  try {
    const cached = JSON.parse(safeGetStorage(CACHE_KEY) || "null");
    if (cached && Array.isArray(cached.friends)) {
      renderFriendsList(cached.friends);
      renderIncoming([], new Map());
      flash(`Showing cached network (${cached.friends.length} friend${cached.friends.length === 1 ? "" : "s"}). Click Refresh.`);
    }
  } catch (_error) {}

  // Disabled auto-load to prevent hanging on startup if Supabase is not configured
  // if (auth.userId && auth.username && config.url && config.anonKey) {
  //   loadNetwork();
  // }
}

els.buttons.forEach(btn => btn.addEventListener("click", () => setActiveTag(btn.dataset.tag)));

// ── Mobile dropdown selector ────────────────────────────────────────────
const mobileTabSelector = document.getElementById("mobile-tab-selector");
if (mobileTabSelector) {
  mobileTabSelector.addEventListener("change", (e) => {
    setActiveTag(e.target.value);
  });
}

// ── Export / Import wiring ────────────────────────────────────────────────
const exportBtn      = document.getElementById("btn-export");
const importBtn      = document.getElementById("btn-import");
const importFileInput = document.getElementById("import-file-input");
if (exportBtn)       exportBtn.onclick  = exportCyberdeckData;
if (importBtn)       importBtn.onclick  = () => importFileInput && importFileInput.click();
if (importFileInput) importFileInput.onchange = e => {
  const file = e.target.files[0];
  if (file) { importCyberdeckData(file); importFileInput.value = ""; }
};

// ── Mobile/Desktop view toggle ──────────────────────────────────────────
const viewToggleBtn = document.getElementById("btn-toggle-view");
const VIEW_MODE_KEY = "cyberdeckViewMode";

function initializeViewMode() {
  const saved = safeGetStorage(VIEW_MODE_KEY) || "auto";
  applyViewMode(saved);
}

function applyViewMode(mode) {
  document.body.classList.remove("force-mobile", "force-desktop");
  
  if (mode === "mobile") {
    document.body.classList.add("force-mobile");
    viewToggleBtn.textContent = "🖥️ Desktop";
    viewToggleBtn.title = "Switch to desktop view";
  } else if (mode === "desktop") {
    document.body.classList.add("force-desktop");
    viewToggleBtn.textContent = "📱 Mobile";
    viewToggleBtn.title = "Switch to mobile view";
  } else {
    // Auto mode - remove all forced classes
    viewToggleBtn.textContent = "📱 Mobile";
    viewToggleBtn.title = "Switch to mobile view";
  }
  
  safeSetStorage(VIEW_MODE_KEY, mode);
}

function toggleViewMode() {
  const current = safeGetStorage(VIEW_MODE_KEY) || "auto";
  // Cycle: auto -> desktop -> mobile -> auto
  let next;
  if (current === "auto") {
    next = "desktop";
  } else if (current === "desktop") {
    next = "mobile";
  } else {
    next = "auto";
  }
  applyViewMode(next);
}

if (viewToggleBtn) {
  viewToggleBtn.onclick = toggleViewMode;
}

initializeViewMode();

// Render default tag
cleanupRemovedCyberdeckData();
setActiveTag('nexus');