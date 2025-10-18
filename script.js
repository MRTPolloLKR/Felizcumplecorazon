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
const numHearts = 15; // Número de corazones extra que deseas añadir

// Función para obtener un número aleatorio dentro de un rango
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// === LÓGICA PARA LAS FOTOS/ESTRELLAS ===
photos.forEach((photoUrl, index) => {
    const photoDiv = document.createElement('div');
    const img = document.createElement('img');

    img.src = photoUrl;
    img.alt = `Estrella ${index + 1}`;
    photoDiv.classList.add('star-photo');

    // Posicionamiento y tamaño aleatorio
    const size = random(50, 120); // Tamaño entre 50px y 120px
    const xPos = random(10, 90); // Posición X (10% a 90% para no pegar a los bordes)
    const yPos = random(10, 90); // Posición Y
    
    // Posicionamiento 3D para la "espiral" de la galaxia (simula profundidad)
    const zPos = random(-400, 400); // Profundidad Z entre -400px y 400px
    const rotationX = random(0, 360);
    const rotationY = random(0, 360);

    photoDiv.style.width = `${size}px`;
    photoDiv.style.height = `${size}px`;
    photoDiv.style.left = `${xPos}vw`;
    photoDiv.style.top = `${yPos}vh`;
    
    // Aplicamos la rotación y la profundidad
    photoDiv.style.transform = `
        translateZ(${zPos}px) 
        rotateX(${rotationX}deg) 
        rotateY(${rotationY}deg)
    `;

    photoDiv.appendChild(img);
    container.appendChild(photoDiv);
});

// === LÓGICA PARA CORAZONES EXTRA (OPCIONAL) ===
for (let i = 0; i < numHearts; i++) {
    const heart = document.createElement('span');
    heart.classList.add('heart');
    
    // El carácter de corazón ❤️
    heart.innerHTML = '&#x2764;'; 

    // Posicionamiento aleatorio de los corazones
    const xPos = random(5, 95);
    const yPos = random(5, 95);
    const zPos = random(-300, 300); 
    const size = random(1.5, 3.5); // Tamaño de fuente entre 1.5em y 3.5em
    
    heart.style.left = `${xPos}vw`;
    heart.style.top = `${yPos}vh`;
    heart.style.fontSize = `${size}em`;
    
    // Posición 3D y retraso de animación
    heart.style.transform = `translateZ(${zPos}px)`;
    heart.style.animationDelay = `${random(0, 5)}s`;

    container.appendChild(heart);
}