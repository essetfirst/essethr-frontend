import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { TextField, MenuItem } from "@mui/material";
import { LOCALES, useLocale } from "i18n";

export default function LocaleSwitcher({ className }) {
  const { locale, switchLocale } = useLocale();
  const intl = useIntl();

  return (
    <TextField
      select
      size="small"
      value={locale}
      onChange={(e) => switchLocale(e.target.value)}
      className={className}
      label={intl.formatMessage({ id: "common.language", defaultMessage: "Language" })}
      InputProps={{ style: { color: "#fff" } }}
      InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
    >
      {Object.entries(LOCALES).map(([code, cfg]) => (
        <MenuItem key={code} value={code}>
          {cfg.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

LocaleSwitcher.propTypes = {
  className: PropTypes.string,
};
