let ball
let xspeed, yspeed
let lPad, rPad
let lScore = 0
let rScore = 0

let ponghit, pongbounce, pongscore

function preload() {
  ponghit = loadSound("ponghit.wav")
  pongbounce = loadSound("pongbounce.wav")
  pongscore = loadSound("pongscore.wav")
}

function mouseClicked(){
    if((lScore === 6 && rScore < 6) || (rScore === 6 && lScore < 6)) {
      lScore = 0
      rScore = 0
      this.x = width/2
      this.y = height/2
      xspeed = random(2, 4)
      yspeed = random(1, 3)
    }
}

let lAngles = {
  "-5": -135,
  "-4": -45,
  "-3": -45,
  "-2": -30,
  "-1": -15,
  "0": 0,
  "1": 15,
  "2": 30,
  "3": 45,
  "4": 45
}

let rAngles = {
  "-5": -135,
  "-4": -135,
  "-3": -135,
  "-2": -150,
  "-1": -165,
  "0": 180,
  "1": 165,
  "2": 150,
  "3": 135,
  "4": 135
}

function setup() {
  createCanvas(600, 400)
  ball = new Ball()
  lPad = new Paddle("left")
  rPad = new Paddle("right")
  xspeed = random(2, 4)
  yspeed = random(1, 3)
}

function draw() {
  background(0)
  dashedLine(25)
  score()

  ball.show()
  ball.move()
  ball.edges()

  lPad.show()
  rPad.show()
  lPad.move()
  rPad.move()

  if(ball.collides(lPad)) {
    lPad.hit()
  }

  if(ball.collides(rPad)) {
    rPad.hit()
  }
}

class Paddle {
  constructor(position) {
    this.position = position
    this.h = 80
    this.w = 10
    this.y = height/2

    if(this.position == "left") {
      this.x = this.w
    }

    else {
      this.x = width - this.w
    }
  }

  show() {
    rectMode(CENTER)
    fill(255)
    rect(this.x, this.y, this.w, this.h)
  }

  move() {
    if(this.position == "right") {
      if(keyIsDown(UP_ARROW)) {
        this.y -=10
      }

      else if(keyIsDown(DOWN_ARROW)) {
        this.y += 10
      }
    }

    if(this.position == "left" && xspeed < 0 && ball.x < width/2) {
      if(ball.y > this.y) {
        this.y += 2
      }

      else if(ball.y < this.y) {
        this.y -= 2
      }
    }

    this.y = constrain(this.y, this.h/2, height - this.h/2)
  }

  hit() {
    angleMode(DEGREES)
    if(this.position == "right") {
      let diff = ball.y - this.y
      let segment = Math.floor(diff / 10)
      let angle = rAngles[segment]

      xspeed = 5 * cos(angle)
      yspeed = 5 * sin(angle)
      ponghit.play()
    }

    if(this.position == "left") {
      let diff = ball.y - this.y
      let segment = Math.floor(diff / 10)
      let angle = lAngles[segment]

      xspeed = 5 * cos(angle)
      yspeed = 5 * sin(angle)
      ponghit.play()
    }

  }
}

class Ball {
  constructor() {
    this.x = width/2
    this.y = height/2
    this.d = 20
  }

  show() {
    fill(255)
    circle(this.x, this.y, this.d)
  }

  collides(paddle) {
    let pleft = paddle.x - 5
    let pright = paddle.x + 5
    let ptop = paddle.y - 40
    let pbottom = paddle.y + 40
    let bleft = this.x - 10
    let bright = this.x + 10
    let btop = this.y - 10
    let bbottom = this.y + 10

    if(bright < pleft) {
      return false
    }

    if(bleft > pright) {
      return false
    }

    if(btop > pbottom) {
      return false
    }

    if(bbottom < ptop) {
      return false
    }

    else {
      return true
    }
  }

  move() {
    this.x += xspeed
    this.y += yspeed
  }

  edges() {
    if(this.y < 0 || this.y > height) {
      yspeed = -yspeed
      pongbounce.play()
    }

    if(this.x > width) {
      this.reset()
      lScore++
      pongscore.play()
    }

    if(this.x < 0) {
      this.reset()
      rScore++
      pongscore.play()
    }

    if((lScore === 6 && rScore < 6) || (rScore === 6 && lScore < 6)) {
      this.over()
    }

    if(lScore === 5 && rScore === 5) {
      this.match()
    }
  }

  reset() {
    this.x = width/2
    this.y = height/2
  }

  match() {
    textSize(40)
    textStyle(BOLD)
    fill(255, 0, 0)
    text('MATCH POINT', 300, 60)
  }

  over() {
    textSize(60)
    textStyle(BOLD)
    fill(255, 255, 0)
    text('GAME OVER', 300, 150)
    textSize(30)
    textStyle(BOLD)
    text('Click to Restart', 300, 200)
    fill(255, 255, 0)
    xspeed = 0
    yspeed = 0
  }

}

function score() {
  fill(255)
  noStroke()
  textAlign(CENTER)
  textSize(32)
  text(lScore, width/4, 50)
  text(rScore, 3*width/4, 50)
}

function dashedLine(pixels) {
  stroke(255)
  strokeWeight(2)
  let center = width / 2

  for(let i = 0; i < height / pixels; i++) {
    line(center, i * pixels + 5, center, i * pixels + 15)
  }
}

