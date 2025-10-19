// ===== Config =====
const photosData = []; // (si luego quieres fotos en órbita, las añadimos)
const container = document.getElementById('galaxy-container');
const STAR_CANVAS = document.getElementById('stars');

// ===== Drag 360° libre (mantiene tu experiencia de rotación) =====
let isDragging=false, startX=0, startY=0, rotX=70, rotY=0;
function applyRotation(){ container.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`; }
container.addEventListener('mousedown', (e)=>{ isDragging=true; startX=e.clientX; startY=e.clientY; container.style.cursor='grabbing'; });
document.addEventListener('mousemove', (e)=>{
  if(!isDragging) return;
  const dx=e.clientX-startX, dy=e.clientY-startY;
  rotY += dx/5; rotX -= dy/5; applyRotation();
  startX=e.clientX; startY=e.clientY;
});
document.addEventListener('mouseup', ()=>{ isDragging=false; container.style.cursor='grab'; });
container.addEventListener('touchstart', (e)=>{ isDragging=true; startX=e.touches[0].clientX; startY=e.touches[0].clientY; }, {passive:false});
document.addEventListener('touchmove', (e)=>{
  if(!isDragging) return;
  const dx=e.touches[0].clientX-startX, dy=e.touches[0].clientY-startY;
  rotY += dx/5; rotX -= dy/5; applyRotation();
  startX=e.touches[0].clientX; startY=e.touches[0].clientY;
}, {passive:false});
document.addEventListener('touchend', ()=>{ isDragging=false; });

// ===== Campo estelar: “infinidad” de puntos blancos intermitentes =====
// Implementado en canvas para rendimiento. Puedes subir STAR_COUNT si tu equipo lo aguanta.
(() => {
  const ctx = STAR_CANVAS.getContext('2d');
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let W=0, H=0;

  function resize(){
    const rect = container.getBoundingClientRect();
    W = Math.floor(rect.width  * dpr);
    H = Math.floor(rect.height * dpr);
    STAR_CANVAS.width  = W;
    STAR_CANVAS.height = H;
    STAR_CANVAS.style.width  = rect.width + 'px';
    STAR_CANVAS.style.height = rect.height + 'px';
  }

  const STAR_COUNT = 1800;         // ⭐️ cantidad (sube a 3000 si quieres aún más)
  const MAX_SIZE   = 2.3;          // tamaño máximo (en px @1x)
  const stars = [];

  function rand(a,b){ return a + Math.random()*(b-a); }

  function init(){
    stars.length = 0;
    for(let i=0;i<STAR_COUNT;i++){
      stars.push({
        x: Math.random(),                 // 0..1 relativo a W
        y: Math.random(),                 // 0..1 relativo a H
        r: rand(0.6, MAX_SIZE),           // radio base
        phase: rand(0, Math.PI*2),        // fase para parpadeo
        speed: rand(0.8, 1.6),            // velocidad del parpadeo
        flicker: rand(0.4, 1.0)           // amplitud del twinkle
      });
    }
  }

  function frame(t){
    // fondo muy oscuro, casi negro
    ctx.fillStyle = 'rgb(3,4,6)';
    ctx.fillRect(0,0,W,H);

    // dibujar estrellas
    for(const s of stars){
      // opacidad intermitente (twinkle)
      const alpha = 0.15 + 0.85 * Math.abs(Math.sin(s.phase + t*0.001*s.speed)) * s.flicker;

      // glow grande (más “destello”)
      const cx = s.x * W, cy = s.y * H, rr = s.r * dpr;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr*6);
      g.addColorStop(0.0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(0.25, `rgba(255,255,255,${alpha*0.7})`);
      g.addColorStop(1.0, `rgba(255,255,255,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, rr*6, 0, Math.PI*2);
      ctx.fill();

      // núcleo de la estrella
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha+0.15)})`;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  resize(); init(); requestAnimationFrame(frame);
  window.addEventListener('resize', resize, { passive:true });
})();
