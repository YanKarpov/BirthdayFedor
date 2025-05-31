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
  constructor(layer = 1) {
    this.layer = layer;
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.radius = (Math.random() * 1.3 + 0.3) / this.layer;
    this.alpha = Math.random() * 0.5 + 0.5;
    this.alphaSpeed = 0.002 + Math.random() * 0.01;
    this.alphaDirection = Math.random() < 0.5 ? 1 : -1;
  }
  update() {
    this.alpha += this.alphaSpeed * this.alphaDirection;
    if (this.alpha <= 0 || this.alpha >= 1) {
      this.alphaDirection *= -1;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.shadowColor = `rgba(255,255,255,${this.alpha})`;
    ctx.shadowBlur = 6 / this.layer;
    ctx.fill();
    ctx.closePath();
  }
}

const stars = [];
[100, 120, 140].forEach((count, layer) => {
  for (let i = 0; i < count; i++) {
    stars.push(new Star(layer + 1));
  }
});

function animate() {
  ctx.clearRect(0, 0, W, H);

  const gradient = ctx.createLinearGradient(0, 0, 0, H);
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
