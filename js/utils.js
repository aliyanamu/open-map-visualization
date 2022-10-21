const minDateInput = document.getElementById("min_date_input");
const minDateRange = document.getElementById("min_date_range");
const maxDateInput = document.getElementById("max_date_input");
const maxDateRange = document.getElementById("max_date_range");

export const calculateDiffDate = function (minDate, maxDate) {
  // milisecond to day
  // 1000 * 60 * 60 * 24 = 86400000
  return Math.abs(
    parseInt((new Date(maxDate) - new Date(minDate)) / 86400000, 10)
  );
};

export const formatDate = function (date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const formatKeyToDateStr = function (key) {
  const year = key.substring(0, 4);
  const month = key.substring(4, 6);
  const date = key.substring(6, 8);
  return `${year}-${month}-${date}`;
};

export const formatDateStrToKey = function (dateString) {
  return dateString.split("-").join("");
};

export const transformMapData = function (mapDataByDate) {
  let minDate, maxDate, diffDate;
  const sortDates = Object.keys(mapDataByDate).sort();
  return sortDates.reduce(
    (obj, key, index) => {
      if (index === 0) {
        minDate = formatKeyToDateStr(key);
        minDateInput.value = minDate;
        minDateInput.min = minDate;
        maxDateInput.min = minDate;
        obj.initData = mapDataByDate[key];
      }
      if (index === sortDates.length - 1) {
        maxDate = formatKeyToDateStr(key);
        diffDate = calculateDiffDate(minDate, maxDate);
        minDateInput.max = maxDate;
        maxDateInput.value = maxDate;
        maxDateInput.max = maxDate;
        minDateRange.setAttribute("max", diffDate);
        maxDateRange.setAttribute("max", diffDate);
        maxDateRange.setAttribute("value", diffDate);
      }

      obj.sortedMapData[key] = mapDataByDate[key];
      return obj;
    },
    { initData: {}, sortedMapData: [] }
  );
};
