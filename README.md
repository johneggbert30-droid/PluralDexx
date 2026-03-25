# Cyberdeck Social Backend

A minimal self-hosted backend for Cyberdeck's friends and social features.

## Quick Start (One URL)

### 1. Install Dependencies

```bash
cd ..
npm install
```

### 2. Start the Server

```bash
npm run backend
```

The server will start on **http://localhost:8787** by default.

Now open **http://localhost:8787** in your browser.

- The frontend UI is served automatically.
- The Friends API is served from the same URL.
- You do not need to enter a backend URL manually unless you are using a different host.

To change the port, set the `PORT` environment variable:

```bash
PORT=3000 npm run backend
```

### 3. Use Friends

1. Open Cyberdeck in your browser at `http://localhost:8787`
2. Click the **friends** tab
3. Create an account or log in
4. Click **Refresh**

If you are connecting to a backend on another machine, set the URL manually to:

- `http://your-machine-ip:8787`

### 4. Create an Account

1. Enter your **email**, **password**, and **username**
2. Click **Sign Up**
3. You're now logged in! Click **Refresh** to see your network

## Features

- **Authentication**: Email/password signup and login with JWT tokens
- **Friend Requests**: Send, accept, and reject friend requests
- **Trusted Friends**: Mark friends as trusted for higher privacy visibility
- **Privacy Tiers**: Public, Friends, Trusted, Private for fields
  - Username
  - Email
  - Display Name
  - Status (online, away, busy, offline)
- **File-based Storage**: Uses `backend/data/social-db.json` for persistence

## Data Storage

All user and friendship data is stored in a single JSON file:

```
backend/data/social-db.json
```

This file is created automatically on first run. Back it up if you want to preserve user data.

## Environment Variables

- `PORT` - Server port (default: 8787)
- `CYBERDECK_JWT_SECRET` - Secret for signing JWT tokens (default: change-this-secret-for-production)

In production, **always set a secure JWT secret**:

```bash
CYBERDECK_JWT_SECRET=your-secure-secret-here npm run backend
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Log in
- `POST /api/auth/logout` - Log out
- `GET /api/me` - Get current user (requires auth)

### Profile

- `PUT /api/profile` - Update profile (requires auth)
- `GET /api/network` - Get incoming requests and friends (requires auth)

### Friends

- `POST /api/friends/request` - Send friend request (requires auth)
- `PATCH /api/friends/request/:id` - Accept/reject request (requires auth)
- `DELETE /api/friends/request/:id` - Remove friend (requires auth)
- `PATCH /api/friends/request/:id/trust` - Mark/unmark as trusted (requires auth)

## Troubleshooting

### "Connection saved locally" but things don't work

- Make sure the backend is actually running (you should see logs)
- Check that the URL is correct (http://localhost:8787, not https)
- Try clicking **Refresh** after saving

### "Log in first" error

- Make sure you've created an account
- If you created an account before, try logging in with those credentials
- Check that your session hasn't expired

### Data is lost

- The JSON file at `backend/data/social-db.json` contains all data
- If deleted, create a new account and start fresh
- You can back up this file to preserve user data
