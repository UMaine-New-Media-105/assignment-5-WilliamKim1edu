let preyCooldown = 0; // Counter for the prey creation cooldown
const PREY_COOLDOWN_THRESHOLD = 30; // The number of frames to wait before creating a new prey

function setup() {
  createCanvas(960, 540);
  frameRate(60);
  angleMode(DEGREES);
  ellipseMode(CENTER);
  rectMode(CENTER);
  collideDist = 50;
  bubbles = [];
  maws = [];
  prey = [];
  teethCounts = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  for (let bubblesDrawn = 0; bubblesDrawn < 50; bubblesDrawn++) {
    bubX = random(width);
    bubY = random(height);
    bubSiz = random(1, 6);
    bubbles.push(new Bubble(bubX, bubY, bubSiz));
  }
  for (let mawCount = 0; mawCount < 5; mawCount++) {
    mawX = random(width);
    mawY = random(height);
    mawSiz = random(3, 6);
    maws.push(new Maw(mawX, mawY, mawSiz));
  }
  for (let preyCount = 0; preyCount < 10; preyCount++) {
    preyX = random(width);
    preyY = random(height);
    preySiz = random(1, 3);
    prey.push(new Food(preyX, preyY, preySiz));
  }
}

function draw() {
  background("dodgerblue");

  for (let bubsDrawn = 0; bubsDrawn < bubbles.length; bubsDrawn++) {
    bubbles[bubsDrawn].jitter();
    bubbles[bubsDrawn].show();
  }
  for (let mawsDrawn = 0; mawsDrawn < maws.length; mawsDrawn++) {
    maws[mawsDrawn].bounce();
    maws[mawsDrawn].breathe();
    maws[mawsDrawn].show();
    
    // Check for collisions between prey and maws
    for (let preyDrawn = 0; preyDrawn < prey.length; preyDrawn++) {
      if (prey[preyDrawn].collidesWith(maws[mawsDrawn])) {
        prey[preyDrawn].health -= 1; // reduce the health of the prey
      }
    }
  }

  // Update the prey cooldown counter
  preyCooldown++;

  for (let preyDrawn = 0; preyDrawn < prey.length; preyDrawn++) {
    prey[preyDrawn].bounce();

    // Check for collisions between prey
    for (let otherPrey = 0; otherPrey < prey.length; otherPrey++) {
      if (
        prey[preyDrawn] !== prey[otherPrey] &&
        prey[preyDrawn].collidesWith(prey[otherPrey])
      ) {
        // Create a new prey if the cooldown is over
        if (preyCooldown >= PREY_COOLDOWN_THRESHOLD) {
          const newPreyX = random(width);
          const newPreyY = random(height);
          const newPreySiz = random(1, 3);
          prey.push(new Food(newPreyX, newPreyY, newPreySiz));
          preyCooldown = 0; // Reset the cooldown counter
        }
      }
    }

    if (prey[preyDrawn].health >= 1) {
      prey[preyDrawn].show();
    }
  }
}

class Bubble {
  constructor(x, y, siz) {
    this.x = x;
    this.y = y;
    this.siz = siz;
  }
  jitter() {
    this.x = this.x + random(-0.1, 0.1);
    this.y = this.y + random(-0.5, 0.1);
    let isTooFarLeft = this.y < -15;
    if (isTooFarLeft) {
      this.y = height + 15;
      this.x = random(width);
    }
  }
  show() {
    push();
    translate(this.x, this.y);
    scale(this.siz);
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = "rgb(255, 255, 255)";
    strokeWeight(0.1);
    stroke("white");
    fill("lightblue");
    ellipse(0, 0, 5);
    pop();
  }
}

class Maw {
  constructor(x, y, siz) {
    this.x = x;
    this.y = y;
    this.siz = siz;
    this.toothLength = random(-3, 0);
    this.toothCount = random(teethCounts);
    this.toothSpeed = 0.25;
    this.mawX = random(1, 2);
    this.mawY = random(1, 2);
  }
  bounce() {
    this.x = this.x + this.mawX;
    this.y = this.y + this.mawY;
    // Reverse if it hits a wall.
    let isTooFarLeft = this.x < 0;
    let isTooFarRight = this.x > width;
    let isTooFarUp = this.y < 0;
    let isTooFarDown = this.y > height;
    if (isTooFarLeft || isTooFarRight) {
      this.mawX = -this.mawX;
    }
    if (isTooFarUp || isTooFarDown) {
      this.mawY = -this.mawY;
    }
  }
  breathe() {
    this.toothLength = this.toothLength - this.toothSpeed;
    if (this.toothLength > 0) {
      this.toothLength = 0;
      this.toothSpeed = this.toothSpeed * -1;
    }
    if (this.toothLength < -3) {
      this.toothLength = -3;
      this.toothSpeed = this.toothSpeed * -1;
    }
  }
  show() {
    push();
    angleMode(DEGREES);
    translate(this.x, this.y);
    scale(this.siz);
    noStroke();
    fill("maroon");
    ellipse(0, 0, 10);
    for (let linesDrawn = 0; linesDrawn < this.toothCount; linesDrawn++) {
      fill("white");
      triangle(-0.5, -4, 0.5, -4, 0, this.toothLength);
      rotate(360 / this.toothCount);
    }
    pop();
  }
}

class Food {
  constructor(x, y, siz) {
    this.x = x;
    this.y = y;
    this.siz = siz;
    this.health = 1;
    this.moveX = random(1, 2);
    this.moveY = random(1, 2);
  }
  bounce() {
    this.x = this.x + this.moveX;
    this.y = this.y + this.moveY;
    // Reverse if it hits a wall.
    let isTooFarLeft = this.x < 0;
    let isTooFarRight = this.x > width;
    let isTooFarUp = this.y < 0;
    let isTooFarDown = this.y > height;
    if (isTooFarLeft || isTooFarRight) {
      this.moveX = -this.moveX;
    }
    if (isTooFarUp || isTooFarDown) {
      this.moveY = -this.moveY;
    }
  }
  show() {
    push();
    translate(this.x, this.y);
    scale(this.siz);
    noStroke();
    fill("purple");
    ellipse(0, 0, 10);
    pop();
  }
  collidesWith(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    return d < collideDist;
  }
}
