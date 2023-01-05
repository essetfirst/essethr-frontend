export const CURRENT_MONTH_START_DATE = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  0
)
  .toISOString()
  .slice(0, 10);

export const CURRENT_MONTH_END_DATE = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  -1
)
  .toISOString()
  .slice(0, 10);
