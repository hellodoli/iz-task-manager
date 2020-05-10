import { SCHEDULE_DATE } from '../constants/schedule';

export function checkLeapYear(year) {
  if (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  ) {
    return true;
  }
  return false;
}

export function getLastDateOfMonth(m, y) {
  let lastDay = 30;
  if (m === 2) {
    if (checkLeapYear(y)) {
      lastDay = 29;
    } else {
      lastDay = 28;
    }
  } else if (
    m === 1 ||
    m === 3 ||
    m === 5 ||
    m === 7 ||
    m === 8 ||
    m === 10 ||
    m === 12
  ) {
    lastDay = 31;
  } else {
    lastDay = 30;
  }
  return lastDay;
}

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const dayNames = [
  SCHEDULE_DATE.sun, // 0
  SCHEDULE_DATE.mon, // 1
  SCHEDULE_DATE.tue,
  SCHEDULE_DATE.wed,
  SCHEDULE_DATE.thurs,
  SCHEDULE_DATE.fri,
  SCHEDULE_DATE.sat // 6
];

export function setScheduleDate(schedule) {
  if (schedule === null) return ''; // user not set schedule
  let scheduleText = '';
  const scheduleSet = schedule.substring(0, 10);
  const scheduleDate = parseInt(schedule.substring(8, 10));
  const scheduleMonth = parseInt(schedule.substring(5, 7));
  const scheduleYear = parseInt(scheduleSet.substring(0, 4));

  const d = new Date();
  const date = d.getUTCDate();
  const month = d.getUTCMonth() + 1;
  const year = d.getUTCFullYear();

  const tomorrow = date + 1;
  const yesterday = date - 1;
  const next7days = date + 7;
  const lastDateOfMonth = getLastDateOfMonth(month, year);

  const subYear = scheduleYear - year;
  if (subYear === 0) {
    // same year
    const subMonth = scheduleMonth - month;
    if (subMonth < 2) {
      if (subMonth < 0) {
        // past month
        if (
          subMonth === -1 &&
          yesterday === 0 &&
          scheduleDate === getLastDateOfMonth(month - 1, year)
        ) {
          scheduleText = SCHEDULE_DATE.yesterday;
        } else {
          scheduleText = `${scheduleDate} ${monthNames[scheduleMonth - 1]}`;
        }
      } else {
        // same month
        if (subMonth === 0) {
          if (scheduleDate === date) {
            scheduleText = SCHEDULE_DATE.today;
          } else if (scheduleDate === yesterday) {
            scheduleText = SCHEDULE_DATE.yesterday;
          } else if (scheduleDate === tomorrow) {
            scheduleText = SCHEDULE_DATE.tomorrow;
          } else if (scheduleDate > tomorrow && scheduleDate <= next7days) {
            const d = new Date();
            d.setUTCDate(scheduleDate);
            scheduleText = dayNames[d.getUTCDay()];
          } else {
            scheduleText = `${scheduleDate} ${monthNames[scheduleMonth - 1]}`;
          }
        } else {
          // next 1 month
          if (tomorrow > lastDateOfMonth && scheduleDate === 1) {
            scheduleText = SCHEDULE_DATE.tomorrow;
          } else {
            const a =
              next7days > lastDateOfMonth
                ? lastDateOfMonth + scheduleDate
                : scheduleDate;
            if (a > tomorrow && a <= next7days) {
              const d = new Date();
              d.setUTCMonth(scheduleMonth - 1);
              d.setUTCDate(scheduleDate);
              scheduleText = dayNames[d.getUTCDay()];
            } else {
              scheduleText = `${scheduleDate} ${monthNames[scheduleMonth - 1]}`;
            }
          }
        }
      }
    } else {
      // next more 1 month
      scheduleText = `${scheduleDate} ${monthNames[scheduleMonth - 1]}`;
    }
  } else {
    if (subYear === 1) {
      // next 1 year
      if (
        tomorrow > lastDateOfMonth &&
        scheduleDate === 1 &&
        scheduleMonth === 1
      ) {
        scheduleText = SCHEDULE_DATE.tomorrow;
      } else {
        const a =
          next7days > lastDateOfMonth
            ? lastDateOfMonth + scheduleDate
            : scheduleDate;
        if (a > tomorrow && a <= next7days) {
          const d = new Date();
          d.setUTCFullYear(scheduleYear);
          d.setUTCMonth(scheduleMonth - 1);
          d.setUTCDate(scheduleDate);
          scheduleText = dayNames[d.getUTCDay()];
        } else {
          scheduleText = `${scheduleDate} ${
            monthNames[scheduleMonth - 1]
          } ${scheduleYear}`;
        }
      }
    } else {
      scheduleText = `${scheduleDate} ${
        monthNames[scheduleMonth - 1]
      } ${scheduleYear}`;
    }
  }
  return scheduleText;
};

export function getCurrentDateUTC () {
  const d = new Date();
  const UTCDay = d.getUTCDay();
  const curDate = d.toJSON();

  const date = parseInt(curDate.substring(8, 10));
  const month = parseInt(curDate.substring(5, 7));
  const year = parseInt(curDate.substring(0, 4));

  const hour = parseInt(curDate.substring(11, 13));
  const minute = parseInt(curDate.substring(14, 16));
  const second = parseInt(curDate.substring(17, curDate.length - 1));

  return {
    day: dayNames[UTCDay],
    date,
    month,
    year,
    hour,
    minute,
    second
  }
};

export function splitObjectByKey(splitBy, data) {
  var rowArr = [];
  var rowOb = [];
  for (let i = 0; i < data.length; i++) {
    const s = data[i][splitBy];
    if (!rowArr.includes(s)) {
      rowArr.push(s);
      rowOb.push({ [splitBy]: s, items: [data[i]] });
    } else {
      var destiny = rowArr.indexOf(s);
      rowOb[destiny].items.push(data[i]);
    }
  }
  return rowOb;
};
