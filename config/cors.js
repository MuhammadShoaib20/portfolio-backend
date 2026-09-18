// Centralized CORS configuration
// -----------------------------------------------------------------------------
// Why this file exists:
// The old check in server.js compared the incoming Origin against
// `process.env.CLIENT_URL` only. On Render that env var is often missing, set to
// `http://localhost:3000`, or contains a trailing slash / trailing newline -
// and an exact `indexOf` comparison then fails, producing:
//   ❌ Not allowed by CORS
// Here every origin is NORMALIZED (trimmed, trailing slash removed, lowercased)
// and the production Vercel URL is always whitelisted, so it works even if the
// env var is missing or mis-typed in the hosting dashboard.
// -----------------------------------------------------------------------------

const cors = require('cors');

// Load .env as well, so this module works even when it is required before
// dotenv.config() runs in server.js
require('dotenv').config();

// Production frontend (Vercel). Hard-coded on purpose -> CORS can never break
// because of a missing/incorrect CLIENT_URL on the hosting dashboard.
const PRODUCTION_ORIGINS = [
  'https://portfolio-frontend-two-eta.vercel.app',
];

// Local development origins
const DEVELOPMENT_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];

// Vercel preview deployments of this project, e.g.
// portfolio-frontend-two-eta-git-main-shoaib.vercel.app
// portfolio-frontend-two-eta-1a2b3c-shoaib.vercel.app
const VERCEL_PREVIEW_REGEX =
  /^https:\/\/portfolio-frontend-two-eta[a-z0-9-]*\.vercel\.app$/;

// Set ALLOW_VERCEL_PREVIEWS=false on the server to turn preview URLs off
const allowVercelPreviews = () =>
  String(process.env.ALLOW_VERCEL_PREVIEWS || 'true').toLowerCase() !== 'false';

// "https://site.com/ \n" -> "https://site.com"
const normalizeOrigin = (origin) => {
  if (typeof origin !== 'string') return '';
  return origin.trim().replace(/\/+$/, '').toLowerCase();
};

// Reads CLIENT_URL (or CLIENT_URLS for a comma separated list) and normalizes
// every entry, so extra/staging domains can be added without touching code.
const getEnvOrigins = () => {
  const raw = process.env.CLIENT_URLS || process.env.CLIENT_URL || '';
  return raw.split(',').map(normalizeOrigin).filter(Boolean);
};

// Full allow-list, de-duplicated
const getAllowedOrigins = () =>
  [
    ...new Set(
      [...getEnvOrigins(), ...PRODUCTION_ORIGINS, ...DEVELOPMENT_ORIGINS].map(
        normalizeOrigin
      )
    ),
  ];

// Single source of truth used by the cors middleware below.
// NOTE: when the origin is allowed we return `true` (not the origin string) so
// that cors reflects the RAW request origin back. Doing that keeps trailing
// slash / uppercase tolerances working, because the browser compares the
// reflected value with the exact origin string it sent.
const isAllowedOrigin = (origin) => {
  // No Origin header (Postman, curl, server-to-server, health checks) or an
  // empty Origin header -> there is nothing to validate
  if (!origin || !String(origin).trim()) return true;

  const normalized = normalizeOrigin(origin);
  if (!normalized) return false;

  if (getAllowedOrigins().includes(normalized)) return true;

  return allowVercelPreviews() && VERCEL_PREVIEW_REGEX.test(normalized);
};

const corsOptions = {
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    // Clear diagnostics in the Render logs instead of a generic 500 error
    console.warn(`🚫 CORS blocked origin: ${origin}`);
    console.warn(`   Allowed origins: ${getAllowedOrigins().join(', ')}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  maxAge: 86400, // cache preflight (OPTIONS) response for 24h
  optionsSuccessStatus: 204,
};

// Printed once on server start so the deployed allow-list is visible in logs
const logCorsConfig = () => {
  console.log('========================================');
  console.log('🔐 CORS allow-list:');
  getAllowedOrigins().forEach((origin) => console.log(`   ✅ ${origin}`));
  console.log(
    `   ✅ Vercel previews (*.vercel.app): ${
      allowVercelPreviews() ? 'enabled' : 'disabled'
    }`
  );
  console.log('========================================');
};

module.exports = {
  corsOptions,
  isAllowedOrigin,
  getAllowedOrigins,
  normalizeOrigin,
  logCorsConfig,
};
