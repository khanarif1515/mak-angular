export default async (req, res) => {
  const { app } = await import('../dist/server/server.mjs');
  return app(req, res);
};