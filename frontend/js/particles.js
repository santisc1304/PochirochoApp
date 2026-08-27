/* ==========================================================================
   POCHIROCHO - STARDUST & BIOLUMINESCENT PARTICLES CANVAS (INSIDE IPHONE FRAME)
   ========================================================================== */

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 120;
  
  let mouse = { x: -1000, y: -1000 };

  function resizeCanvas() {
    const parent = canvas.parentElement || document.body;
    width = canvas.width = parent.clientWidth || window.innerWidth;
    height = canvas.height = parent.clientHeight || window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = Math.random() * 2 + 0.5;
      this.baseOpacity = Math.random() * 0.7 + 0.2;
      this.opacity = this.baseOpacity;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.pulseAngle = Math.random() * Math.PI * 2;
      
      // Color variants: Pure White, Starlight Gold, Crimson Glow
      const randColor = Math.random();
      if (randColor > 0.85) {
        this.color = '255, 185, 80'; // Starlight Gold
      } else if (randColor > 0.7) {
        this.color = '255, 112, 126'; // Soft Crimson
      } else {
        this.color = '255, 255, 255'; // Pure White
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Twinkle pulsation
      this.pulseAngle += this.pulseSpeed;
      this.opacity = this.baseOpacity + Math.sin(this.pulseAngle) * 0.25;

      // Mild reaction to mouse proximity relative to canvas
      const rect = canvas.getBoundingClientRect();
      const relMouseX = mouse.x - rect.left;
      const relMouseY = mouse.y - rect.top;

      const dx = relMouseX - this.x;
      const dy = relMouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        this.x -= (dx / dist) * force * 1.5;
        this.y -= (dy / dist) * force * 1.5;
      }

      // Reset when floating out of top or side bounds
      if (this.y < -10 || this.x < -20 || this.x > width + 20) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, Math.min(1, this.opacity))})`;
      ctx.shadowColor = `rgba(${this.color}, 0.8)`;
      ctx.shadowBlur = this.radius * 3;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  function init() {
    resizeCanvas();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  init();
  animate();
})();
