// Major Project
// Aiman Fatima Adnan
// 27/04/2026

// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let fireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background("black");

  for (let i=fireworks.length-1; i>=0; i--) {
    if (fireworks[i].isDead()) {
      fireworks.splice(i, 1);
    }
    else {
      fireworks[i].update();
      fireworks[i].display();
    } 
  }
}

function mousePressed() {
  for (let i=0; i<100; i++) {
    let someParticle = new Particle(mouseX, mouseY);
    fireworks.push(someParticle);
  }
}

// -----------------------------------------------

class Particle {
  constructor(x, y) { 
    this.x = x;
    this.y = y;
    this.size = 5;
    this.dx = random(-10, 10);
    this.dy = random(-10, 10);
    this.color = 'red';
  }
  
  update() {
    this.x = this.x + this.dx;
    this.y = this.y + this.dy; 
  }
  
  display() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.size);
  }
  
  isDead() {
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      return true;
    }
    else {
      return false;
    }
  }
}


