// const { app } = require('../dist/mak/server/main.server.mjs');
// module.exports = app;

export default async function handler(req, res) {
  const { handler } = await import('../dist/mak/server/main.server.mjs');
  return handler(req, res);
}