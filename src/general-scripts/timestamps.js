export function formatTimestamp(timestamp){
  let createdAt = new Date(Date.parse(timestamp));
  let currentDate = new Date(Date.now());
  let createdAtTimeZoneOffset = createdAt.getTimezoneOffset();
  let currentTimeZoneOffset = currentDate.getTimezoneOffset();
  let timeZoneOffsetDifference =
    currentTimeZoneOffset - createdAtTimeZoneOffset;

  createdAt.setTime(
    createdAt.getTime() - timeZoneOffsetDifference * 60 * 1000
  );

  let formattedDate = {
    day: createdAt.getDate(),
    month: createdAt.getMonth(),
    year: createdAt.getFullYear(),
    hours: createdAt.getHours(),
    minutes: createdAt.getMinutes()
  }

  if (createdAt.getDate() == currentDate.getDate() &&
    createdAt.getMonth() == currentDate.getMonth() &&
    createdAt.getFullYear() == currentDate.getFullYear()) {
    formattedDate.when = "today";
  } else {
    createdAt.setDate(createdAt.getDate() + 1);

    if (createdAt.getDate() == currentDate.getDate() &&
      createdAt.getMonth() == currentDate.getMonth() &&
      createdAt.getFullYear() == currentDate.getFullYear()) {
      formattedDate.when = "yesterday";
    } else {
      formattedDate.when = "none";
    }
  }
  return formattedDate;
}