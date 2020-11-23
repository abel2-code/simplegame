let displacedX = 10;
let displacedY = 100;

let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth - displacedX;
canvas.height = window.innerHeight - displacedY;

let context = canvas.getContext("2d");

let mouse = {
  x: undefined,
  y: undefined,
};

let colorArray = ["#333301", "#FFFF52", "#FFFF05", "#CCCC04", "#E0E048"];

let maxRadius = 50;
let minRadius = 10;

// have mouse interact with game
window.addEventListener("mousemove", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});

// change canvas when window size changes
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth - displacedX;
  canvas.height = window.innerHeight - displacedY;

  init();
});

// keep track of level
let level = 1;

// keep track of remaining time
let timeLeft = 30;

// number of circles spawned each round
let spawnedCircles = 10;

// keep track of clicked circles
let count = 0;

// remove clicked circles
window.addEventListener("click", (e) => {
  for (let i = 0; i < circleArray.length; i++) {
    let circle = circleArray[i];
    if (
      mouse.x - displacedX - circle.x < 50 &&
      mouse.x - displacedX - circle.x > -50 &&
      mouse.y - displacedY - circle.y < 50 &&
      mouse.y - displacedY - circle.y > -50
    ) {
      count++;
      timeLeft += 5;
      score();
      return circleArray.splice(i, 1);
    }
  }
});

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function Circle(x, y, dx, dy, radius, color, index) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.minRadius = radius;
  this.color = color;
  this.index = index;

  this.draw = function () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.strokeStyle = color;
    context.fillStyle = color;
    context.fill();
    context.stroke();
  };

  this.update = function () {
    // collision
    // for (let i = 0; i < circleArray.length; i++) {
    //   let iteratedCircle = circleArray[i];
    //   let dist = Math.hypot(
    //     this.x - iteratedCircle.x,
    //     this.y - iteratedCircle.y
    //   );
    //   if (dist - this.radius - iteratedCircle.radius < 1 && i != index) {
    //     this.dx = -this.dx;
    //     this.dy = -this.dy;
    //   }
    // }

    // staying in bounds
    if (
      this.x + this.radius > innerWidth - displacedX ||
      this.x - this.radius < 0
    ) {
      this.dx = -this.dx;
    }
    if (
      this.y + this.radius > innerHeight - displacedY ||
      this.y - this.radius < 0
    ) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    // interactivity
    if (
      mouse.x - displacedX - this.x < 50 &&
      mouse.x - displacedX - this.x > -50 &&
      mouse.y - displacedY - this.y < 50 &&
      mouse.y - displacedY - this.y > -50
    ) {
      if (this.radius < maxRadius) {
        this.radius++;
      }
    } else if (this.radius > this.minRadius) {
      this.radius--;
    }

    this.draw();
  };
}

let circleArray = [];
let velocity = 4;

function init() {
  circleArray = [];

  for (let i = 0; i < spawnedCircles; i++) {
    let radius = Math.random() * 10 + 15;
    let x = Math.random() * (innerWidth - displacedX - radius * 2) + radius;
    let y = Math.random() * (innerHeight - displacedY - radius * 2) + radius;
    let dx = (Math.random() - 0.5) * velocity;
    let dy = (Math.random() - 0.5) * velocity;
    let color = colorArray[Math.floor(Math.random() * colorArray.length)];
    let index = i;

    circleArray.push(new Circle(x, y, dx, dy, radius, color, index));
  }
}

function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }
  score();
}

init();
animate();

function score() {
  let score = document.getElementById("score");
  score.innerHTML = `<div style="float: left"><h2>Level ${level}</h2></div>
   <div style="float: right"><h2>Score: ${count}</h2></div>`;

  if (circleArray.length == 0) {
    level++;
    spawnedCircles += 5;
    velocity += 2;
    init();
  }

  // countdown(1);

  //   function countdown(minutes) {
  //     let seconds = 60;
  //     let mins = minutes;
  //     function tick() {
  //       //This script expects an element with an ID = "counter". You can change that to what ever you want.
  //       let counter = document.getElementById("counter");
  //       let current_minutes = mins - 1;
  //       seconds--;
  //       counter.innerHTML =
  //         current_minutes.toString() +
  //         ":" +
  //         (seconds < 10 ? "0" : "") +
  //         String(seconds);
  //       if (seconds > 0) {
  //         setTimeout(tick, 1000);
  //       } else {
  //         setTimeout(function () {
  //           if (mins > 1) {
  //             countdown(mins - 1);
  //           }
  //         }, 1000);
  //       }
  //     }
  //     tick();
  //   }

  //   countdown(1);
}
