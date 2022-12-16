const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = async function (app) {
  await app.use(
    "/api",
    createProxyMiddleware({
      target: "https://essethr.herokuapp.com",
      changeOrigin: true,
    })
  );
};
