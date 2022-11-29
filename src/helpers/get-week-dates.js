export default function getWeekDates(referenceDate = new Date(), offset = 0) {
  // console.log("[getWeekDates]: Line 2 -> referenceDate: ", referenceDate);
  let curr = new Date(
    new Date().setDate(
      new Date(referenceDate).getDate() + Math.floor(offset * 7)
    )
  );
  let week = [];

  for (let i = 1; i <= 7; i++) {
    const first = curr.getDate() - curr.getDay() + i;
    // console.log("[getWeekDates]: Line 12 -> first: ", first);
    const day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
    // console.log("[getWeekDates]: Line 14 -> day: ", day);
    week.push(day);
  }

  return week;
}
