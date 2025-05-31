const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
}
resize();
window.addEventListener('resize', resize);

class Star {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.radius = Math.random() * 1.3 + 0.3;
    this.alpha = Math.random();
    this.alphaSpeed = 0.005 + Math.random() * 0.02;
    this.alphaDirection = Math.random() < 0.5 ? 1 : -1;
  }
  update() {
    this.alpha += this.alphaSpeed * this.alphaDirection;
    if (this.alpha <= 0) {
      this.alpha = 0;
      this.alphaDirection = 1;
    }
    if (this.alpha >= 1) {
      this.alpha = 1;
      this.alphaDirection = -1;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.shadowColor = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.closePath();
  }
}

const stars = [];
const starCount = 200;
for (let i = 0; i < starCount; i++) {
  stars.push(new Star());
}

function animate() {
  ctx.clearRect(0, 0, W, H);

  let gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, '#000022');
  gradient.addColorStop(1, '#000010');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  stars.forEach(star => {
    star.update();
    star.draw();
  });

  requestAnimationFrame(animate);
}

animate();
