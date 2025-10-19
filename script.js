// 1. **ACTUALIZA ESTE ARRAY** con las rutas a TUS fotos Y LOS TEXTOS PERSONALIZADOS
const photosData = [
    { url: './images/foto1.jpg', text: 'Aquí estábamos en la playa. Ese día me di cuenta de lo mucho que amo tu sonrisa.' }, 
    { url: './images/foto2.jpg', text: 'Recuerdo esta cena, donde hablamos de nuestros sueños. ¡Te amo, soñadora!' }, 
    { url: './images/foto3.jpg', text: 'Esta foto es mi favorita, refleja lo espontánea y hermosa que eres.' }, 
    // Añade el resto de tus fotos con sus mensajes aquí
];

const container = document.getElementById('galaxy-container');
const numPhotos = photosData.length;
const numNebulaParticles = 200; 
const RADIUS = 400; // Radio de la órbita en el plano XZ

// Colores del arcoíris (Mantener)
const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

// === LÓGICA DEL MODAL (Mantener) ===
const modal = document.getElementById('photo-modal');
const modalImage = document.getElementById('modal-image');
const modalText = document.getElementById('modal-text');
const closeButton = document.querySelector('.close-button');

function openModal(photoUrl, customText) {
    modalImage.src = photoUrl;
    modalText.innerHTML = `<h2>Mi Recuerdo Especial</h2>${customText}`;
    modal.style.display = 'block';
}

closeButton.onclick = function() { modal.style.display = 'none'; };
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// === LÓGICA DE POSICIONAMIENTO DE FOTOS EN ÓRBITA PLANA ===
photosData.forEach((data, index) => {
    const photoDiv = document.createElement('div');
    const img = document.createElement('img');

    img.src = data.url;
    img.alt = `Estrella ${index + 1}`;
    photoDiv.classList.add('star-photo');

    // Añadir el evento click para abrir el modal
    photoDiv.addEventListener('click', () => {
        openModal(data.url, data.text);
    });

    // Cálculo de posición en el plano XZ (Órbita circular 2D)
    const angle = (index / numPhotos) * 2 * Math.PI; 
    const radius = RADIUS + random(-50, 50); // Añadir variación al radio

    const x = radius * Math.cos(angle);
    // Y (vertical) es casi cero para mantener la órbita plana, solo un pequeño ruido
    const y = random(-20, 20); 
    const z = radius * Math.sin(angle); 

    const size = random(60, 100); 
    
    photoDiv.style.width = `${size}px`;
    photoDiv.style.height = `${size}px`;
    
    // Aplicar transformaciones 3D
    photoDiv.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;

    // Centrar los elementos en la pantalla
    photoDiv.style.left = `calc(50% - ${size / 2}px)`;
    photoDiv.style.top = `calc(50% - ${size / 2}px)`;
    
    photoDiv.appendChild(img);
    container.appendChild(photoDiv);
});

// === LÓGICA PARA PARTÍCULAS NEBULOSA ARCOÍRIS ===
for (let i = 0; i < numNebulaParticles; i++) {
    const particle = document.createElement('span');
    particle.classList.add('nebula-particle');
    
    const color = rainbowColors[Math.floor(random(0, rainbowColors.length))];
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 5px ${color}`;

    // Posicionamiento 3D en un volumen alrededor del centro
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
    if (modal.style.display === 'block') return; 
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    container.style.cursor = 'grabbing'; 
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Arrastre horizontal (X) sigue siendo rotación Y
    rotY += deltaX / 5; 
    // Arrastre vertical (Y) ahora cambia la inclinación (rotación X)
    rotX -= deltaY / 5; 
    
    // Limita la rotación X para que no se voltee demasiado
    rotX = Math.max(30, Math.min(150, rotX));
    
    applyRotation();

    startX = e.clientX;
    startY = e.clientY;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
});

// --- Eventos táctiles (Touch) (Similares a los de ratón) ---
container.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (modal.style.display === 'block') return; 

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