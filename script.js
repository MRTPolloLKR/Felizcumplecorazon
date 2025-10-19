// 1. **ACTUALIZA ESTE ARRAY** con las rutas a TUS fotos Y LOS TEXTOS PERSONALIZADOS
const photosData = [
    { url: './images/foto1.jpg', text: 'Aquí estábamos en la playa. Ese día me di cuenta de lo mucho que amo tu sonrisa.' }, 
    { url: './images/foto2.jpg', text: 'Recuerdo esta cena, donde hablamos de nuestros sueños. ¡Te amo, soñadora!' }, 
    { url: './images/foto3.jpg', text: 'Esta foto es mi favorita, refleja lo espontánea y hermosa que eres.' }, 
    { url: './images/foto4.jpg', text: 'Aquí estábamos en la playa. Ese día me di cuenta de lo mucho que amo tu sonrisa.' }, 
    { url: './images/foto5.jpg', text: 'Recuerdo esta cena, donde hablamos de nuestros sueños. ¡Te amo, soñadora!' }, 
    { url: './images/foto6.jpg', text: 'Esta foto es mi favorita, refleja lo espontánea y hermosa que eres.' }, 
    { url: './images/foto7.jpg', text: 'Aquí estábamos en la playa. Ese día me di cuenta de lo mucho que amo tu sonrisa.' }, 
    { url: './images/foto8.jpg', text: 'Recuerdo esta cena, donde hablamos de nuestros sueños. ¡Te amo, soñadora!' }, 
   
    // Añade el resto de tus fotos con sus mensajes. ¡ESTO ES MUY IMPORTANTE!
];

const container = document.getElementById('galaxy-container');
const numPhotos = photosData.length;
const numNebulaParticles = 200; // Número de partículas de nebulosa
const RADIUS = 600; 

// === MODAL ELEMENTS ===
const modal = document.getElementById('photo-modal');
const modalImage = document.getElementById('modal-image');
const modalText = document.getElementById('modal-text');
const closeButton = document.querySelector('.close-button');

// Colores del arcoíris para la nebulosa
const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

// === FUNCIÓN PARA ABRIR EL MODAL ===
function openModal(photoUrl, customText) {
    modalImage.src = photoUrl;
    modalText.innerHTML = `<h2>Mi Recuerdo Especial</h2>${customText}`;
    modal.style.display = 'block';
}

// --- Cerrar el modal ---
closeButton.onclick = function() { modal.style.display = 'none'; };
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// === LÓGICA DE POSICIONAMIENTO DE FOTOS Y NEBULA ===
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

    // Cálculo de posición esférica
    const phi = Math.acos(-1 + (2 * index) / numPhotos); 
    const theta = Math.sqrt(numPhotos * Math.PI) * phi; 

    const x = RADIUS * Math.cos(theta) * Math.sin(phi);
    const y = RADIUS * Math.sin(theta) * Math.sin(phi);
    const z = RADIUS * Math.cos(phi);

    const size = random(50, 90); 
    
    photoDiv.style.width = `${size}px`;
    photoDiv.style.height = `${size}px`;
    
    photoDiv.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;

    photoDiv.style.left = `calc(50% - ${size / 2}px)`;
    photoDiv.style.top = `calc(50% - ${size / 2}px)`;
    
    photoDiv.appendChild(img);
    container.appendChild(photoDiv);
});

// === LÓGICA PARA PARTÍCULAS NEBULOSA ARCOÍRIS ===
for (let i = 0; i < numNebulaParticles; i++) {
    const particle = document.createElement('span');
    particle.classList.add('nebula-particle');
    
    // Asignar color aleatorio del arcoíris
    const color = rainbowColors[Math.floor(random(0, rainbowColors.length))];
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 5px ${color}`;

    // Posicionamiento 3D completamente aleatorio
    const x = random(-1000, 1000);
    const y = random(-1000, 1000);
    const z = random(-1000, 1000); 
    
    particle.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    particle.style.animationDelay = `${random(0, 4)}s`; 

    container.appendChild(particle);
}

// === LÓGICA DE ARRASTRE (DRAG) (Mantener) ===
let isDragging = false;
let startX = 0;
let startY = 0;
let rotX = 0; 
let rotY = 0; 

function applyRotation() {
    container.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

// --- Eventos de ratón ---
container.addEventListener('mousedown', (e) => {
    // No iniciar arrastre si el modal está abierto
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

// --- Eventos táctiles (Touch) ---
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

    rotX = Math.max(-90, Math.min(90, rotX));
    
    applyRotation();

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', () => {
    isDragging = false;
});