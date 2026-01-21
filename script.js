// 粒子背景
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 50 + 30;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 8 + 8}s`;
        
        container.appendChild(particle);
    }
}

// 音乐播放器
function initMusicPlayer() {
    const audio = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    if (!audio || !toggle) return;
    
    audio.volume = 0.4;
    
    toggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                toggle.classList.add('playing');
            }).catch(() => {
                console.log('需要点击播放');
            });
        } else {
            audio.pause();
            toggle.classList.remove('playing');
        }
    });
    
    // 自动播放尝试
    setTimeout(() => {
        audio.play().then(() => {
            toggle.classList.add('playing');
        }).catch(() => {
            console.log('自动播放被阻止');
        });
    }, 1500);
}

// 页面加载完成
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initMusicPlayer();
    
    // 淡入动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

/* 画廊交互：水平轨道的 active 管理、按钮与滚动居中 */
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.chapters-track');
    if (!track) return;
    const chapters = Array.from(track.querySelectorAll('.chapter'));
    const prev = document.querySelector('.carousel-btn.prev');
    const next = document.querySelector('.carousel-btn.next');

    // 默认从第一张开始播放（索引 0），如果 HTML 指定了 active 则以其为准
    let active = chapters.findIndex(c => c.classList.contains('active'));
    if (active === -1) active = 0;

    function scrollToChapter(idx, behavior = 'smooth'){
        const el = chapters[idx];
        if(!el) return;
        const trackRect = track.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const currentScroll = track.scrollLeft;
        // 计算目标 scrollLeft，使 el 居中
        const offset = (el.offsetLeft + elRect.width / 2) - (track.clientWidth / 2);
        track.scrollTo({left: offset, behavior});
    }

    function setActive(idx){
        active = (idx + chapters.length) % chapters.length;
        chapters.forEach((c,i)=> c.classList.toggle('active', i===active));
        scrollToChapter(active);
    }

    chapters.forEach((c,i)=>{
        c.addEventListener('click', ()=> setActive(i));
    });

    if(prev) prev.addEventListener('click', ()=> setActive(active-1));
    if(next) next.addEventListener('click', ()=> setActive(active+1));

    // 根据滚动位置自动更新 active（节流）
    let scrollTimer = null;
    track.addEventListener('scroll', ()=>{
        if(scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(()=>{
            const center = track.scrollLeft + track.clientWidth/2;
            let closest = 0; let dist = Infinity;
            chapters.forEach((c,i)=>{
                const cCenter = c.offsetLeft + c.offsetWidth/2;
                const d = Math.abs(cCenter - center);
                if(d < dist){ dist = d; closest = i; }
            });
            setActive(closest);
        }, 120);
    });

    // 初始居中
    setTimeout(()=> setActive(active), 160);
    
    // 相框样式选择逻辑：支持金色/胶片/浮雕，持久化到 localStorage
    const frameBtns = Array.from(document.querySelectorAll('.frame-btn'));
    function applyFrameStyle(style){
        const frames = Array.from(document.querySelectorAll('.photo-frame'));
        frames.forEach(f=>{
            f.classList.remove('frame-gold','frame-film','frame-matte');
            f.classList.add('frame-' + style);
        });
        frameBtns.forEach(btn=> btn.classList.toggle('active', btn.dataset.style === style));
        try{ localStorage.setItem('frameStyle', style); }catch(e){}
    }
    frameBtns.forEach(btn=> btn.addEventListener('click', ()=> applyFrameStyle(btn.dataset.style)));
    const saved = (function(){ try{return localStorage.getItem('frameStyle')}catch(e){return null} })() || 'gold';
    applyFrameStyle(saved);
});
