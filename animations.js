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


try {

    const colorPalette = [
            0x1d7b53, 0x1c7a5f, 0x1b796a, 0x1a7c70, 0x198075,
            0x1a8270, 0x1b816a, 0x1c7f65, 0x1d7d5e, 0x1e7c5a
        ];

    let container = document.getElementById('canvas-container');
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);


    const geometry = new THREE.PlaneGeometry(50, 50, 120, 120);
    
    const material = new THREE.MeshPhongMaterial({
        color: colorPalette[0],
        shininess: 80,
        specular: 0x222222,
        wireframe: true,
        opacity: 0.15,
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

    let currentColorIndex = 0;
    let nextColorIndex = 1;
    let transitionProgress = 0;
    const transitionSpeed = 0.02;

    function animate() {
        requestAnimationFrame(animate);

        const t = clock.getElapsedTime() * 0.5;
        const verts = plane.geometry.attributes.position;

        for (let i = 0; i < verts.count; i++) {
            const x = verts.getX(i);
            const y = verts.getY(i);
            const waveX1 = 0.4 * Math.sin(x * 1.5 + t);
            const waveX2 = 0.2 * Math.sin(x * 2.5 + t * 1.5);
            const waveY1 = 0.3 * Math.sin(y * 1.5 + t);
            verts.setZ(i, waveX1 + waveX2 + waveY1);
        }

        verts.needsUpdate = true;
        
        transitionProgress += transitionSpeed;

        const sourceColor = new THREE.Color(colorPalette[currentColorIndex]);
        const targetColor = new THREE.Color(colorPalette[nextColorIndex]);
        
        plane.material.color.copy(sourceColor).lerp(targetColor, transitionProgress);

        if (transitionProgress >= 1) {
            transitionProgress = 0;
            currentColorIndex = nextColorIndex;
            nextColorIndex = (currentColorIndex + 1) % colorPalette.length;
        }

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
} catch (error)
    {
    console.error("Failed to initialize 3D animation:", error);
    document.getElementById('canvas-container').style.display = 'none';
}