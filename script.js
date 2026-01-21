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