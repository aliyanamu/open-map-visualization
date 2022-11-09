import { customIconURL, iconProps } from "./constants.js";
const valueInput = document.querySelectorAll(".date-value-input input");
const animationInput = document.querySelector(".animation-slider input");

export const calculateDiffDate = (minDate, maxDate) => {
  // milisecond to day
  // 1000 * 60 * 60 * 24 = 86400000
  return Math.abs(
    parseInt((new Date(maxDate) - new Date(minDate)) / 86400000, 10)
  );
};

export const customIcon = (color) => ({
  ...iconProps,
  iconUrl: customIconURL.replace("xxx", color),
});

export const formatDate = (date) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const getAnimationDateLabel = () => {
  const value = animationInput.value;
  const dateValue = new Date(valueInput[0].value);
  dateValue.setDate(dateValue.getDate() + parseInt(value, 10));
  return formatDate(dateValue);
};

export const setInitDateRange = () => {
  const storedMinDate = localStorage.getItem("minDate");
  const storedMaxDate = localStorage.getItem("maxDate");
  const date = new Date();
  const minDate = storedMinDate ? storedMinDate : formatDate(date);
  const maxDate = storedMaxDate
    ? storedMaxDate
    : formatDate(date.setDate(date.getDate() + 10));
  setDateRange({ minDate, maxDate });
};

export const setDateRange = ({ minDate, maxDate }) => {
  if (minDate) {
    valueInput[0].value = minDate;
    valueInput[1].min = minDate;
    localStorage.setItem("minDate", minDate);
  }
  if (maxDate) {
    valueInput[0].max = maxDate;
    valueInput[1].value = maxDate;
    localStorage.setItem("maxDate", maxDate);
  }
  setAnimationRange({
    maxValue: calculateDiffDate(valueInput[0].value, valueInput[1].value),
  });
};

export const setAnimationRange = ({ minValue, maxValue }) => {
  minValue = minValue || 0;
  animationInput.min = minValue;
  animationInput.value = minValue;
  animationInput.max = maxValue;
};
