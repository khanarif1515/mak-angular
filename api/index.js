export default async (req, res) => {
  const { app } = await import('../dist/mak/server/server.mjs');
  return app(req, res);
};