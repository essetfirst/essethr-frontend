const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = async function (app) {
  try {
    await app.use(
      "/api",
      createProxyMiddleware({
        target: `${process.env.REACT_APP_API_URL}`,
        changeOrigin: true,
      })
    );
  } catch (err) {}
};
