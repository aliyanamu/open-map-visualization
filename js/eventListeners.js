import { renderMapOnDateChange, togglePath } from "./index.js";
import {
  formatDate,
  formatDateStrToKey,
  resetAnimationRange,
} from "./utils.js";

const pathInput = document.querySelectorAll(".path-radio-input input");
const valueInput = document.querySelectorAll(".date-value-input input");
const playSpeedInput = document.querySelector(".playback-speed-input input");
const animationSlider = document.querySelector(".animation-slider input");
const animationSliderLabel = document.querySelector(
  ".animation-slider .range-label"
);
const animationButton = document.querySelector(".animation-slider button");
const refreshButton = document.querySelector(".animation-slider .refresh");
let animationTimer;

const isAnimationPlaying = () => {
  const initSliderValue = parseInt(animationSlider.value, 10);
  return initSliderValue > parseInt(animationSlider.min, 10);
};

const getInitDateValue = () => {
  const initSliderValue = parseInt(animationSlider.value, 10);
  const initDateValue = new Date(valueInput[0].value);
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
    const initSliderMax = parseInt(animationSlider.max, 10);
    if (initSliderValue < initSliderMax) {
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

const setAnimatioLabel = () => {
  let shownValue;
  const newValue = Number(
    ((animationSlider.value - animationSlider.min) * 100) /
      (animationSlider.max - animationSlider.min)
  );
  const newPosition = newValue * 4.6;
  if (valueInput[0].value) {
    const minDateValue = new Date(valueInput[0].value);
    minDateValue.setDate(
      minDateValue.getDate() + parseInt(animationSlider.value, 10)
    );
    shownValue = formatDate(minDateValue);
  } else {
    shownValue = animationSlider.value;
  }
  animationSliderLabel.innerHTML = `<span>${shownValue}</span>`;
  animationSliderLabel.style.marginLeft = `${newPosition}px`;
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
        renderMapOnDateChange(formatDateStrToKey(e.target.value));
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

animationSlider.oninput = () => {
  if (valueInput[0].min && valueInput[1].max) {
    const initDate = formatDate(getInitDateValue());
    renderMapOnDateChange(formatDateStrToKey(initDate));
  }
  setAnimatioLabel();
};

animationSlider.onmousedown = () => {
  setAnimatioLabel();
};

animationSlider.onmouseup = () => {
  animationSliderLabel.innerHTML = null;
};
