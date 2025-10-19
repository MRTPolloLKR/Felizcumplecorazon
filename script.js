// 1) Actualiza con tus fotos
const photosData = [
  { url: './images/foto7.jpg', text: 'Momentos inolvidables.' },
  { url: './images/foto2.jpg', text: 'Mi lugar favorito es a tu lado.' },
  { url: './images/foto3.jpg', text: 'Tu sonrisa ilumina mi mundo.' },
  { url: './images/foto4.jpg', text: 'Cada aventura contigo es un tesoro.' },
  { url: './images/foto5.jpg', text: 'Eres mi sueño hecho realidad.' },
  { url: './images/foto6.jpg', text: 'Por siempre juntos.' },
];

// 2) Actualiza tus frases
const loveTexts = [
  'Mi Amor','Eres Mi Todo','Te Amo','Para Siempre','Mi Dulce Compañera',
  'Contigo en cada estrella','Nuestra historia','Mi corazón es tuyo',
  'Junto a ti, soy feliz','Amor eterno','Eres mi universo','Mi sol, mi luna',
];

const container = document.getElementById('galaxy-container');
const numPhotos = photosData.length;
const numLoveTexts = loveTexts.length;

// Nebulosa + estrellas
const numNebulaParticles = 100;
const numWhiteParticles = 300;
const RADIUS_ORBIT = 400;

const rainbowColors = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3'];
function random(min, max) { return Math.random() * (max - min) + min; }

/* === Inyecta el canvas de nebulosa (antes de usarlo) === */
let nebulaCanvas = document.getElementById('nebula');
if (!nebulaCanvas) {
  nebulaCanvas = document.createElement('canvas');
  nebulaCanvas.id = 'nebula';
  nebulaCanvas.style.position = 'absolute';
  nebulaCanvas.style.inset = '0';
  nebulaCanvas.style.zIndex = '0';           // detrás de fotos/textos
  nebulaCanvas.style.pointerEvents = 'none';
  container.insertBefore(nebulaCanvas, container.firstChild);
}

/* ===== 1. Fotos en órbita ===== */
photosData.forEach((data, index) => {
  const photoDiv = document.createElement('div');
  const img = document.createElement('img');
  img.src = data.url;
  img.alt = `Estrella ${index + 1}`;
  photoDiv.classList.add('star-photo');

  const angle = (index / numPhotos) * 2 * Math.PI + random(-0.5, 0.5);
  const radius = RADIUS_ORBIT + random(-80, 80);

  const x = radius * Math.cos(angle);
  const y = random(-30, 30);
  const z = radius * Math.sin(angle);

  const size = random(60, 100);
  photoDiv.style.width = `${size}px`;
  photoDiv.style.height = `${size}px`;

  // Centramos y trasladamos en 3D (billboard en CSS)
  photoDiv.style.left = `calc(50% - ${size / 2}px)`;
  photoDiv.style.top  = `calc(50% - ${size / 2}px)`;
  photoDiv.style.transform += ` translate3d(${x}px, ${y}px, ${z}px)`;

  photoDiv.appendChild(img);

  // === NUEVO: caption aleatorio debajo de la foto ===
  const caption = document.createElement('div');
  caption.classList.add('love-caption');
  caption.textContent = loveTexts[Math.floor(random(0, numLoveTexts))] || '';
  photoDiv.appendChild(caption);

  container.appendChild(photoDiv);
});

/* ===== 2. Textos de amor en órbita (si también los quieres flotando aparte) ===== */
loveTexts.forEach((text, index) => {
  const textDiv = document.createElement('div');
  textDiv.classList.add('love-text');
  textDiv.textContent = text;

  const angle = (index / numLoveTexts) * 2 * Math.PI + random(-0.8, 0.8);
  const radius = (RADIUS_ORBIT * 1.5) + random(-100, 100);
  const x = radius * Math.cos(angle);
  const y = random(-50, 50);
  const z = radius * Math.sin(angle);

  textDiv.style.left = `50%`;
  textDiv.style.top  = `50%`;
  textDiv.style.transform += ` translate3d(${x}px, ${y}px, ${z}px)`;

  container.appendChild(textDiv);
});

/* ===== 3. Estrellas blancas ===== */
for (let i = 0; i < numWhiteParticles; i++) {
  const particle = document.createElement('span');
  particle.classList.add('white-particle');
  const x = random(-2000, 2000);
  const y = random(-2000, 2000);
  const z = random(-2000, 2000);
  particle.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  particle.style.animationDelay = `${random(0, 3)}s`;
  particle.style.animationDuration = `${random(2.5, 3.5)}s`;
  container.appendChild(particle);
}

/* ===== 4. Nebulosas RGB (tenues, con cambio de color) ===== */
for (let i = 0; i < numNebulaParticles; i++) {
  const particle = document.createElement('span');
  particle.classList.add('nebula-particle');

  const color = rainbowColors[Math.floor(random(0, rainbowColors.length))];
  particle.style.backgroundColor = color;
  particle.style.boxShadow = `0 0 5px ${color}`;

  const x = random(-1500, 1500);
  const y = random(-1500, 1500);
  const z = random(-1500, 1500);

  particle.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  particle.style.animationDelay = `${random(0, 4)}s`;
  container.appendChild(particle);
}

/* ===== 5. Drag 360° libre ===== */
let isDragging = false;
let startX = 0, startY = 0;
let rotX = 70; // coincide con el CSS
let rotY = 0;

function applyRotation() {
  container.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

container.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  container.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  rotY += dx / 5;
  rotX -= dy / 5;
  applyRotation();
  startX = e.clientX;
  startY = e.clientY;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  container.style.cursor = 'grab';
});

/* Touch */
container.addEventListener('touchstart', (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const dx = e.touches[0].clientX - startX;
  const dy = e.touches[0].clientY - startY;
  rotY += dx / 5;
  rotX -= dy / 5;
  applyRotation();
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener('touchend', () => {
  isDragging = false;
});

/* === Nebulosas RGB tenues en canvas === */
(function(){
  const cvs = nebulaCanvas;               // ahora sí existe
  const ctx = cvs.getContext('2d');
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let W, H;

  function resize(){
    const rect = container.getBoundingClientRect();
    W = Math.floor(rect.width  * dpr);
    H = Math.floor(rect.height * dpr);
    cvs.width  = W;
    cvs.height = H;
    cvs.style.width  = rect.width  + 'px';
    cvs.style.height = rect.height + 'px';
  }

  const BLOBS = 22; // número de nubes
  const blobs = [];
  function R(a,b){ return a + Math.random()*(b-a); }

  function init(){
    blobs.length = 0;
    for(let i=0;i<BLOBS;i++){
      blobs.push({
        x: Math.random(), y: Math.random(),
        r: R(120, 380),
        vx: R(-0.03, 0.03),
        vy: R(-0.03, 0.03),
        hue: Math.floor(R(0,360)),
        alpha: R(0.05, 0.12)
      });
    }
  }

  let t = 0;
  function loop(){
    t += 0.003;

    // Fondo espacial muy oscuro
    ctx.fillStyle = 'rgb(8,10,14)';
    ctx.fillRect(0,0,W,H);

    ctx.globalCompositeOperation = 'lighter';
    for(const b of blobs){
      // movimiento lento y envolvente
      b.x = (b.x + b.vx*0.0015*(W)) % 1;
      b.y = (b.y + b.vy*0.0015*(H)) % 1;
      if (b.x < 0) b.x += 1;
      if (b.y < 0) b.y += 1;

      const cx = b.x * W;
      const cy = b.y * H;
      const hue = (b.hue + t*60) % 360;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r*dpr);
      grad.addColorStop(0.0, `hsla(${hue}, 80%, 65%, ${b.alpha})`);
      grad.addColorStop(0.5, `hsla(${(hue+40)%360}, 75%, 55%, ${b.alpha*0.55})`);
      grad.addColorStop(1.0, `hsla(${(hue+80)%360}, 70%, 45%, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, b.r*dpr, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(loop);
  }

  // init
  resize();
  init();
  loop();
  window.addEventListener('resize', resize, { passive:true });
})();
