// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Mouse Tracking
const mouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
};

// Normalized mouse position for Three.js (-1 to 1)
const mousePlane = {
    x: 0,
    y: 0
};

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Normalize for Three.js plane interaction
    mousePlane.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePlane.y = -(e.clientY / window.innerHeight) * 2 + 1;
});



// Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Unobserve after reveal for performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all reveal elements
document.querySelectorAll('.reveal').forEach(elem => {
    revealObserver.observe(elem);
});

// Observe text reveal elements
document.querySelectorAll('.text-reveal').forEach(elem => {
    revealObserver.observe(elem);
});

// Easter Egg
let currentTheme = 'green';

// Create pill choice overlay
const pillOverlay = document.createElement('div');
pillOverlay.id = 'pill-overlay';
pillOverlay.innerHTML = `
    <canvas id="matrix-canvas"></canvas>
    <div class="pill-bg"></div>
    <div class="pill-container">
        <p class="pill-text">This is your last chance. After this, there is no turning back.</p>
        <div class="pill-choices">
            <button class="pill red-pill" data-color="red">
                <img src="Images/redPill.png" alt="Red Pill" class="pill-img">
                <span class="pill-label">Red Pill</span>
            </button>
            <button class="pill blue-pill" data-color="blue">
                <img src="Images/bluePill.png" alt="Blue Pill" class="pill-img">
                <span class="pill-label">Blue Pill</span>
            </button>
        </div>
        <p class="pill-subtext">Click the logo anytime to return to normal.</p>
    </div>
`;
document.body.appendChild(pillOverlay);

// Matrix Rain Effect for Pill Overlay
const matrixCanvas = document.getElementById('matrix-canvas');
const matrixCtx = matrixCanvas.getContext('2d');

function resizeMatrixCanvas() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
}
resizeMatrixCanvas();
window.addEventListener('resize', resizeMatrixCanvas);

// Matrix characters
const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 14;
let columns = Math.floor(matrixCanvas.width / fontSize);
let drops = [];

// Initialize drops
function initDrops() {
    columns = Math.floor(matrixCanvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
}
initDrops();
window.addEventListener('resize', initDrops);

// Subtle rainbow colors matching the website tone
const matrixColors = [
    'rgba(65, 175, 117, 0.6)',   // Green (accent)
    'rgba(45, 155, 97, 0.5)',    // Darker green
    'rgba(72, 149, 239, 0.5)',   // Blue
    'rgba(230, 57, 70, 0.5)',    // Red
    'rgba(147, 112, 219, 0.4)',  // Purple
    'rgba(64, 224, 208, 0.4)',   // Teal
    'rgba(255, 165, 0, 0.4)',    // Orange
];

let matrixAnimationId = null;

function drawMatrix() {
    // Semi-transparent black to create trail effect
    matrixCtx.fillStyle = 'rgba(5, 5, 5, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    
    matrixCtx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        
        // Random color from palette
        const color = matrixColors[Math.floor(Math.random() * matrixColors.length)];
        matrixCtx.fillStyle = color;
        
        // Draw character
        matrixCtx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        // Reset drop to top randomly after reaching bottom
        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        drops[i]++;
    }
    
    matrixAnimationId = requestAnimationFrame(drawMatrix);
}

function startMatrixRain() {
    if (!matrixAnimationId) {
        // Clear canvas first
        matrixCtx.fillStyle = 'rgba(5, 5, 5, 1)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        drawMatrix();
    }
}

function stopMatrixRain() {
    if (matrixAnimationId) {
        cancelAnimationFrame(matrixAnimationId);
        matrixAnimationId = null;
    }
}

// Theme configurations
const themes = {
    green: {
        accent: '#41af75',
        accentGlow: 'rgba(65, 175, 117, 0.3)',
        threeColor: 0x41af75
    },
    red: {
        accent: '#e63946',
        accentGlow: 'rgba(230, 57, 70, 0.3)',
        threeColor: 0xe63946
    },
    blue: {
        accent: '#4895ef',
        accentGlow: 'rgba(72, 149, 239, 0.3)',
        threeColor: 0x4895ef
    }
};

function applyTheme(themeName) {
    const theme = themes[themeName];
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--accent-glow', theme.accentGlow);
    currentTheme = themeName;
}

function showPillChoice() {
    pillOverlay.classList.add('active');
    startMatrixRain();
}

function hidePillChoice() {
    pillOverlay.classList.remove('active');
    stopMatrixRain();
}

// Pill button listeners
document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
        const color = pill.dataset.color;
        applyTheme(color);
        hidePillChoice();
    });
});

// Logo click handler
const logo = document.querySelector('.logo a');
let clickCount = 0;
let clickTimer = null;

if (logo) {
    logo.addEventListener('click', (e) => {
        // If in a non-green theme, single click resets
        if (currentTheme !== 'green') {
            e.preventDefault();
            applyTheme('green');
            clickCount = 0;
            return;
        }
        
        clickCount++;
        
        if (clickCount >= 3) {
            e.preventDefault();
            showPillChoice();
            clickCount = 0;
        }
        
        // Reset counter after 800ms of no clicks
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 800);
    });
}

// Interactive Background
try {
    let container = document.getElementById('canvas-container');
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Higher resolution geometry for smoother ripples
    const geometry = new THREE.PlaneGeometry(50, 50, 150, 150);
    
    const material = new THREE.MeshPhongMaterial({
        color: themes.green.threeColor,
        shininess: 80,
        specular: 0x222222,
        wireframe: true,
        opacity: 0.12,
        transparent: true
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    camera.position.set(0, 4, 8);
    camera.lookAt(scene.position);

    let clock = new THREE.Clock();

    // Store original positions for ripple calculation
    const originalPositions = [];
    const verts = plane.geometry.attributes.position;
    for (let i = 0; i < verts.count; i++) {
        originalPositions.push({
            x: verts.getX(i),
            y: verts.getY(i)
        });
    }

    function animate() {
        requestAnimationFrame(animate);

        const t = clock.getElapsedTime() * 0.5;

        for (let i = 0; i < verts.count; i++) {
            const origX = originalPositions[i].x;
            const origY = originalPositions[i].y;
            
            // Base wave animation
            const waveX1 = 0.35 * Math.sin(origX * 1.2 + t);
            const waveX2 = 0.2 * Math.sin(origX * 2.5 + t * 1.5);
            const waveY1 = 0.25 * Math.sin(origY * 1.2 + t);
            const baseWave = waveX1 + waveX2 + waveY1;
            
            // Mouse-reactive ripple effect
            const mouseWorldX = mousePlane.x * 25;
            const mouseWorldY = mousePlane.y * 25;
            
            const dx = origX - mouseWorldX;
            const dy = origY - mouseWorldY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Gaussian falloff for ripple effect
            const rippleStrength = 2.0;
            const rippleFalloff = 0.08;
            const ripple = rippleStrength * Math.exp(-dist * dist * rippleFalloff);
            
            const rippleWave = ripple * Math.sin(dist * 0.5 - t * 3) * 0.3;
            
            verts.setZ(i, baseWave + ripple + rippleWave);
        }

        verts.needsUpdate = true;
        
        // Update Three.js color based on current theme
        const themeColor = themes[currentTheme].threeColor;
        plane.material.color.setHex(themeColor);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
} catch (error) {
    console.error("Failed to initialize 3D animation:", error);
    const canvas = document.getElementById('canvas-container');
    if (canvas) canvas.style.display = 'none';
}

// Preloader
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
        
        // Remove from DOM after transition
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    }
}

// Hide preloader when window fully loads
window.addEventListener('load', () => {
    // Small delay for smoother experience after load
    setTimeout(hidePreloader, 200);
});

// Fallback: Hide preloader after max wait time regardless
setTimeout(hidePreloader, 3000);

// Projects Layout
const projectsGrid = document.querySelector('.projects-grid');

function updateProjectsLayout() {
    if (!projectsGrid) return;
    
    const visibleCards = projectsGrid.querySelectorAll('.project-card:not([style*="display: none"])');
    const count = visibleCards.length;
    
    // Remove existing count classes
    projectsGrid.className = projectsGrid.className.replace(/count-\d+/g, '').trim();
    projectsGrid.classList.add('projects-grid');
    
    // Add count class for CSS styling
    if (count >= 3 && count <= 7) {
        projectsGrid.classList.add(`count-${count}`);
    }
}

// Initial layout
updateProjectsLayout();

// Filter Buttons
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Filter logic
        const filter = btn.dataset.filter;
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update layout after filtering
        updateProjectsLayout();
        
        // Re-trigger animations for visible cards
        setTimeout(() => {
            const visibleCards = document.querySelectorAll('.project-card:not([style*="display: none"])');
            visibleCards.forEach(card => {
                card.classList.remove('active');
                setTimeout(() => card.classList.add('active'), 50);
            });
        }, 50);
    });
});
