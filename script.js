/// 1. **ACTUALIZA ESTE ARRAY** con las rutas a TUS fotos
const photos = [
    './images/foto1.jpg', 
    './images/foto2.jpg', 
    './images/foto3.jpg', 
    './images/foto4.jpg', 
    './images/foto5.jpg', 
    './images/foto6.jpg', 
    './images/foto7.jpg', 
    './images/foto8.jpg', 
    // Añade tantas rutas como fotos tengas en la carpeta 'images'
];

const container = document.getElementById('galaxy-container');
const numPhotos = photos.length;
const numHeartStars = 30; // Número de corazones-estrella a añadir
const RADIUS = 600; // Radio de la órbita de las fotos y corazones (más grande por el agujero negro)

// Función para obtener un número aleatorio dentro de un rango
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// === LÓGICA DE POSICIONAMIENTO DE LAS FOTOS EN UNA ESFERA ALREDEDOR DEL AGUJERO NEGRO ===
photos.forEach((photoUrl, index) => {
    const photoDiv = document.createElement('div');
    const img = document.createElement('img');

    img.src = photoUrl;
    img.alt = `Estrella ${index + 1}`;
    photoDiv.classList.add('star-photo');

    // Cálculo de posición esférica
    const phi = Math.acos(-1 + (2 * index) / numPhotos); 
    const theta = Math.sqrt(numPhotos * Math.PI) * phi; 

    const x = RADIUS * Math.cos(theta) * Math.sin(phi);
    const y = RADIUS * Math.sin(theta) * Math.sin(phi);
    const z = RADIUS * Math.cos(phi);

    const size = random(50, 90); // Fotos un poco más pequeñas
    
    photoDiv.style.width = `${size}px`;
    photoDiv.style.height = `${size}px`;
    
    // Aplicar transformaciones 3D. Las fotos se colocan alrededor de un punto central (0,0,0)
    // El agujero negro ya está trasladado con translateZ en CSS
    photoDiv.style.transform = `
        translate3d(${x}px, ${y}px, ${z}px) 
    `;

    // Las fotos se centran al inicio y luego se transforman
    photoDiv.style.left = `calc(50% - ${size / 2}px)`;
    photoDiv.style.top = `calc(50% - ${size / 2}px)`;
    
    photoDiv.appendChild(img);
    container.appendChild(photoDiv);
});

// === LÓGICA PARA LOS CORAZONES-ESTRELLA ===
for (let i = 0; i < numHeartStars; i++) {
    const heart = document.createElement('span');
    heart.classList.add('heart-star'); // Usamos la nueva clase CSS
    
    heart.innerHTML = '&#x2764;'; // Carácter de corazón ❤️

    // Posicionamiento esférico para los corazones también
    const phi = Math.acos(-1 + (2 * i) / numHeartStars);
    const theta = Math.sqrt(numHeartStars * Math.PI) * phi + random(0, 10); // Ligeramente desfasado

    const x = RADIUS * random(0.8, 1.2) * Math.cos(theta) * Math.sin(phi); // Radio variable
    const y = RADIUS * random(0.8, 1.2) * Math.sin(theta) * Math.sin(phi);
    const z = RADIUS * random(0.8, 1.2) * Math.cos(phi);
    
    const size = random(1.0, 2.0); // Tamaño de fuente entre 1.0em y 2.0em
    
    heart.style.left = `calc(50% - ${size / 2}em)`;
    heart.style.top = `calc(50% - ${size / 2}em)`;
    heart.style.fontSize = `${size}em`;
    
    heart.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    heart.style.animationDelay = `${random(0, 3)}s`; // Retraso de animación

    container.appendChild(heart);
}

// === LÓGICA DE ARRASTRE (DRAG) PARA ROTAR LA GALAXIA ===
let isDragging = false;
let startX = 0;
let startY = 0;
let rotX = 0; 
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
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    rotY += deltaX / 5; 
    rotX -= deltaY / 5; 
    
    rotX = Math.max(-90, Math.min(90, rotX));
    
    applyRotation();

    startX = e.clientX;
    startY = e.clientY;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
});

// Mismo manejo para dispositivos táctiles (touch)
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

    rotX = Math.max(-90, Math.min(90, rotX));
    
    applyRotation();

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', () => {
    isDragging = false;
});