/* main.js - Ultra Godmode */
(() => {
  const WA = '6287867162459';

  /* Helper: open WA */
  window.openWA = (text) => {
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank');
  };

  window.buy = (title, price) => {
    const msg = `Halo saya ingin memesan:\nProduk: ${title}\nHarga: ${price}]`;
    openWA(msg);
  };

  window.preview = (title, img, desc, price) => {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modalContent');
    content.innerHTML = `
      <div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">
        <div style="flex:1;min-width:260px"><img src="${img}" style="width:100%;border-radius:8px;object-fit:cover" /></div>
        <div style="flex:1;min-width:220px">
          <h2 style="margin-top:0">${title}</h2>
          <p style="color:var(--muted)">${desc}</p>
          <div style="font-weight:800;margin-top:6px">${price}</div>
          <div style="margin-top:12px">
            <button class="btn" onclick="buy('${title}','${price}')">Pesan via WA</button>
            <button class="btn ghost" onclick="closeModal()">Tutup</button>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('open');
  };
  window.closeModal = () => document.getElementById('modal').classList.remove('open');

  /* Loading screen hide after boot (simulate boot sound) */
  const loading = document.getElementById('loading');
  setTimeout(()=> {
    loading.style.opacity = 0;
    setTimeout(()=> loading.style.display = 'none', 300);
    // play boot sound if exists
    const boot = document.querySelector('audio[data-type="boot"]');
    if (boot) { try { boot.play(); } catch(e){} }
  }, 900);

  document.getElementById('year').textContent = new Date().getFullYear();

  /* Toggle sound (if audio files added) */
  const toggleSound = document.getElementById('toggleSound');
  let soundOn = true;
  toggleSound.addEventListener('click', ()=> {
    soundOn = !soundOn;
    toggleSound.textContent = soundOn ? '🔊' : '🔈';
  });

  /* WA button */
  document.getElementById('btnWA').addEventListener('click', ()=> openWA('Halo saya ingin order beberapa produk.'));

  /* Order form -> WA */
  window.sendForm = (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value || '[nama]';
    const msg = document.getElementById('message').value || '';
    openWA(`Halo saya ingin pesan via form:\nNama: ${name}\nPesan: ${msg}`);
  };

  /* Promo slider (auto play) */
  (function slider(){
    const wrapper = document.getElementById('slider');
    const slides = Array.from(wrapper.children);
    let idx = 0;
    function show(i){
      slides.forEach((s,si)=> s.style.transform = `translateX(${(si-i)*100}%)`);
    }
    show(0);
    setInterval(()=> { idx = (idx+1) % slides.length; show(idx); }, 3000);
  })();

  /* Particle & Streak engine (RGB random) */
  (function particles(){
    const canvas = document.getElementById('scene');
    const ctx = canvas.getContext('2d');
    let w = canvas.width = innerWidth, h = canvas.height = innerHeight;
    window.addEventListener('resize', ()=> { w = canvas.width = innerWidth; h = canvas.height = innerHeight; });

    // points
    const points = [];
    for(let i=0;i<80;i++){
      points.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+0.4,vx:(Math.random()-0.5)*0.6,vy:(Math.random()-0.5)*0.6,color:randColor()});
    }

    // streaks
    const streaks = [];
    function spawnStreak(){
      const dir = Math.random()*Math.PI*2;
      const speed = Math.random()*2.6 + 0.6;
      const len = 80 + Math.random()*360;
      streaks.push({x:Math.random()*w,y:Math.random()*h,dx:Math.cos(dir)*speed,dy:Math.sin(dir)*speed,len,age:0,life:80+Math.random()*300,color:randColor(),th:Math.random()*2+0.6});
      if(streaks.length>120) streaks.shift();
    }
    for(let i=0;i<60;i++) spawnStreak();

    function randColor(){ const r = Math.floor(Math.random()*255); const g = Math.floor(Math.random()*255); const b = Math.floor(Math.random()*255); return `rgba(${r},${g},${b},1)`; }

    function step(){
      ctx.fillStyle = 'rgba(3,3,7,0.2)';
      ctx.fillRect(0,0,w,h);

      ctx.globalCompositeOperation = 'lighter';
      // points
      points.forEach(p=>{
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8);
        g.addColorStop(0,'rgba(255,255,255,0.8)');
        g.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0;
      });

      // streaks
      for(let i=0;i<streaks.length;i++){
        const s = streaks[i];
        const ex = s.x + s.dx * s.len; const ey = s.y + s.dy * s.len;
        const grad = ctx.createLinearGradient(s.x,s.y,ex,ey);
        grad.addColorStop(0,'rgba(255,255,255,0)');
        grad.addColorStop(0.2,'rgba(255,255,255,0.12)');
        grad.addColorStop(0.6,s.color);
        grad.addColorStop(1,'rgba(255,255,255,0)');
        ctx.lineWidth = s.th*2.6; ctx.strokeStyle = grad; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(ex,ey); ctx.stroke();
        ctx.lineWidth = Math.max(1,s.th*0.9); ctx.strokeStyle = s.color; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(ex,ey); ctx.stroke();
        s.x += s.dx; s.y += s.dy; s.age++;
        if(s.age > s.life || s.x < -w*0.4 || s.x > w*1.4 || s.y < -h*0.4 || s.y > h*1.4){
          streaks[i] = {x:Math.random()*w,y:Math.random()*h,dx:(Math.random()-0.5)*3,dy:(Math.random()-0.5)*3,len:80+Math.random()*300,age:0,life:80+Math.random()*300,color:randColor(),th:Math.random()*2+0.6};
        }
      }

      requestAnimationFrame(step);
    }
    step();

    // spawn new streaks occasionally
    setInterval(()=> spawnStreak(), 500 + Math.random()*800);
  })();

  /* Animated logo pulse */
  (function logoPulse(){
    const logo = document.getElementById('logo');
    let t = 0;
    function anim(){
      t += 0.03;
      const s = 1 + Math.sin(t)*0.03;
      logo.style.transform = `scale(${s})`;
      logo.style.boxShadow = `0 12px 40px rgba(0,200,255,0.08), 0 0 ${15+Math.abs(Math.sin(t)*25)}px rgba(255,0,128,0.12)`;
      requestAnimationFrame(anim);
    }
    anim();
  })();

  /* Click particle burst */
  document.addEventListener('click', (e)=>{
    const burst = document.createElement('div');
    burst.className = 'click-burst';
    burst.style.left = (e.clientX - 20) + 'px';
    burst.style.top = (e.clientY - 20) + 'px';
    document.body.appendChild(burst);
    setTimeout(()=> burst.remove(), 600);
    // optionally play click audio if available
    const audio = document.querySelector('audio[data-type="click"]');
    if(audio){ try{ audio.currentTime = 0; audio.play(); }catch(e){} }
  });

})();