import locales from "./locales";

const config = {
  getDefaultRoutes: () => [],
  getLocales: () => locales,
  auth: {
    persistKey: "auth",
    signinURL: "/login",
    redirectURL: "/",
  },
};
export default config;
