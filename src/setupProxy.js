const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = async function (app) {
  try {
    await app.use(
      // redirect requests from /api to the backend server
      "/api",
      createProxyMiddleware({
        target: "https://essethr-backend-staging.herokuapp.com",
        changeOrigin: true,
      })
    );
  } catch (err) {
    console.error(err);
  }
};
