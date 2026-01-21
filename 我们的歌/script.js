// 创建粒子背景
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机属性
        const size = Math.random() * 100 + 50;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 10;
        const animationDelay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// 音乐播放器
function initMusicPlayer() {
    const audio = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    
    // 尝试预加载音频
    audio.volume = 0.5;
    
    toggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                toggle.classList.add('playing');
            }).catch(err => {
                console.log('自动播放被阻止，需要用户交互:', err);
                // 某些浏览器需要用户交互后才能播放
                audio.play();
                toggle.classList.add('playing');
            });
        } else {
            audio.pause();
            toggle.classList.remove('playing');
        }
    });
    
    // 自动播放（部分浏览器支持）
    window.addEventListener('load', () => {
        // 延迟一点再尝试自动播放
        setTimeout(() => {
            audio.play().then(() => {
                toggle.classList.add('playing');
            }).catch(() => {
                // 自动播放失败是正常的，等待用户点击
                console.log('自动播放被阻止，等待用户点击');
            });
        }, 1000);
    });
}

// 照片点击放大效果
function initPhotoGallery() {
    const photos = document.querySelectorAll('.photo-item');
    
    photos.forEach((photo, index) => {
        photo.addEventListener('click', function() {
            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                backdrop-filter: blur(20px);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                cursor: zoom-out;
            `;
            
            const img = this.querySelector('img');
            const cloneImg = img.cloneNode();
            cloneImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 10px;
                transform: scale(0.8);
                transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            `;
            
            overlay.appendChild(cloneImg);
            document.body.appendChild(overlay);
            
            // 触发重排以启动动画
            setTimeout(() => {
                overlay.style.opacity = '1';
                cloneImg.style.transform = 'scale(1)';
            }, 10);
            
            // 点击关闭
            overlay.addEventListener('click', () => {
                overlay.style.opacity = '0';
                cloneImg.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 300);
            });
        });
    });
}

// 平滑滚动效果
function initSmoothScroll() {
    let ticking = false;
    
    function updateScroll() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.header');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
        
        ticking = false;
    }
    
    function requestScroll() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScroll);
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initMusicPlayer();
    initPhotoGallery();
    initSmoothScroll();
    
    // 添加页面加载完成动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 防止右键菜单（可选，保护图片）
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});