import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

const VS = `

varying vec4 pos;
varying vec3 v_normal;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    pos = vec4(position,1.0);
    v_normal = normal;
}
`;
const FS = `
varying vec4 pos;
varying vec3 v_normal;
void main() {
    gl_FragColor = (vec4(v_normal*v_normal, 1.0)+ pos )* (vec4(v_normal*v_normal, 1.0) - pos)*((vec4(v_normal*v_normal, 1.0)+ pos )* (vec4(v_normal*v_normal, 1.0) - pos)) + vec4(0.0,0.0,0.0,1.0) ;
}
`;

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

console.log(camera);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, -30);
orbit.update();

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.ShaderMaterial({
	uniforms:{},
    vertexShader:VS,
    fragmentShader:FS
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.ShaderMaterial({
	uniforms:{},
    vertexShader:VS,
    fragmentShader:FS
});
const sphereMesh = new THREE.Mesh( sphereGeo, sphereMat);
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

const groundPhysMat = new CANNON.Material();

const groundBody = new CANNON.Body({
    //shape: new CANNON.Plane(),
    //mass: 10
    shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

const boxPhysMat = new CANNON.Material();

const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    position: new CANNON.Vec3(1, 20, 0),
    material: boxPhysMat
});
world.addBody(boxBody);

boxBody.angularVelocity.set(0, 10, 0);
boxBody.angularDamping = 0.5;

const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    boxPhysMat,
    {friction: 0.04}
);

world.addContactMaterial(groundBoxContactMat);

const spherePhysMat = new CANNON.Material();

const sphereBody = new CANNON.Body({
    mass: 4,
    shape: new CANNON.Sphere(2),
    position: new CANNON.Vec3(0, 10, 0),
    material: spherePhysMat
});
world.addBody(sphereBody);

sphereBody.linearDamping = 0.21

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.9}
);

world.addContactMaterial(groundSphereContactMat);


const carBody = new CANNON.Body({
    mass: 5,
    position: new CANNON.Vec3(0, 6, 0),
    shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 2))
});

const vehicle = new CANNON.RigidVehicle({
    chassisBody:carBody
});

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

vehicle.addToWorld(world);

const FS2 = `
varying vec4 pos;
varying vec3 v_normal;
void main() {
    gl_FragColor = (vec4(v_normal, 1.0)*pos) ;
}
`;

const criarMaterial = () => new THREE.ShaderMaterial({uniforms:{}, vertexShader:VS, fragmentShader:FS2});

const carro = {
    chassis:  new THREE.Mesh(new THREE.BoxGeometry(8, 1, 4), criarMaterial()),
    roda1: new THREE.Mesh(new THREE.SphereGeometry(1), criarMaterial()),
    roda2: new THREE.Mesh(new THREE.SphereGeometry(1), criarMaterial()),
    roda3: new THREE.Mesh(new THREE.SphereGeometry(1), criarMaterial()),
    roda4: new THREE.Mesh(new THREE.SphereGeometry(1), criarMaterial())
}

scene.add(carro.chassis);
scene.add(carro.roda1);
scene.add(carro.roda2);
scene.add(carro.roda3);
scene.add(carro.roda4);

console.log(vehicle)

const maxForce = 100;
const maxSteerVal = Math.PI / 8;

document.addEventListener('keydown', (e) => {
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
        case 'Enter':
            camera.lockOn = !camera.lockOn;
            break;
    }
});

const timeStep = 1 / 60;



function animate() {
    world.step(timeStep);

    carro.chassis.position.copy(vehicle.chassisBody.position);
    carro.roda1.position.copy(vehicle.wheelBodies[0].position);
    carro.roda2.position.copy(vehicle.wheelBodies[1].position);
    carro.roda3.position.copy(vehicle.wheelBodies[2].position);
    carro.roda4.position.copy(vehicle.wheelBodies[3].position);
    carro.chassis.quaternion.copy(vehicle.chassisBody.quaternion);
    carro.roda1.quaternion.copy(vehicle.wheelBodies[0].quaternion);
    carro.roda2.quaternion.copy(vehicle.wheelBodies[1].quaternion);
    carro.roda3.quaternion.copy(vehicle.wheelBodies[2].quaternion);
    carro.roda4.quaternion.copy(vehicle.wheelBodies[3].quaternion);

    console.log(camera.lockOn)

    if(camera.lockOn){
        camera.position.x = vehicle.chassisBody.position.x;
        camera.position.y = vehicle.chassisBody.position.y + 10;
        camera.position.z = vehicle.chassisBody.position.z - 10;
    }

    // const x = vehicle.wheelBodies[3].position.x + vehicle.wheelBodies[2].position.x;
    // const y = vehicle.wheelBodies[3].position.y + vehicle.wheelBodies[2].position.y;
    // const z = vehicle.wheelBodies[3].position.z + vehicle.wheelBodies[2].position.z;

    // camera.lookAt(new THREE.Vector3(x/2,y/2,z/2));


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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
