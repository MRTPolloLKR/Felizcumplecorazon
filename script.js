// 1. **ACTUALIZA ESTE ARRAY** con las rutas a TUS fotos
const photosData = [
    { url: './images/foto7.jpg', text: 'Momentos inolvidables.' }, 
    { url: './images/foto2.jpg', text: 'Mi lugar favorito es a tu lado.' }, 
    { url: './images/foto3.jpg', text: 'Tu sonrisa ilumina mi mundo.' }, 
    { url: './images/foto4.jpg', text: 'Cada aventura contigo es un tesoro.' }, 
    { url: './images/foto5.jpg', text: 'Eres mi sueño hecho realidad.' }, 
    { url: './images/foto6.jpg', text: 'Por siempre juntos.' }, 
    // Añade más objetos { url: '...', text: '...' } para tus fotos
];

// 2. **ACTUALIZA ESTE ARRAY** con tus frases de amor personalizadas
const loveTexts = [
    'Mi Amor',
    'Eres Mi Todo',
    'Te Amo',
    'Para Siempre',
    'Mi Dulce Compañera',
    'Contigo en cada estrella',
    'Nuestra historia',
    'Mi corazón es tuyo',
    'Junto a ti, soy feliz',
    'Amor eterno',
    'Eres mi universo',
    'Mi sol, mi luna',
];


const container = document.getElementById('galaxy-container');
const numPhotos = photosData.length;
const numLoveTexts = loveTexts.length;
const numNebulaParticles = 100;
const numWhiteParticles = 300;
const RADIUS_ORBIT = 400; 

const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

// === LÓGICA DE POSICIONAMIENTO DE FOTOS Y TEXTOS ===

// 1. Fotos en Órbita
photosData.forEach((data, index) => {
    const photoDiv = document.createElement('div');
    const img = document.createElement('img');

    img.src = data.url;
    img.alt = `Estrella ${index + 1}`;
    photoDiv.classList.add('star-photo');

    // Posición en el plano XZ (Órbita)
    const angle = (index / numPhotos) * 2 * Math.PI + random(-0.5, 0.5);
    const radius = RADIUS_ORBIT + random(-80, 80); 

    const x = radius * Math.cos(angle);
    const y = random(-30, 30); 
    const z = radius * Math.sin(angle); 

    const size = random(60, 100); 
    
    photoDiv.style.width = `${size}px`;
    photoDiv.style.height = `${size}px`;
    
    // La posición 3D se añade al transform, el 'billboard' está en CSS.
    photoDiv.style.transform += ` translate3d(${x}px, ${y}px, ${z}px)`;

    photoDiv.style.left = `calc(50% - ${size / 2}px)`;
    photoDiv.style.top = `calc(50% - ${size / 2}px)`;
    
    photoDiv.appendChild(img);
    container.appendChild(photoDiv);
});

// 2. Textos de Amor en Órbita
loveTexts.forEach((text, index) => {
    const textDiv = document.createElement('div');
    textDiv.classList.add('love-text');
    textDiv.textContent = text;

    const angle = (index / numLoveTexts) * 2 * Math.PI + random(-0.8, 0.8); 
    const radius = (RADIUS_ORBIT * 1.5) + random(-100, 100); 

    const x = radius * Math.cos(angle);
    const y = random(-50, 50); 
    const z = radius * Math.sin(angle); 
    
    textDiv.style.transform += ` translate3d(${x}px, ${y}px, ${z}px)`;

    textDiv.style.left = `calc(50%)`;
    textDiv.style.top = `calc(50%)`;
    
    container.appendChild(textDiv);
});


// 3. Partículas Blancas Centelleantes (Estrellas)
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

// 4. Partículas de Nebulosa de Color
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


// === LÓGICA DE ARRASTRE (DRAG) 360° LIBRE ===
let isDragging = false;
let startX = 0;
let startY = 0;
let rotX = 70; // Rotación inicial
let rotY = 0; 

function applyRotation() {
    container.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

// --- Eventos de ratón ---
container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    container.style.cursor = 'grabbing'; 
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    rotY += deltaX / 5; // Rotación Y (horizontal)
    rotX -= deltaY / 5; // Rotación X (vertical)
    
    // NO hay límites de rotación aquí, permitiendo 360° en ambos ejes.
    
    applyRotation();

    startX = e.clientX;
    startY = e.clientY;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
});

// --- Eventos táctiles (Touch) ---
container.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;

    rotY += deltaX / 5;
    rotX -= deltaY / 5;
    
    applyRotation();

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', () => {
    isDragging = false;
});