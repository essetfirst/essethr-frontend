const { createProxyMiddleware } = require("http-proxy-middleware");

/** Fallback when requests use relative `/api/...` only. If `REACT_APP_API_URL` is set, `src/api/request.js` uses absolute URLs and bypasses this proxy. */
module.exports = async function (app) {
  const target =
    process.env.REACT_APP_API_URL || "http://127.0.0.1:4000";
  try {
    app.use(
      "/api",
      createProxyMiddleware({
        target,
        changeOrigin: true,
      })
    );
  } catch (err) {
    console.warn("setupProxy failed:", err);
  }
};
