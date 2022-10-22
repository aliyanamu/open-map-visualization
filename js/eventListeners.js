import { renderMapOnDateChange, togglePath } from "./index.js";
import {
  calculateDiffDate,
  formatDate,
  formatDateStrToKey,
  resetAnimationRange,
  resetDateRange,
} from "./utils.js";

const pathInput = document.querySelectorAll(".path-radio-input input");
const rangeInput = document.querySelectorAll(".date-range-input input");
const valueInput = document.querySelectorAll(".date-value-input input");
const dateRange = document.querySelector(".date-slider .progress");
const playSpeedInput = document.querySelector(".playback-speed-input input");
const animationSlider = document.querySelector(".animation-slider input");
const animationButton = document.querySelector(".animation-slider button");
const refreshButton = document.querySelector(".animation-slider .refresh");
let animationTimer;

const isAnimationPlaying = () => {
  const initSliderValue = parseInt(animationSlider.value, 10);
  return initSliderValue > parseInt(animationSlider.min, 10);
};

const getInitDateValue = () => {
  const initSliderValue = parseInt(animationSlider.value, 10);
  const initDateValue = new Date(valueInput[0].min);
  if (isAnimationPlaying()) {
    initDateValue.setDate(initDateValue.getDate() + initSliderValue);
  }
  return initDateValue;
};

const animate = (timer = 5000, playSpeed = 1000) => {
  const start = Date.now();
  const initDateValue = getInitDateValue();
  const initSliderValue = parseInt(animationSlider.value, 10);

  animationTimer = setInterval(function () {
    const timePassed = Date.now() - start;
    if (initSliderValue < parseInt(animationSlider.max, 10)) {
      initDateValue.setDate(initDateValue.getDate() + 1);
      const dateValue = formatDate(initDateValue);
      renderMapOnDateChange(formatDateStrToKey(dateValue));
      animationSlider.value = parseInt(animationSlider.value, 10) + 1;
    }
    if (timePassed > timer) {
      toggleAnimatonBtn();
      clearInterval(animationTimer);
    }
  }, playSpeed);
};

const hasClass = (element, className) => {
  return (" " + element.className + " ").indexOf(" " + className + " ") > -1;
};

const toggleAnimatonBtn = () => {
  animationButton.classList.toggle("playing");
};

pathInput.forEach((input) => {
  input.oninput = (e) => {
    const value = e.target.value;
    document.getElementById("path_off").checked = value === "off";
    document.getElementById("path_on").checked = value === "on";
    if (valueInput[0].min && valueInput[1].max) {
      const initDate = formatDate(getInitDateValue());
      togglePath(formatDateStrToKey(initDate));
    }
  };
});

valueInput.forEach((input) => {
  input.onclick = () => {
    if (!(valueInput[0].min && valueInput[1].max)) {
      alert("Please select a file before setting up the date");
    }
    if (valueInput[0].min && valueInput[1].max && isAnimationPlaying()) {
      alert(
        "There's already animation playing. Please restart the animation first"
      );
    }
  };
  input.oninput = (e) => {
    if (valueInput[0].min && valueInput[1].max && !isAnimationPlaying()) {
      if (e.target.id === "min_date_input") {
        const diffDate = calculateDiffDate(valueInput[0].min, e.target.value);
        rangeInput[0].value = diffDate;
        dateRange.style.left = (diffDate / rangeInput[0].max) * 100 + "%";
        renderMapOnDateChange(formatDateStrToKey(e.target.value));
        // resetAnimationRange(rangeInput[0].value, rangeInput[1].value);
      } else {
        const diffDate = calculateDiffDate(e.target.value, valueInput[1].max);
        rangeInput[1].value = rangeInput[1].max - diffDate;
        dateRange.style.right = (diffDate / rangeInput[1].max) * 100 + "%";
        // resetAnimationRange(rangeInput[0].value, rangeInput[1].value);
      }
    }
  };
});

rangeInput.forEach((input) => {
  input.onchange = () => {
    if (!(valueInput[0].min && valueInput[1].max)) {
      alert("Please select a file before setting up the date");
      resetDateRange(100);
    }
    if (valueInput[0].min && valueInput[1].max && isAnimationPlaying()) {
      alert(
        "There's already animation playing. Please restart the animation first"
      );
      resetDateRange(rangeInput[1].max);
    }
  };
  input.oninput = (e) => {
    let inc = parseInt(e.target.value, 10);
    if (valueInput[0].min && valueInput[1].max && !isAnimationPlaying()) {
      if (e.target.id === "min_date_range") {
        const minDateValue = new Date(valueInput[0].min);
        minDateValue.setDate(minDateValue.getDate() + inc);

        valueInput[0].value = formatDate(minDateValue);
        dateRange.style.left = (Math.abs(inc) / rangeInput[0].max) * 100 + "%";
        renderMapOnDateChange(formatDateStrToKey(valueInput[0].value));
        resetAnimationRange(0, rangeInput[0].max - inc);
      } else {
        inc -= rangeInput[1].max;
        const maxDateValue = new Date(valueInput[1].max);
        maxDateValue.setDate(maxDateValue.getDate() + inc);

        valueInput[1].value = formatDate(maxDateValue);
        dateRange.style.right = (Math.abs(inc) / rangeInput[1].max) * 100 + "%";
        resetAnimationRange(rangeInput[0].value, rangeInput[1].value);
      }
    }
  };
});

animationButton.onclick = () => {
  if (!(valueInput[0].min && valueInput[1].max)) {
    alert("Please select a file before starting the animation");
    return;
  }
  const playSpeed = playSpeedInput.value;

  if (hasClass(animationButton, "playing")) {
    clearInterval(animationTimer);
  } else {
    const timer =
      (parseInt(animationSlider.max, 10) -
        parseInt(animationSlider.value, 10)) *
      playSpeed;
    animate(timer, playSpeed);
  }

  toggleAnimatonBtn();
};

refreshButton.onclick = () => {
  clearInterval(animationTimer);
  resetAnimationRange(0, parseInt(animationSlider.max, 10));
  animationButton.classList.remove("playing");
  if (valueInput[0].min && valueInput[1].max) {
    renderMapOnDateChange(formatDateStrToKey(valueInput[0].value));
  }
};
