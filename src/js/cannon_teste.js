import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGL1Renderer();

renderer.setSize(innerWidth, innerHeight);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
    
scene.background = new THREE.Color("rgb(23, 247, 255)");
// scene.background = new THREE.Color(0xffffff);

camera.position.set(0, 2, 50);

orbit.update();

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphereMesh);

const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});

const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    // mass: 1,
    // shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
    type: CANNON.Body.STATIC,
    material: new CANNON.Material()
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

const boxBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    mass: 1,
    position: new CANNON.Vec3(1, 20, 0),
    material: new CANNON.Material()
});
world.addBody(boxBody);

boxBody.angularVelocity.set(0, 10, 0);
boxBody.angularDamping = 0.5;

const groundBoxContactMat = new CANNON.ContactMaterial(
    groundBody.material,
    boxBody.material,
    {friction: 0.01}
);

world.addContactMaterial(groundBoxContactMat);

const sphereBody = new CANNON.Body({
    shape: new CANNON.Sphere(2),
    mass: 1,
    position: new CANNON.Vec3(0, 15, 0),
    material: new CANNON.Material()
});

world.addBody(sphereBody);

// olhar depois na doc
sphereBody.linearDamping = 0.31;
sphereBody.angularDamping = 0.16;

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundBody.material,
    sphereBody.material,
    {restitution: 0.9}
);

world.addContactMaterial(groundSphereContactMat);

const cannonDebugger = new CannonDebugger(scene, world, {
    color: 0xffffff,
});

const carBody = new CANNON.Body({
    mass: 5,
    position: new CANNON.Vec3(0, 6, 0),
    shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 2))
});

const vehicle = new CANNON.RigidVehicle({
    chassisBody: carBody
});

// posicoes das rodas
const positions = [
    new CANNON.Vec3(-2, 0, 2,5),
    new CANNON.Vec3(-2, 0, -2,5),
    new CANNON.Vec3(2, 0, 2,5),
    new CANNON.Vec3(2, 0, -2,5),
];

for (var i = 0; i < 4; ++i) {
    vehicle.addWheel({
        body: new CANNON.Body({mass: 1, material: new CANNON.Material('wheel')}),
        position: positions[i],
        axis: new CANNON.Vec3(0, 0, 1),
        direction: new CANNON.Vec3(0, -1, 0)
    });
    vehicle.wheelBodies[i].addShape(new CANNON.Sphere(1));
    vehicle.wheelBodies[i].angularDamping = 0.4;
}

document.addEventListener('keydown', (e) => {

    const maxSteerVal = Math.PI / 8;
    const maxForce = 10;

    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            vehicle.setWheelForce(maxForce, 0);
            vehicle.setWheelForce(maxForce, 1);
            break;

        case 's':
        case 'ArrowDown':
            vehicle.setWheelForce(-maxForce / 2, 0);
            vehicle.setWheelForce(-maxForce / 2, 1);
            break;
    
        case 'a':
        case 'ArrowLeft':
            vehicle.setSteeringValue(maxSteerVal, 0);
            vehicle.setSteeringValue(maxSteerVal, 1);
            break;

        case 'd':
        case 'ArrowRight':
            vehicle.setSteeringValue(-maxSteerVal, 0);
            vehicle.setSteeringValue(-maxSteerVal, 1);
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            vehicle.setWheelForce(0, 0);
            vehicle.setWheelForce(0, 1);
            break;

        case 's':
        case 'ArrowDown':
            vehicle.setWheelForce(0, 0);
            vehicle.setWheelForce(0, 1);
            break;
    
        case 'a':
        case 'ArrowLeft':
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
            break;

        case 'd':
        case 'ArrowRight':
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
            break;
    }
});

vehicle.addToWorld(world);

function animate() {
    world.step(1 / 60);
    // world.fixedStep();
    cannonDebugger.update();

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
});