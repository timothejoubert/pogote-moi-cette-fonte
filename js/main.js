// console.clear();

Splitting();

select = (e) => document.querySelector(e);
selectAll = (e) => document.querySelectorAll(e);

/********* */
/* loading */
/********* */
window.scrollTo(0, 0);
select(".welcome").classList.add("active-loading");
window.addEventListener("DOMContentLoaded", (event) => {
  console.log(event, "DOMContentLoaded");

  setTimeout(removeLoading, 3000);
});

function removeLoading() {
  console.log("remove loading function");
  select(".intro-site-txt").classList.remove("load-site");
  select(".welcome").classList.add("remove");
  select(".intro-second-part").classList.add("second-part-active");
  initGui();
}

select("#close-intro-btn").addEventListener("click", () => {
  select(".intro-site").style.transform = "translateY(-100%)";
  select("body").classList.remove("loading-container");
});

const pointer = select("#mouse");
const spanX = select("#posX");
const spanY = select("#posY");
const GridSection = select("#article-grid");

let mouseX = window.innerWidth / 2,
  mouseY = window.innerHeight / 2;

let cursor = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  update: function () {
    if (GridSection.getBoundingClientRect().top - window.innerHeight < 0) {
      l = this.x;
      t = this.y + window.pageYOffset;
      pointer.style.left = l + "px";
      pointer.style.top = t + "px";
    }
  },
};

let timeout;
const tooltip = select("#tooltip-cursor");

GridSection.addEventListener("mousemove", (e) => {
  tooltip.classList.remove("minify");
  mouseX = e.clientX;
  mouseY = e.clientY;
  initValues();
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(mouseStop, 1000);
});

function mouseStop() {
  tooltip.classList.add("minify");
}
setInterval(move, 500 / 60);

function move() {
  cursor.x = lerp(cursor.x, mouseX, 0.08);
  cursor.y = lerp(cursor.y, mouseY, 0.08);
  cursor.update();
}

function initValues() {
  //init font and span
  let weight = mapRange(mouseX, 0, window.innerWidth, -100, 1000);
  spanX.innerHTML = Math.round(weight);
  document.documentElement.style.setProperty("--wghtFont", weight);

  let weightBack = mapRange(
    mouseY,
    0,
    select("#txt-grid").offsetHeight,
    -100,
    1000
  );
  spanY.innerHTML = Math.round(weightBack);
  document.documentElement.style.setProperty("--wghtBack", weightBack);
}

//change Font Shape
const spanClick = select("#spanClick");
let shapeValue = 3;
let shapeName;
displayShape(shapeValue);

GridSection.addEventListener("click", initShape);
pointer.addEventListener("click", initShape);

function initShape() {
  tooltip.classList.remove("minify");
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(mouseStop, 1000);
  shapeValue++;
  document.documentElement.style.setProperty("--shapeFont", shapeValue);
  displayShape(shapeValue);

  if (shapeValue > 3) {
    shapeValue = 0;
  }
}

function displayShape(shapeValue) {
  switch (shapeValue) {
    case 1:
      shapeName = "Horizontal";
      break;
    case 2:
      shapeName = "Vertical";
      break;
    case 3:
      shapeName = "Carré";
      break;
    case 4:
      shapeName = "Rond";
      break;
  }
  spanClick.innerHTML = shapeName;
}

//detect which click
const txtGrid = select("#txt-grid");
GridSection.addEventListener("mouseup", logMouseButton);
pointer.addEventListener("mouseup", logMouseButton);

GridSection.addEventListener("contextmenu", (event) => event.preventDefault());

function logMouseButton(e) {
  e.preventDefault();
  if (typeof e === "object") {
    switch (e.button) {
      case 0:
        console.log("Left button clicked.");
        break;
      case 1:
        console.log("Middle button clicked.");
        break;
      case 2:
        e.preventDefault();
        txtGrid.classList.toggle("stroke-txt");
        console.log("Right button clicked.");
        break;
      default:
        console.log(`Unknown button code: ${e.button}`);
    }
  }
}

//utils
function mapRange(value, a, b, c, d) {
  value = (value - a) / (b - a);
  return c + value * (d - c);
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}
// fin utils

// titre H2 position aleatoire
const txtH2 = selectAll("h2 .char");

function randomizedNb() {
  selectAll("h2").forEach((el) => {
    txtH2.forEach((el) => {
      let number = Math.random() * (2 + 2) - 2;
      el.style.setProperty("--random-value", number);
    });
  });
  setTimeout(randomizedNb, 1000);
}
randomizedNb();
////////////////////////////////

// split word about section
const target = document.querySelector("#about-txt");
let results = Splitting({ target: target, by: "words" });
//console.log(results[0].words);
const topPos = target.getBoundingClientRect().top;
console.log(topPos, window.innerHeight / 2);
const stopTrigger =
  topPos + target.getBoundingClientRect().height + window.innerHeight;
// console.log(stopTrigger);

window.addEventListener("scroll", (event) => {
  let letterIndex = 0;
  // console.log(window.scrollY, window.scrollY - window.innerHeight / 2 > topPos);
  innerHeight;
  if ((window.scrollY > topPos) & (window.scrollY < stopTrigger)) {
    let scrollSection = +window.scrollY;
    // let valueFont = mapRange(scrollSection, topPos, stopTrigger, 1, 0);
    let indexWord = Math.round(
      mapRange(scrollSection, topPos, stopTrigger, 0, 77)
    );
    // console.log(indexWord);

    results[0].words.forEach((el) => {
      //   console.log(letterIndex);
      if (el.classList.contains("active-about-anim") && letterIndex > 3) {
        el.classList.remove("active-about-anim");
        el.classList.add("visible-after");
      }
      letterIndex++;
    });
    //activer l'anim pour les X prochains mots
    for (let i = indexWord; i < indexWord + 7; i++) {
      //   console.log(results[0].words[i]);
      if (results[0].words[i]) {
        results[0].words[i].classList.add("active-about-anim");
      }
    }
  } else {
    // console.log("not in screen");
  }
});

////////////////////////////////

//background repeat

var pattern = $("#pattern-circles");
var circle = $("#pattern-circle");

var PatternTester = function () {
  this.patternX = 0;
  this.patternY = 0;
  this.patternHeight = 15;
  this.patternWidth = 15;

  this.circleCX = 10;
  this.circleCY = 10;
  this.circleR = 10;

  this.fill = "#ecef4a";
  this.stroke = "#181818";
};

var colors = {
  fill: "#ecef4a",
  stroke: "#181818",
};

let text, gui;
let patternXController,
  patternYController,
  patternWidthController,
  patternHeightController,
  cirlcleCXController,
  cirlcleCYController,
  cirlcleRController,
  colorPickerShape,
  colorPickerStoke;

const repet = select(".container-repetition-letter");

function initGui() {
  gui = new dat.GUI({ name: "Mon interface" });
  text = new PatternTester();

  patternXController = gui.add(text, "patternX", 0, 150);
  patternYController = gui.add(text, "patternY", 0, 150);
  patternWidthController = gui.add(text, "patternWidth", 0, 50);
  patternHeightController = gui.add(text, "patternHeight", 0, 50);

  cirlcleCXController = gui.add(text, "circleCX", 0, 50);
  cirlcleCYController = gui.add(text, "circleCY", 0, 50);
  cirlcleRController = gui.add(text, "circleR", 0, 50);

  colorPickerShape = gui.addColor(text, "fill");
  colorPickerStoke = gui.addColor(text, "stroke");

  colorPickerShape.onChange(function (value) {
    circle.attr("fill", value);
  });
  colorPickerStoke.onChange(function (value) {
    circle.attr("stroke", value);
  });
  patternXController.onChange(function (value) {
    pattern.attr("x", value);
    console.log(value, pattern.attr("x"));
  });
  patternYController.onChange(function (value) {
    pattern.attr("y", value);
  });
  patternWidthController.onChange(function (value) {
    pattern.attr("width", value);
  });
  patternHeightController.onChange(function (value) {
    pattern.attr("height", value);
  });
  cirlcleCXController.onChange(function (value) {
    circle.attr("cx", value);
  });
  cirlcleCYController.onChange(function (value) {
    circle.attr("cy", value);
  });
  cirlcleRController.onChange(function (value) {
    circle.attr("r", value);
  });
  repet.appendChild(gui.domElement);
}
