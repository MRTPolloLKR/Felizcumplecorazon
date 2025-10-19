// 1. **ACTUALIZA ESTE ARRAY** con las rutas a TUS fotos
const photosData = [
    { url: './images/foto1.jpg', text: 'Momentos inolvidables.' }, 
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
    'Día del Novio', // O algún recuerdo especial
    'Mi Dulce Compañera',
    'Contigo en cada estrella',
    'Nuestra historia',
    'Unidos por el destino',
    'Mi corazón es tuyo',
    'Junto a ti, soy feliz',
    'Amor eterno',
    'Eres mi universo',
    'Mi sol, mi luna',
    'Mi hermosa flor',
];


const container = document.getElementById('galaxy-container');
const numPhotos = photosData.length;
const numLoveTexts = loveTexts.length;
const numNebulaParticles = 200; 
const RADIUS_ORBIT = 400; // Radio de la órbita de fotos y textos

// Colores del arcoíris (Mantener)
const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

// === LÓGICA DE POSICIONAMIENTO DE FOTOS EN ÓRBITA PLANA ===
photosData.forEach((data, index) => {
    const photoDiv = document.createElement('div');
    const img = document.createElement('img');

    img.src = data.url;
    img.alt = `Estrella ${index + 1}`;
    photoDiv.classList.add('star-photo');

    // Cálculo de posición en el plano XZ (Órbita circular 2D)
    // Distribuir en un anillo alrededor del agujero negro
    const angle = (index / numPhotos) * 2 * Math.PI + random(-0.5, 0.5); // Ángulo con variación
    const radius = RADIUS_ORBIT + random(-80, 80); // Variación en el radio

    const x = radius * Math.cos(angle);
    const y = random(-30, 30); // Pequeña variación vertical para "flotar" ligeramente
    const z = radius * Math.sin(angle); 

    const size = random(60, 100); 
    
    photoDiv.style.width = `${size}px`;
    photoDiv.style.height = `${size}px`;
    
    photoDiv.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;

    photoDiv.style.left = `calc(50% - ${size / 2}px)`;
    photoDiv.style.top = `calc(50% - ${size / 2}px)`;
    
    photoDiv.appendChild(img);
    container.appendChild(photoDiv);
});

// === LÓGICA PARA TEXTOS DE AMOR EN ÓRBITA ===
loveTexts.forEach((text, index) => {
    const textDiv = document.createElement('div');
    textDiv.classList.add('love-text');
    textDiv.textContent = text;

    // Posicionamiento en el plano XZ (Órbita circular 2D)
    // Los textos pueden tener un radio diferente para un anillo separado
    const angle = (index / numLoveTexts) * 2 * Math.PI + random(-0.8, 0.8); // Ángulo con variación
    const radius = (RADIUS_ORBIT * 1.5) + random(-100, 100); // Órbita más externa

    const x = radius * Math.cos(angle);
    const y = random(-50, 50); 
    const z = radius * Math.sin(angle); 
    
    textDiv.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;

    textDiv.style.left = `calc(50% - ${textDiv.offsetWidth / 2}px)`; // Centrar el texto
    textDiv.style.top = `calc(50% - ${textDiv.offsetHeight / 2}px)`;
    
    container.appendChild(textDiv);
});


// === LÓGICA PARA PARTÍCULAS NEBULOSA ARCOÍRIS ===
for (let i = 0; i < numNebulaParticles; i++) {
    const particle = document.createElement('span');
    particle.classList.add('nebula-particle');
    
    const color = rainbowColors[Math.floor(random(0, rainbowColors.length))];
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 5px ${color}`;

    // Posicionamiento 3D en un volumen alrededor del centro, con mayor dispersión
    const x = random(-1500, 1500);
    const y = random(-1500, 1500);
    const z = random(-1500, 1500); 
    
    particle.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    particle.style.animationDelay = `${random(0, 4)}s`; 

    container.appendChild(particle);
}

// === LÓGICA DE ARRASTRE (DRAG) ===
let isDragging = false;
let startX = 0;
let startY = 0;
// Rotación inicial del CSS (70deg en X)
let rotX = 70; 
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

    rotY += deltaX / 5; 
    rotX -= deltaY / 5; 
    
    rotX = Math.max(30, Math.min(150, rotX)); // Limita la inclinación vertical
    
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

    rotX = Math.max(30, Math.min(150, rotX));
    
    applyRotation();

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', () => {
    isDragging = false;
});