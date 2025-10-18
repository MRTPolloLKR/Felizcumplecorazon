// 1. **ACTUALIZA ESTE ARRAY** con las rutas a TUS fotos
const photos = [
    './images/foto1.jpg', 
    './images/foto2.jpg', 
    './images/foto3.jpg', 
    './images/foto4.jpg', 
    './images/foto5.jpg', 
    './images/foto6.jpg', 
    './images/foto7.jpg', 
    './images/foto8.jpg', 
    
];

const container = document.getElementById('galaxy-container');
const numPhotos = photos.length;
const RADIUS = 450; // Radio de la esfera de la galaxia (en píxeles)

// Función para obtener un número aleatorio dentro de un rango
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// === LÓGICA DE POSICIONAMIENTO DE LAS FOTOS EN UNA ESFERA ===
photos.forEach((photoUrl, index) => {
    const photoDiv = document.createElement('div');
    const img = document.createElement('img');

    img.src = photoUrl;
    img.alt = `Estrella ${index + 1}`;
    photoDiv.classList.add('star-photo');

    // 1. Cálculo de posición esférica (para rodear el agujero negro)
    const phi = Math.acos(-1 + (2 * index) / numPhotos); // Ángulo polar (vertical)
    const theta = Math.sqrt(numPhotos * Math.PI) * phi; // Ángulo acimutal (horizontal)

    // Coordenadas cartesianas en el radio de la esfera
    const x = RADIUS * Math.cos(theta) * Math.sin(phi);
    const y = RADIUS * Math.sin(theta) * Math.sin(phi);
    const z = RADIUS * Math.cos(phi);

    // 2. Tamaño aleatorio
    const size = random(60, 100); // Tamaño de la "estrella-foto"

    photoDiv.style.width = `${size}px`;
    photoDiv.style.height = `${size}px`;
    
    // 3. Aplicar transformaciones 3D
    photoDiv.style.transform = `
        translate3d(${x}px, ${y}px, ${z}px) 
        /* Para que siempre miren hacia el centro (hacia la cámara) */
        rotateY(0deg) rotateX(0deg) 
    `;

    // 4. Centrar los elementos en la pantalla antes de la transformación 3D
    photoDiv.style.left = `calc(50% - ${size / 2}px)`;
    photoDiv.style.top = `calc(50% - ${size / 2}px)`;
    
    photoDiv.appendChild(img);
    container.appendChild(photoDiv);
});

// === LÓGICA DE ARRASTRE (DRAG) PARA ROTAR LA GALAXIA ===
let isDragging = false;
let startX = 0;
let startY = 0;
let rotX = 0; // Rotación actual en el eje X
let rotY = 0; // Rotación actual en el eje Y

// Función para aplicar la rotación al contenedor principal
function applyRotation() {
    container.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

// 1. Iniciar el arrastre (presionar el ratón)
container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    container.style.cursor = 'grabbing'; // Cambia el cursor mientras arrastra
});

// 2. Moverse mientras se arrastra
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    // Calcula la diferencia de posición
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Ajusta la rotación (se reduce la velocidad dividiendo por un número mayor)
    rotY += deltaX / 5; // Arrastre horizontal -> Rotación Y
    rotX -= deltaY / 5; // Arrastre vertical -> Rotación X
    
    // Limita la rotación X para evitar voltear la vista
    rotX = Math.max(-90, Math.min(90, rotX));
    
    applyRotation();

    // Actualiza el punto de inicio para el siguiente movimiento
    startX = e.clientX;
    startY = e.clientY;
});

// 3. Detener el arrastre (soltar el ratón)
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