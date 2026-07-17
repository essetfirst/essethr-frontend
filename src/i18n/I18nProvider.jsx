import React from "react";
import PropTypes from "prop-types";
import { IntlProvider } from "react-intl";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_STORAGE_KEY,
  flattenMessages,
  getStoredLocale,
} from "./config";

export function I18nProvider({ children, locale: localeProp }) {
  const [locale, setLocale] = React.useState(localeProp || getStoredLocale());

  React.useEffect(() => {
    if (localeProp) setLocale(localeProp);
  }, [localeProp]);

  const config = LOCALES[locale] || LOCALES[DEFAULT_LOCALE];
  const messages = flattenMessages(config.messages);

  const switchLocale = React.useCallback((next) => {
    if (!LOCALES[next]) return;
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
    setLocale(next);
  }, []);

  return (
    <IntlProvider locale={locale} messages={messages} defaultLocale={DEFAULT_LOCALE}>
      <LocaleContext.Provider value={{ locale, switchLocale, dir: config.dir }}>
        {children}
      </LocaleContext.Provider>
    </IntlProvider>
  );
}

const LocaleContext = React.createContext({
  locale: DEFAULT_LOCALE,
  switchLocale: () => {},
  dir: "ltr",
});

export function useLocale() {
  return React.useContext(LocaleContext);
}

I18nProvider.propTypes = {
  children: PropTypes.node,
  locale: PropTypes.string,
};

export default I18nProvider;
