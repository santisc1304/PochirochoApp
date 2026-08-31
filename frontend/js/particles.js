/* ==========================================================================
   POCHIROCHO - STARDUST & BIOLUMINESCENT PARTICLES CANVAS (INSIDE IPHONE FRAME)
   ========================================================================== */

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0;
  let particles = [];
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || isTouchDevice);
  const PARTICLE_COUNT = isMobile ? 14 : 45;
  let isPaused = false;
  let animFrameId = null;
  
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
      this.x = Math.random() * (width || 360);
      this.y = initial ? Math.random() * (height || 640) : (height || 640) + 10;
      this.radius = Math.random() * 1.8 + 0.6;
      this.baseOpacity = Math.random() * 0.55 + 0.15;
      this.opacity = this.baseOpacity;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseAngle = Math.random() * Math.PI * 2;
      
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
      
      this.pulseAngle += this.pulseSpeed;
      this.opacity = this.baseOpacity + Math.sin(this.pulseAngle) * 0.2;

      // Interacción solo en desktop con puntero de ratón
      if (!isTouchDevice && mouse.x > 0) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 6400) { // 80px radio
          const dist = Math.sqrt(distSq);
          const force = (80 - dist) / 80;
          this.x -= (dx / dist) * force * 1.2;
          this.y -= (dy / dist) * force * 1.2;
        }
      }

      if (this.y < -10 || this.x < -20 || this.x > width + 20) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, Math.min(1, this.opacity))})`;
      ctx.fill();
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
    if (isPaused) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animFrameId = requestAnimationFrame(animate);
  }

  window.pauseParticleCanvas = function() {
    isPaused = true;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  };

  window.resumeParticleCanvas = function() {
    if (isPaused) {
      isPaused = false;
      animate();
    }
  };

  // Pausar automáticamente cuando la pestaña está en segundo plano
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.pauseParticleCanvas();
    } else {
      window.resumeParticleCanvas();
    }
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
  }

  init();
  animate();
})();
