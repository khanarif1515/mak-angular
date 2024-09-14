const serverlessExpress = require('@codegenie/serverless-express');

let serverProxy;

async function setup() {
  try {
    const server = await import("./dist/mak-angular/server/server.mjs");
    const app = await server.app();
    serverProxy = serverlessExpress.createServer(app);
  } catch (error) {
    console.error("Failed to import app:", error);
    throw error;
  }
}

exports.handler = async (event, context) => {
  if (!serverProxy) {
    await setup();
  }
  return serverlessExpress.proxy(serverProxy, event, context);
};