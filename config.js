"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/mongoose-blog-app";
exports.PORT = process.env.PORT || 8080;
