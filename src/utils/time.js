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

/*
  - give schedule date and compare it with today, return schedule text
  - input: schedule (type UTC Date)
*/
export function setScheduleDate(schedule) {
  if (schedule === null) return ''; // user not set schedule
  let scheduleText = '';
  // convert UTC to local
  const scheduleSet = new Date(schedule);
  const scheduleDate = scheduleSet.getDate();
  const scheduleMonth = scheduleSet.getMonth() + 1;
  const scheduleYear = scheduleSet.getFullYear();

  const d = new Date();
  const date = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

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
            const d = new Date(
              `${scheduleYear}-${scheduleMonth}-${scheduleDate}`
            );
            scheduleText = dayNames[d.getDay()];
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
              const d = new Date(
                `${scheduleYear}-${scheduleMonth}-${scheduleDate}`
              );
              scheduleText = dayNames[d.getDay()];
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
          const d = new Date(
            `${scheduleYear}-${scheduleMonth}-${scheduleDate}`
          );
          scheduleText = dayNames[d.getDay()];
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
}

export function getCurrentDateUTC() {
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
  };
}

export function getCurrentDate() {
  const d = new Date();
  return {
    day: dayNames[d.getDay()],
    date: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds()
  };
}

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
}

function trans2Date(d) {
  // custom format you want return
  const { date, month, year } = d;
  return new Date(`${year}-${month}-${date}`);
}

export function getWeekByDate(inputDate) {
  let d = inputDate;
  if (d === 'today') d = new Date();
  console.log('input date:', d);

  const day = d.getDay();
  const date = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  const maxPrevDay = 6;
  let monday = null; // start day of week
  let arrWeekDay = [];

  const prefix = day === 0 ? maxPrevDay : day - 1;
  monday = date - prefix;

  if (monday <= 0) {
    // has monday at previous month
    const prevMonth = month === 1 ? 12 : month - 1;
    const y = month === 1 ? year - 1 : year;
    const maxDatePrevMonth = getLastDateOfMonth(prevMonth, y);
    monday = maxDatePrevMonth + date - prefix;

    for (let i = monday; i <= monday + maxPrevDay; i++) {
      if (i > maxDatePrevMonth) {
        // date at current month
        arrWeekDay.push(
          trans2Date({
            year,
            date: i - maxDatePrevMonth,
            month
          })
        );
      } else {
        // date at prev month
        arrWeekDay.push(
          trans2Date({
            year: y,
            date: i,
            month: prevMonth
          })
        );
      }
    }
  } else {
    const maxDateCurrentMonth = getLastDateOfMonth(month, year);
    for (let i = monday; i <= monday + maxPrevDay; i++) {
      if (i > maxDateCurrentMonth) {
        // date at next month
        arrWeekDay.push(
          trans2Date({
            year: month === 12 ? year + 1 : year,
            date: i - maxDateCurrentMonth,
            month: month === 12 ? 1 : month + 1
          })
        );
      } else {
        // date at current month
        arrWeekDay.push(trans2Date({ year, date: i, month }));
      }
    }
  }
  return arrWeekDay;
}

/*
  - use local time when calculating, get current date and return today, tomorrow and nextweek (monday)
  - input: currentDate (type Date)
*/
export function getSuggestScheduleDate(curDate) {
  if (curDate === null || typeof curDate === 'undefined') {
    curDate = new Date();
    curDate.setHours(0, 0, 0, 0);
  }

  let result = {};
  const day = curDate.getDay();
  const date = curDate.getDate();
  const month = curDate.getMonth() + 1;
  const year = curDate.getFullYear();

  result.nodate = null;
  // get today
  result.today = curDate;
  // tomorrow
  let date_02 = date + 1;
  let month_02 = month;
  let year_02 = year;
  const lastDate = getLastDateOfMonth(month, year);
  if (date_02 > lastDate) {
    date_02 = 1;
    if (month_02 === 12) {
      month_02 = 1;
      year_02 += 1;
    } else month_02 += 1;
  }

  result.tomorrow = trans2Date({
    date: date_02,
    month: month_02,
    year: year_02
  });
  // next week
  const prefix = day === 0 ? 1 : 8 - day;
  let date_03 = date + prefix;
  let month_03 = month;
  let year_03 = year;
  if (date_03 > lastDate) {
    if (month_03 === 12) {
      month_03 = 1;
      year_03 += 1;
    } else month_03 += 1;
  }

  result.nextweek = trans2Date({
    date: date_03,
    month: month_03,
    year: year_03
  });
  return result;
}
