function refreshPage() {
  window.location.reload();
}

function redirect(url) {
  window.location.href = url;
}

function setPageTitle(title) {
  document.title = title;
}

function getDateTimeToday() {
  var currentDateTime = new Date();
  return currentDateTime;
}

function getDateToday() {
  const date = new Date();
  let d = date.getDate();
  let m = date.getMonth() + 1;
  let y = date.getFullYear();
  // This arrangement can be altered based on how we want the date's format to appear.
  let response = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  return response;
}

function getDateMinusDays(daysToMinus) {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - daysToMinus);

  const year = sevenDaysAgo.getFullYear();
  const month = String(sevenDaysAgo.getMonth() + 1).padStart(2, '0');
  const day = String(sevenDaysAgo.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function removeTime(dateTime) {
  // FORMAT = 12/12/1955 12:00:00 AM
  if (dateTime.split(' ')[1] !== undefined) {
    return dateTime.split(' ')[0];
  }
  // FORMAT = 2023-05-05T00:00:00.000Z
  return dateTime.slice(0, 10);
}

function toCapitalizedCase(str) {
  // Split the string into an array of words
  let words = str.split(' ');

  // Iterate over each word and capitalize the first letter
  for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }

  // Join the words back into a single string
  return words.join(' ');
}

function convertToReadableFormatDate(dateTimeOrDate) {
  let dateOnly = dateTimeOrDate;
  if (dateTimeOrDate.length > 10) {
    dateOnly = removeTime(dateTimeOrDate);
  }
  let year = dateOnly.split('-')[0];
  let day = dateOnly.split('-')[2];
  let date = new Date(dateOnly);
  let monthWord = date.toLocaleString('default', { month: 'short' });
  let response = monthWord + " " + day + ", " + year;
  return response;
}


function convertToReadableFormatDateTime(dateTimeValue) {

  var date = new Date(dateTimeValue);
  var hours = date.getHours();
  var minutes = date.getMinutes();

  // Check whether AM or PM
  var newformat = hours >= 12 ? "PM" : "AM";

  // Find current hour in AM-PM Format
  hours = hours % 12;

  // To display "0" as "12"
  hours = hours ? hours : 12;

  // Ensure hours and minutes are in two-digit format
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  let timeFormatted = hours + ":" + minutes + " " + newformat;

  let formattedDate = convertToReadableFormatDate(dateTimeValue);

  let response = formattedDate + " / " + timeFormatted;
  return response;
}

function correctDate(utcDateTime) {
  const numberOfDay = 1;
  // convert to local date
  let dateOnly = new Date(removeTime(utcDateTime));
  // toISOString() = convert to utc date time
  let response = addDays(dateOnly, numberOfDay).toISOString();
  return response;
}

function daysBetweenTwoDates(dateOne, dateTwo) {
  let date1 = new Date(dateOne);
  let date2 = new Date(dateTwo);

  let difference = date1.getTime() - date2.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
}

function addDays(theDate, days) {
  return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
}

function toNumber(stringVariable) {
  return Number(stringVariable);
}

function delay(ms) {
  return new Promise((res) => setTimeout(() => res(), ms))
}

function disablePointerEvents(duration) {
  document.body.classList.add('disable-pointer-events');

  setTimeout(() => {
    document.body.classList.remove('disable-pointer-events');
  }, duration);
}

function enablePointerEvents(duration) {
  document.body.classList.remove('disable-pointer-events');
}

function getDateRangeSearch(dateRangeSearch = null) {
  let dateToday = getDateToday();
  let dateTodayMinus7Days = getDateMinusDays(7);
  const response = {
    other_requests: {
      pending: {
        date_from: dateRangeSearch === null ? dateTodayMinus7Days : dateRangeSearch.other_requests.pending.date_from,
        date_to: dateRangeSearch === null ? dateToday : dateRangeSearch.other_requests.pending.date_to,
      },
      my_approved: {
        date_from: dateRangeSearch === null ? dateTodayMinus7Days : dateRangeSearch.other_requests.my_approved.date_from,
        date_to: dateRangeSearch === null ? dateToday : dateRangeSearch.other_requests.my_approved.date_to,
      },
    },

  };
  return response;
}

import { Notify } from 'quasar'

function showErrorMessage(error, withRefresh = true) {
  let message = "";
  if (error.message === "Network Error" || error.message === "timeout of " + process.env.BACKEND_REST_API_TIMEOUT + "ms exceeded") {
    message = "You can't use this app outside of UERM area. This app will only work at UERM area."
  }
  else {
    message = (error.response === undefined) ? error.message : error.response.data;
  }

  if (message === undefined) {
    message = error;
  }

  if (withRefresh === true) {
    createCookie("notify_message", message);
    createCookie("notify_type", "negative");
    refreshPage();
  } else {
    Notify.create({
      message: message,
      type: "negative",
    })
  }

}

function createCookie(cookieName, value, expires = "") {
  const semiColon = ";";
  const equal = "=";
  let expiration = expires === "" ? "" : "expires=" + expires + semiColon;
  document.cookie = cookieName + equal + value + semiColon + expiration + "path=/" + semiColon;
}

function getCookie(cookieName) {
  var match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
  if (match) return match[2];
}

function deleteCookie(cookieName) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function getControllerBase(){
  const response = "/employee-central/";
  return response;
}

function isValidNumber(stringValue) {
  const num = Number(stringValue);
  return !isNaN(num);
}

export default {
  delay,
  getDateTimeToday,
  addDays,
  toNumber,
  refreshPage,
  redirect,
  setPageTitle,
  getDateToday,
  getDateMinusDays,
  daysBetweenTwoDates,
  removeTime,
  convertToReadableFormatDate,
  convertToReadableFormatDateTime,
  correctDate,
  showErrorMessage,
  getDateRangeSearch,
  getCookie,
  createCookie,
  deleteCookie,
  isValidNumber,
  getControllerBase,
  toCapitalizedCase,
  disablePointerEvents,
  enablePointerEvents,
}
