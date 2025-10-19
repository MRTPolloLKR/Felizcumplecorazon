// 1) Tus fotos
const photosData = [
  { url: './images/foto7.jpg', text: 'Momentos inolvidables.' },
  { url: './images/foto2.jpg', text: 'Mi lugar favorito es a tu lado.' },
  { url: './images/foto3.jpg', text: 'Tu sonrisa ilumina mi mundo.' },
  { url: './images/foto4.jpg', text: 'Cada aventura contigo es un tesoro.' },
  { url: './images/foto5.jpg', text: 'Eres mi sueño hecho realidad.' },
  { url: './images/foto6.jpg', text: 'Por siempre juntos.' },
];

// 2) Frases (para captions)
let loveTexts = [
  'Mi Amor','Eres Mi Todo','Te Amo','Para Siempre','Mi Dulce Compañera',
  'Contigo en cada estrella','Nuestra historia','Mi corazón es tuyo',
  'Junto a ti, soy feliz','Amor eterno','Eres mi universo','Mi sol, mi luna',
];

// Utilidades
const container = document.getElementById('galaxy-container');
const numPhotos = photosData.length;
const RADIUS_ORBIT = 400;
function random(min, max){ return Math.random() * (max - min) + min; }
function pickRandomCaption(){
  if (loveTexts.length === 0) return '';
  const i = Math.floor(Math.random() * loveTexts.length);
  return loveTexts.splice(i, 1)[0]; // sin repetirse
}

// Asegura canvas de nebulosa
const nebulaCanvas = document.getElementById('nebula');
const nebCtx = nebulaCanvas.getContext('2d');

// 1) Fotos en órbita + caption
photosData.forEach((data, index) => {
  const photoDiv = document.createElement('div');
  const img = document.createElement('img');
  img.src = data.url;
  img.alt = `Foto ${index + 1}`;
  photoDiv.classList.add('star-photo');

  const angle  = (index / numPhotos) * 2 * Math.PI + random(-0.5, 0.5);
  const radius = RADIUS_ORBIT + random(-80, 80);
  const x = radius * Math.cos(angle);
  const y = random(-30, 30);
  const z = radius * Math.sin(angle);

  const size = random(60, 100);
  photoDiv.style.width  = `${size}px`;
  photoDiv.style.height = `${size}px`;
  photoDiv.style.left   = `calc(50% - ${size/2}px)`;
  photoDiv.style.top    = `calc(50% - ${size/2}px)`;
  photoDiv.style.transform += ` translate3d(${x}px, ${y}px, ${z}px)`;

  photoDiv.appendChild(img);

  const caption = document.createElement('div');
  caption.classList.add('love-caption');
  caption.textContent = pickRandomCaption();
  photoDiv.appendChild(caption);

  container.appendChild(photoDiv);
});

// 2) Estrellas blancas
const numWhiteParticles = 300;
for (let i = 0; i < numWhiteParticles; i++) {
  const p = document.createElement('span');
  p.classList.add('white-particle');
  const x = random(-2000, 2000);
  const y = random(-2000, 2000);
  const z = random(-2000, 2000);
  p.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  p.style.animationDelay = `${random(0, 3)}s`;
  p.style.animationDuration = `${random(2.5, 3.5)}s`;
  container.appendChild(p);
}

// 3) Nebulosas RGB tenues (canvas)
(function(){
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let W, H;

  function resize(){
    const rect = container.getBoundingClientRect();
    W = Math.floor(rect.width  * dpr);
    H = Math.floor(rect.height * dpr);
    nebulaCanvas.width = W; nebulaCanvas.height = H;
    nebulaCanvas.style.width = rect.width + 'px';
    nebulaCanvas.style.height = rect.height + 'px';
  }

  const BLOBS = 24;
  const blobs = [];
  function R(a,b){ return a + Math.random()*(b-a); }
  function init(){
    blobs.length = 0;
    for (let i=0;i<BLOBS;i++){
      blobs.push({
        x: Math.random(), y: Math.random(),
        r: R(140, 420),
        vx: R(-0.03, 0.03), vy: R(-0.03, 0.03),
        hue: Math.floor(R(0, 360)),
        alpha: R(0.05, 0.12)
      });
    }
  }

  let t = 0;
  function loop(){
    t += 0.003;
    nebCtx.fillStyle = 'rgb(8,10,14)';
    nebCtx.fillRect(0,0,W,H);

    nebCtx.globalCompositeOperation = 'lighter';
    for (const b of blobs){
      b.x = (b.x + b.vx * 0.0015 * W) % 1;
      b.y = (b.y + b.vy * 0.0015 * H) % 1;
      if (b.x < 0) b.x += 1;
      if (b.y < 0) b.y += 1;

      const cx = b.x * W, cy = b.y * H;
      const hue = (b.hue + t*60) % 360;

      const g = nebCtx.createRadialGradient(cx, cy, 0, cx, cy, b.r*dpr);
      g.addColorStop(0.00, `hsla(${hue}, 80%, 65%, ${b.alpha})`);
      g.addColorStop(0.55, `hsla(${(hue+40)%360}, 75%, 55%, ${b.alpha*0.55})`);
      g.addColorStop(1.00, `hsla(${(hue+80)%360}, 70%, 45%, 0)`);
      nebCtx.fillStyle = g;
      nebCtx.beginPath();
      nebCtx.arc(cx, cy, b.r*dpr, 0, Math.PI*2);
      nebCtx.fill();
    }
    nebCtx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(loop);
  }

  resize(); init(); loop();
  window.addEventListener('resize', resize, { passive:true });
})();

// 4) Drag 360° libre
let isDragging=false, startX=0, startY=0, rotX=70, rotY=0;
function applyRotation(){ container.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`; }

container.addEventListener('mousedown', (e) => {
  isDragging = true; startX = e.clientX; startY = e.clientY;
  container.style.cursor = 'grabbing';
});
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - startX, dy = e.clientY - startY;
  rotY += dx / 5; rotX -= dy / 5; applyRotation();
  startX = e.clientX; startY = e.clientY;
});
document.addEventListener('mouseup', () => { isDragging = false; container.style.cursor = 'grab'; });

container.addEventListener('touchstart', (e) => {
  isDragging = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY;
}, { passive:false });
document.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const dx = e.touches[0].clientX - startX, dy = e.touches[0].clientY - startY;
  rotY += dx / 5; rotX -= dy / 5; applyRotation();
  startX = e.touches[0].clientX; startY = e.touches[0].clientY;
}, { passive:false });
document.addEventListener('touchend', () => { isDragging = false; });
