const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const openGiftButton = document.querySelector('#openGift');
const envelope = document.querySelector('#envelope');
const envelopeSection = document.querySelector('#envelopeSection');
const letterSection = document.querySelector('#letterSection');
const finalSection = document.querySelector('#finalSection');
const openHeartButton = document.querySelector('#openHeart');
const finalMessage = document.querySelector('#finalMessage');

function scrollToElement(element) {
  element?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
}

openGiftButton.addEventListener('click', () => {
  scrollToElement(envelopeSection);
});

envelope.addEventListener('click', () => {
  if (envelope.classList.contains('opened')) return;
  envelope.classList.add('opened');
  envelope.setAttribute('aria-expanded', 'true');
  window.setTimeout(() => scrollToElement(letterSection), reducedMotion ? 100 : 1200);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const fallbackImage = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
    <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f6d7d1"/><stop offset="1" stop-color="#dcd1e9"/></linearGradient></defs>
    <rect width="800" height="600" fill="url(#g)"/><circle cx="400" cy="255" r="70" fill="#fff8f2" opacity=".8"/><path d="M400 350c-70-65-130 20 0 100 130-80 70-165 0-100Z" fill="#d36a7d" opacity=".7"/><text x="400" y="505" text-anchor="middle" fill="#704a5b" font-family="Georgia,serif" font-size="28">Add your memory here ♥</text>
  </svg>`);

document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => {
    image.src = fallbackImage;
    image.removeAttribute('srcset');
  }, { once: true });
});

function createFloatingDecor() {
  const container = document.querySelector('#floatingDecor');
  if (reducedMotion) return;
  for (let index = 0; index < 12; index += 1) {
    const item = document.createElement('span');
    const isHeart = index % 2 === 0;
    item.className = isHeart ? 'floating-heart' : 'floating-petal';
    if (isHeart) item.textContent = index % 4 === 0 ? '♥' : '✦';
    item.style.left = `${4 + Math.random() * 92}%`;
    item.style.animationDelay = `${Math.random() * 9}s`;
    item.style.animationDuration = `${8 + Math.random() * 8}s`;
    item.style.transform = `scale(${0.7 + Math.random() * 0.7})`;
    container.appendChild(item);
  }
}

function createConfetti() {
  const container = document.querySelector('#confetti');
  if (reducedMotion || container.children.length) return;
  for (let index = 0; index < 42; index += 1) {
    const piece = document.createElement('i');
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 2.2}s`;
    piece.style.animationDuration = `${2.8 + Math.random() * 2.4}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    container.appendChild(piece);
  }
}

openHeartButton.addEventListener('click', () => {
  finalSection.classList.add('celebrating');
  finalMessage.setAttribute('aria-hidden', 'false');
  createConfetti();
});

const achievementNumber = document.querySelector('.achievement-number');
let numberAnimated = false;
const achievementObserver = new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting || numberAnimated) return;
  numberAnimated = true;
  const target = Number(achievementNumber.dataset.target);
  if (reducedMotion) {
    achievementNumber.textContent = target;
    return;
  }
  let current = 0;
  const timer = window.setInterval(() => {
    current += 1;
    achievementNumber.textContent = current;
    if (current >= target) window.clearInterval(timer);
  }, 120);
}, { threshold: .5 });
achievementObserver.observe(achievementNumber);

createFloatingDecor();
