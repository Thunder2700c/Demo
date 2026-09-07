gsap.registerPlugin(ScrollTrigger);

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
});

gsap.ticker.add(() => {
  followerX += (mouseX - followerX) * 0.15;
  followerY += (mouseY - followerY) * 0.15;
  gsap.set(follower, { x: followerX, y: followerY });
});

// Cursor grow on interactive elements
document.querySelectorAll('button, .char-card, .f-card').forEach(el => {
  el.addEventListener('mouseenter', () => follower.classList.add('active'));
  el.addEventListener('mouseleave', () => follower.classList.remove('active'));
});

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: 'power2.out'
    });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });
});

// ===== HERO ENTRANCE =====
const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

heroTl
  .to('.hero-tag', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
  .to('.hero-title .word', {
    y: 0,
    duration: 1.1,
    stagger: 0.12,
    ease: 'power4.out'
  }, '-=0.5')
  .to('.hero-sub', { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
  .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
  .from('.f-card', {
    y: 80,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: 'power3.out'
  }, '-=1');

// Floating cards subtle parallax on mouse
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  document.querySelectorAll('.f-card').forEach(card => {
    const speed = parseFloat(card.dataset.speed) || 0.5;
    gsap.to(card, {
      x: x * 25 * speed,
      y: y * 18 * speed,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  });
});

// ===== CARD STAGE REVEAL =====
gsap.from('.char-card', {
  scrollTrigger: {
    trigger: '.card-stage',
    start: 'top 78%',
  },
  y: 70,
  opacity: 0,
  rotateX: 8,
  duration: 1.1,
  stagger: 0.15,
  ease: 'power3.out'
});

// ===== PHILOSOPHY =====
gsap.from('.phil-left', {
  scrollTrigger: {
    trigger: '.philosophy',
    start: 'top 75%',
  },
  x: -60,
  opacity: 0,
  duration: 1.2,
  ease: 'power3.out'
});

gsap.from('.phil-right', {
  scrollTrigger: {
    trigger: '.philosophy',
    start: 'top 75%',
  },
  x: 60,
  opacity: 0,
  duration: 1.2,
  ease: 'power3.out'
});

// ===== FINAL SECTION =====
gsap.from('.final-content', {
  scrollTrigger: {
    trigger: '.final',
    start: 'top 80%',
  },
  y: 50,
  opacity: 0,
  duration: 1.1,
  ease: 'power3.out'
});

// ===== STRIP subtle speed variation (optional polish) =====
// Already handled by pure CSS marquee for performance

console.log('%cPerfect Cell — System Online', 'color: #e8c87a; font-family: monospace; font-size: 14px;');
