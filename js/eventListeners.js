import { renderMapOnDateChange, togglePath } from "./index.js";
import {
  getAnimationDateLabel,
  setAnimationRange,
  setDateRange,
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

const animate = (timer = 5000, playSpeed = 1000) => {
  const start = Date.now();
  const initSliderValue = parseInt(animationSlider.value, 10);

  animationTimer = setInterval(function () {
    const timePassed = Date.now() - start;
    const initSliderMax = parseInt(animationSlider.max, 10);
    if (initSliderValue < initSliderMax) {
      animationSlider.value = parseInt(animationSlider.value, 10) + 1;
      renderMapOnDateChange();
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
  const newValue = parseInt(
    ((animationSlider.value - animationSlider.min) * 100) /
      (animationSlider.max - animationSlider.min),
    10
  );
  const newPosition = newValue * 4.6;
  if (valueInput[0].value) {
    shownValue = getAnimationDateLabel();
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
    if (valueInput[0].value && valueInput[1].value) togglePath();
  };
});

valueInput.forEach((input) => {
  input.onclick = () => {
    if (valueInput[0].value && valueInput[1].value && isAnimationPlaying()) {
      alert(
        "There's already animation playing. Please restart the animation first"
      );
    }
  };
  input.oninput = (e) => {
    if (valueInput[0].value && valueInput[1].value && !isAnimationPlaying()) {
      if (e.target.id === "min_date_input") {
        setDateRange({ minDate: e.target.value });
        renderMapOnDateChange();
      } else {
        setDateRange({ maxDate: e.target.value });
      }
    }
  };
});

animationButton.onclick = () => {
  if (!(valueInput[0].value && valueInput[1].value)) {
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
  setAnimationRange({ maxValue: parseInt(animationSlider.max, 10) });
  animationButton.classList.remove("playing");
  if (valueInput[0].value && valueInput[1].value) {
    renderMapOnDateChange();
  }
};

animationSlider.oninput = () => {
  if (valueInput[0].value && valueInput[1].value) {
    const initDate = getAnimationDateLabel();
    renderMapOnDateChange();
  }
  setAnimatioLabel();
};

animationSlider.onmousedown = () => {
  setAnimatioLabel();
};

animationSlider.onmouseup = () => {
  animationSliderLabel.innerHTML = null;
};
