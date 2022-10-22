import { renderMapOnDateChange } from "./index.js";
import { calculateDiffDate, formatDate, formatDateStrToKey } from "./utils.js";

const pathInput = document.querySelectorAll(".path-radio-input input");
const rangeInput = document.querySelectorAll(".date-range-input input");
const valueInput = document.querySelectorAll(".date-value-input input");
const dateRange = document.querySelector(".date-slider .progress");
const animationSlider = document.querySelector(".animation-slider input");

pathInput.forEach((input) => {
  input.oninput = (e) => {
    const value = e.target.value;
    document.getElementById("path_off").checked = value === "off";
    document.getElementById("path_on").checked = value === "on";
    if (valueInput[0].min && valueInput[1].max) {
      renderMapOnDateChange(formatDateStrToKey(valueInput[0].min));
    }
  };
});

valueInput.forEach((input) => {
  input.oninput = (e) => {
    if (valueInput[0].min && valueInput[1].max) {
      if (e.target.id === "min_date_input") {
        const diffDate = calculateDiffDate(valueInput[0].min, e.target.value);
        rangeInput[0].value = diffDate;
        dateRange.style.left = (diffDate / rangeInput[0].max) * 100 + "%";
        renderMapOnDateChange(formatDateStrToKey(e.target.value));
      } else {
        const diffDate = calculateDiffDate(e.target.value, valueInput[1].max);
        rangeInput[1].value = rangeInput[1].max - diffDate;
        dateRange.style.right = (diffDate / rangeInput[1].max) * 100 + "%";
      }
    }
  };
});

rangeInput.forEach((input) => {
  input.oninput = (e) => {
    let inc = parseInt(e.target.value, 10);
    if (valueInput[0].min && valueInput[1].max) {
      if (e.target.id === "min_date_range") {
        const minDateValue = new Date(valueInput[0].min);
        minDateValue.setDate(minDateValue.getDate() + inc);

        valueInput[0].value = formatDate(minDateValue);
        dateRange.style.left = (Math.abs(inc) / rangeInput[0].max) * 100 + "%";
        renderMapOnDateChange(formatDateStrToKey(valueInput[0].value));
      } else {
        inc -= rangeInput[1].max;
        const maxDateValue = new Date(valueInput[1].max);
        maxDateValue.setDate(maxDateValue.getDate() + inc);

        valueInput[1].value = formatDate(maxDateValue);
        dateRange.style.right = (Math.abs(inc) / rangeInput[1].max) * 100 + "%";
      }
    }
  };
});

animationSlider.onclick = function () {
  let start = Date.now();
  let timer = setInterval(function () {
    let timePassed = Date.now() - start;
    let startVal = parseInt(animationSlider.value, 10);
    animationSlider.value = startVal + 5;
    if (timePassed > 5000) clearInterval(timer);
  }, 1000);
};
