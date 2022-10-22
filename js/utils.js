const rangeInput = document.querySelectorAll(".date-range-input input");
const valueInput = document.querySelectorAll(".date-value-input input");
const animationInput = document.querySelector(".animation-slider input");
const range = document.querySelector(".date-slider .progress");

export const calculateDiffDate = (minDate, maxDate) => {
  // milisecond to day
  // 1000 * 60 * 60 * 24 = 86400000
  return Math.abs(
    parseInt((new Date(maxDate) - new Date(minDate)) / 86400000, 10)
  );
};

export const formatDate = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const formatKeyToDateStr = (key) => {
  const year = key.substring(0, 4);
  const month = key.substring(4, 6);
  const date = key.substring(6, 8);
  return `${year}-${month}-${date}`;
};

export const formatDateStrToKey = (dateString) => {
  return dateString.split("-").join("");
};

export const transformMapData = (mapDataByDate) => {
  let minDate, maxDate, diffDate;
  const sortDates = Object.keys(mapDataByDate).sort();
  return sortDates.reduce(
    (obj, key, index) => {
      if (index === 0) {
        minDate = formatKeyToDateStr(key);
        valueInput[0].value = minDate;
        valueInput[0].min = minDate;
        valueInput[1].min = minDate;
        obj.initData = mapDataByDate[key];
      }
      if (index === sortDates.length - 1) {
        maxDate = formatKeyToDateStr(key);
        diffDate = calculateDiffDate(minDate, maxDate);
        valueInput[0].max = maxDate;
        valueInput[1].value = maxDate;
        valueInput[1].max = maxDate;
        resetDateRange(diffDate);
        resetAnimationRange(0, diffDate);
      }

      obj.sortedMapData[key] = mapDataByDate[key];
      return obj;
    },
    { initData: {}, sortedMapData: [] }
  );
};

export const resetDateRange = (maxValue) => {
  rangeInput[0].min = 0;
  rangeInput[0].max = maxValue;
  rangeInput[0].value = 0;
  rangeInput[1].min = 0;
  rangeInput[1].max = maxValue;
  rangeInput[1].value = maxValue;
  range.style.left = "0%";
  range.style.right = "0%";
};

export const resetAnimationRange = (minValue = 0, maxValue) => {
  animationInput.min = minValue;
  animationInput.max = maxValue;
  animationInput.value = minValue;
};
