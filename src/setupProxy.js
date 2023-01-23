// proxy.js
// import the proxy middleware
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = async function (app) {
  try {
    await app.use(
      "/api",
      createProxyMiddleware({
        // specify the port the API server is running on
        target: "https://essethr-backend-staging.herokuapp.com",
        changeOrigin: true,
      })
    );
  } catch (error) {
    console.error("Proxy error: ", error);
  }
};
