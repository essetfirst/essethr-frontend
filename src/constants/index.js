import moment from "moment";

export const CURRENT_MONTH_START_DATE = new Date(
  moment().startOf("month").format("YYYY-MM-DD")
);
export const CURRENT_MONTH_END_DATE = new Date(
  moment().endOf("month").format("YYYY-MM-DD")
);
export const CURRENT_YEAR_START_DATE = new Date(
  moment().startOf("year").format("YYYY-MM-DD")
);
export const CURRENT_YEAR_END_DATE = new Date(
  moment().endOf("year").format("YYYY-MM-DD")
);
export const CURRENT_DATE = new Date(moment().format("YYYY-MM-DD"));
export const CURRENT_MONTH = moment().format("MMMM");
export const CURRENT_YEAR = moment().format("YYYY");
export const CURRENT_MONTH_YEAR = moment().format("MMMM YYYY");
export const CURRENT_DATE_TIME = moment().format("YYYY-MM-DD HH:mm:ss");
export const CURRENT_DATE_TIME_FORMAT = moment().format("YYYY-MM-DD HH:mm");
