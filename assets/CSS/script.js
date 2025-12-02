// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    detectDevice();
    setupBackground();
    enhanceButtons();
    setupPS3Helpers();
    setupSidebarEnhancements();
    setupOnlineCount();
    setupSmoothScroll();

    // Debug device detection
    console.log("Running on:", window.deviceType);
});

// ==================== DEVICE DETECTION ====================
function detectDevice() {
    const ua = navigator.userAgent;
    window.isPS3 = ua.match(/PLAYSTATION 3|PS3/i);
    window.isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
    window.deviceType = isPS3 ? "PS3" : isMobile ? "Mobile" : "Desktop";
}

// ==================== BACKGROUND ANIMATION ====================
function setupBackground() {
    const bg = document.getElementById('movingBg');
    if (!bg) return;

    if (isPS3) {
        let pos = 0;
        setInterval(() => {
            pos -= 0.5;
            bg.style.transform = `translateX(${pos}px)`;
            if (pos <= -1280) pos = 0;
        }, 100);
        return;
    }

    if (isMobile) {
        bg.classList.add('mobile-bg');
    } else {
        bg.classList.add('desktop-bg');
        window.addEventListener('scroll', handleParallax);
    }
}

function handleParallax() {
    const yPos = window.scrollY * 0.3;
    const container = document.querySelector('.bg-container');
    if (container) {
        container.style.backgroundPositionY = `${yPos}px`;
    }
}

// ==================== BUTTON ENHANCEMENTS ====================
function enhanceButtons() {
    const buttons = document.querySelectorAll('.glowing-button');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
            btn.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        });

        btn.addEventListener('click', function(e) {
            if (!isPS3) {
                createRippleEffect(e, this);
            }
        });
    });
}

function createRippleEffect(e, button) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    Object.assign(ripple.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x - size/2}px`,
        top: `${y - size/2}px`,
        position: 'absolute',
        background: 'rgba(255, 255, 255, 0.4)',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'ripple 0.6s linear',
        pointerEvents: 'none'
    });
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// ==================== PS3 SPECIFIC HELPERS ====================
function setupPS3Helpers() {
    if (!isPS3) return;

    document.querySelectorAll('[href*="download"]').forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            alert('[PS3 INSTRUCTIONS]\n1. Press Triangle\n2. Select "Save Link Target"\n3. Choose destination');
        };
    });

    const buttons = document.querySelectorAll('.glowing-button');
    buttons.forEach(btn => {
        btn.onclick = function() {
            const originalBg = this.style.background;
            this.style.background = originalBg.replace('0.3', '0.6');
            setTimeout(() => {
                this.style.background = originalBg;
            }, 300);
        };
    });
}

// ==================== SIDEBAR ENHANCEMENTS ====================
function setupSidebarEnhancements() {
    const toggleBtn = document.getElementById('toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const closeBtn = document.getElementById('close-sidebar');
    if (!(toggleBtn && sidebar && overlay && closeBtn)) return;

    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        // Optionally, prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Optional: close sidebar on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
}

// ==================== ONLINE COUNT SIMULATION ====================
function setupOnlineCount() {
    const onlineCount = document.getElementById('online-count');
    if (!onlineCount) return;
    // Simulate online users (random for demo)
    function updateCount() {
        const count = 10 + Math.floor(Math.random() * 90);
        onlineCount.textContent = `Online: ${count}`;
    }
    updateCount();
    setInterval(updateCount, 5000);
}

// ==================== SMOOTH SCROLL FOR ANCHORS ====================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ==================== CLEANUP ====================
window.addEventListener('beforeunload', function() {
    if (!isPS3 && !isMobile) {
        window.removeEventListener('scroll', handleParallax);
    }
});

window.addEventListener("load", () => {
    document.getElementById("loader").classList.add("hide");
});
