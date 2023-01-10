// proxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = async function (app) {
  await app.use(
    "/api",
    createProxyMiddleware({
      // proxy to the backend server
      target: "https://essethr-backend-staging.herokuapp.com",
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log("Proxying request to:", req.originalUrl);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log("Proxying response to:", req.originalUrl);
      },
    })
  );
};

// // https://essethr.herokuapp.com
