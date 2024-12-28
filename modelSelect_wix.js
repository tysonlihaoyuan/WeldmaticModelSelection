class ThreeTestElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Attach shadow DOM
    }

    connectedCallback() {


        this.loadScripts([
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
            "https://cdn.jsdelivr.net/npm/three/examples/js/controls/OrbitControls.min.js",
        ])
            .then(() => {
                this.initThreeJSScene();
            })
            .catch((err) => {
                console.error("Failed to load scripts:", err);
            });
    }

    loadScripts(urls) {
        return Promise.all(
            urls.map(
                (url) =>
                    new Promise((resolve, reject) => {
                        if (document.querySelector(`script[src="${url}"]`)) {
                            resolve(); // Script already loaded
                            return;
                        }

                        const script = document.createElement("script");
                        script.src = url;
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    })
            )
        );
    }
initThreeJSScene() {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xFFFFFF,1)
    this.shadowRoot.appendChild(renderer.domElement);

    // Add a rotating cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add lights to the scene
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    camera.position.set(2, 2, 5);

    // Add OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    controls.update();

     const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.left = '50%';
    buttonContainer.style.transform = 'translateX(-50%)';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    this.shadowRoot.appendChild(buttonContainer);

    // Function to create a button
    const createButton = (iconClass, clickHandler) => {
        const button = document.createElement('button');
        button.className = 'btn btn-light';
        button.style.width = '50px';
        button.style.height = '50px';
        button.innerHTML = `${iconClass}`;
        button.addEventListener('click', clickHandler);
        buttonContainer.appendChild(button);
    };

    // Original scale and position
    const originalScale = cube.scale.clone();
    const originalPosition = cube.position.clone();

    // Buttons
    createButton('up rotate', () => (cube.rotation.x += Math.PI / 8)); // Rotate clockwise
    createButton('down rotate', () => (cube.rotation.x -= Math.PI / 8)); // Rotate counterclockwise
    createButton('clockwise', () => (cube.rotation.y += Math.PI / 8)); // Rotate forward
    createButton('counterclockwise', () => (cube.rotation.y -= Math.PI / 8)); // Rotate backward
    createButton('+', () => cube.scale.multiplyScalar(1.2)); // Upsize
    createButton('-', () => cube.scale.multiplyScalar(0.8)); // Downsize
    createButton('reset', () => {
        cube.scale.copy(originalScale); // Reset scale
        cube.position.copy(originalPosition); // Reset position
        cube.rotation.set(0, 0, 0); // Reset rotation
    }); // Reset

    function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

    
}


 
}

// Define the custom element
customElements.define("three-element", ThreeTestElement);
