import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer, controls;
let plane;
let pointer, raycaster, isShiftDown = false, isCtrlDown = false;

let rollOverMesh, rollOverMaterial;
let cubeGeo, cubeMaterial;

const objects = [];

init();
render();

function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(500, 800, 1300);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);



    // Initialize OrbitControls
    controls = new OrbitControls(camera, document.body);
    controls.enableDamping = true; // Smooth rotation
    controls.dampingFactor = 0.05;
    controls.minDistance = 50;
    controls.maxDistance = 1000;
    controls.enablePan = false; // Disable panning
    controls.enableZoom = true; // Allow zooming
    controls.enableRotate = false; // Disable rotation by default
    controls.zoomSpeed = 1.2; // Adjust zoom speed (increase for faster zooming)

    // Roll-over helpers
    const rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
    rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    scene.add(rollOverMesh);

    // Cubes
    const map = new THREE.TextureLoader().load('static/textures/img_1.png');
    map.colorSpace = THREE.SRGBColorSpace;
    cubeGeo = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xfeb74c, map: map });

    // Grid
    const gridHelper = new THREE.GridHelper(1000, 20);
    scene.add(gridHelper);

    // Raycasting
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    const geometry = new THREE.PlaneGeometry(1000, 1000);
    geometry.rotateX(-Math.PI / 2);

    plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
    scene.add(plane);
    objects.push(plane);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x606060, 3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onDocumentKeyDown);
    document.addEventListener('keyup', onDocumentKeyUp);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function onPointerMove(event) {
    pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(objects, false);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
        rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        render();
    }
}

function onPointerDown(event) {
    if (isCtrlDown) {
        return; // Skip object placement when CTRL is held
    }

    pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(objects, false);

    if (intersects.length > 0) {
        const intersect = intersects[0];

        if (isShiftDown) {
            if (intersect.object !== plane) {
                scene.remove(intersect.object);
                objects.splice(objects.indexOf(intersect.object), 1);
            }
        } else {
            const voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
            voxel.position.copy(intersect.point).add(intersect.face.normal);
            voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
            scene.add(voxel);
            objects.push(voxel);
        }
        render();
    }
}

function onDocumentKeyDown(event) {
    if (event.key === "Shift") {
        isShiftDown = true;
    }
    if (event.key === "Control") {
        isCtrlDown = true;
        controls.enableRotate = true; // Allow camera rotation only when CTRL is held
    }
}

function onDocumentKeyUp(event) {
    if (event.key === "Shift") {
        isShiftDown = false;
    }
    if (event.key === "Control") {
        isCtrlDown = false;
        controls.enableRotate = false; // Disable rotation when CTRL is released
    }
}

function render() {
    controls.update(); // Ensure OrbitControls updates before rendering
    renderer.render(scene, camera);
}

document.addEventListener('wheel', (event) => {
    event.preventDefault();
    camera.position.z += event.deltaY * 0.5; // Adjust zoom speed
    render();
}, { passive: false });
