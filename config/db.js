// Import mongoose (MongoDB library)
const mongoose = require('mongoose');

// Database name used when the connection string does not contain one.
// Atlas connection strings WITHOUT a database name silently fall back to the
// "test" database (collections auto-created but empty), which makes the
// deployed API look empty: /api/projects -> [], /api/blogs -> [],
// /api/profile -> "Admin not found", even though all the data lives in
// portfolioDB. Forcing an explicit name makes that misconfiguration harmless.
const DEFAULT_DB_NAME = process.env.DB_NAME || 'portfolioDB';

// Adds the database name to a connection string that has none.
// Plain string surgery -> credentials are never re-encoded.
const applyDatabaseName = (uri) => {
  if (!uri || typeof uri !== 'string') return { uri, changed: false };

  const schemeSplit = uri.split('://');
  if (schemeSplit.length !== 2) return { uri, changed: false };

  const [scheme, rest] = schemeSplit;
  const queryIndex = rest.indexOf('?');
  const beforeQuery = queryIndex === -1 ? rest : rest.slice(0, queryIndex);
  const query = queryIndex === -1 ? '' : rest.slice(queryIndex);

  const slashIndex = beforeQuery.indexOf('/');
  const dbName = slashIndex === -1 ? null : beforeQuery.slice(slashIndex + 1);

  // Database name already present -> leave the connection string untouched
  if (dbName) return { uri, changed: false };

  const withDb =
    slashIndex === -1
      ? `${beforeQuery}/${DEFAULT_DB_NAME}`
      : `${beforeQuery}${DEFAULT_DB_NAME}`;

  return { uri: `${scheme}://${withDb}${query}`, changed: true };
};

// Function to connect to MongoDB
const connectDB = async () => {
  const { uri, changed } = applyDatabaseName(process.env.MONGO_URI);

  if (changed) {
    console.warn(
      `⚠️  MONGO_URI has no database name -> using "${DEFAULT_DB_NAME}"`
    );
    console.warn('   (set the full MONGO_URI in the hosting dashboard)');
  }

  try {
    // Connect to MongoDB using connection string from .env
    const conn = await mongoose.connect(uri);

    // Success message
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
  } catch (error) {
    // If connection fails, show error and exit
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

// Export so we can use in server.js
module.exports = connectDB;
// Exported for testing
module.exports.applyDatabaseName = applyDatabaseName;