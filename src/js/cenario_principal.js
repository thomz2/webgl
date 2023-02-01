import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import Race from './race';
import {Track, Tree, Building} from './objetos.js';

console.log(Track)

import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import { Carro } from './classes/Car1';

//Shaders
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

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, -30);

orbit.update();

const options = {
    boxMass: 0.3,
    sphereMass: 1,
    wheelForce: 10,
    wheelSteer: Math.PI / 8,
    debug: false,
    tamanhoCarro: 1
};

gui = new dat.GUI();

gui.add(options, 'boxMass', 0.1, 2);
gui.add(options, 'sphereMass', 0.1, 2);
gui.add(options, 'wheelForce', 5, 100);
gui.add(options, 'wheelSteer', Math.PI / 16, Math.PI / 2);
gui.add(options, 'tamanhoCarro', 0.1, 1.5);
gui.add({"Mudar Câmera": () => camera.lockOn = !camera.lockOn}, 'Mudar Câmera')
gui.add({"Modo debug": () => options.debug = !options.debug}, 'Modo debug')

//Malhas do Threejs
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

const groundGeo = new THREE.PlaneGeometry(300, 300);
const groundMat = new THREE.MeshBasicMaterial({ 
	side: THREE.DoubleSide,
    wireframe: true
 });

const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

const pista = new THREE.Mesh(new Track(Race.track), new THREE.MeshBasicMaterial({color: 0xFF00F0, wireframe:true}));
scene.add(pista);

//Adciona as arvores
Race.trees.map(arvore => {
    const tree = new Tree(0.55, 4, 4); 
    tree.position.set(...arvore.position); 
    scene.add(tree)
});

//Adciona as construções
Race.buildings.map(construcao =>{
    scene.add(new THREE.Mesh(
        new Building(construcao),
        new THREE.MeshBasicMaterial({color: 0xFFFF00, wireframe:true})
    ))
});

const carro = new Carro();

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});

const cannonDebugger = new CannonDebugger(scene, world, {
    color: 0xffffff,
});

//Cannonjs, definição dos corpos
const groundPhysMat = new CANNON.Material();

const groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(150, 150, 0.1)),
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

var maxForce = 40;
var maxSteerVal = Math.PI / 8;

const vehicle = carro.vehicle;

carro.addToScene(scene);
carro.addToWorld(world);

// adicionando corpos das arvores pelo CANNON
Race.trees.map(arvore => {

    const tree = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(...arvore.position).vadd(new CANNON.Vec3(0,2,0)), // somando vetor
        material: boxPhysMat
    });

    tree.addShape(
        new CANNON.Cylinder(0.55,0.55,4,20),
        new CANNON.Vec3(0,0,0),
        new CANNON.Quaternion()
    );

    tree.addShape(
        new CANNON.Cylinder(0.01,5,16,20),
        new CANNON.Vec3(0,10,0),
        new CANNON.Quaternion()
    );

    world.addBody(tree);
});

//CAMERA EM TERCEIRA PESSOA
class ThirdPersonCamera {
    constructor(params){
        this._params = params;
        this._camera = params.camera;
        
        this._currentPosition = new THREE.Vector3();
        this._currentLookAt = new THREE.Vector3();
    }
    
    _CalculateIdealOffset(){
        const idealOffset = new THREE.Vector3(...this._params.position);
        idealOffset.applyQuaternion(this._params.target.quaternion);
        idealOffset.add(this._params.target.position);
        return idealOffset;
    }

    _CalculateIdealLookAt(){
        const idealLookAt = new THREE.Vector3(...this._params.lookAt);
        idealLookAt.applyQuaternion(this._params.target.quaternion);
        idealLookAt.add(this._params.target.position);
        return idealLookAt;
    }

    Update(){
        const idealOffset = this._CalculateIdealOffset();
        const idealLookAt = this._CalculateIdealLookAt();

        this._currentPosition.copy(idealOffset);
        this._currentLookAt.copy(idealLookAt);

        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookAt)
    }
}

//Instância da camera em terceira pessoa
//Target é o alvo observado
//Position é a posição em relação ao alvo, nesse caso atrás e em cima
//LookAt é onde a camera aponta em relação ao alvo
const thirdPerson = new ThirdPersonCamera({
    camera: camera,
    target: carro.carroMesh.chassis,
    position: [20, 5, 0],
    lookAt: [-25,0,0]
});

//Listeners
document.addEventListener('keydown', (e) => {
    switch (e.key) {

        case 'W':
        case 'w':
        case 'ArrowUp':
            vehicle.setWheelForce(maxForce, 0);
            vehicle.setWheelForce(maxForce, 1);
            break;

        case 'S':
        case 's':
        case 'ArrowDown':
            vehicle.setWheelForce(-maxForce / 2, 0);
            vehicle.setWheelForce(-maxForce / 2, 1);
            break;
    
        case 'A':
        case 'a':
        case 'ArrowLeft':
            vehicle.setSteeringValue(maxSteerVal, 0);
            vehicle.setSteeringValue(maxSteerVal, 1);
            break;

        case 'D':
        case 'd':
        case 'ArrowRight':
            vehicle.setSteeringValue(-maxSteerVal, 0);
            vehicle.setSteeringValue(-maxSteerVal, 1);
            break;
        }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'W':
        case 'w':
        case 'ArrowUp':
            vehicle.setWheelForce(0, 0);
            vehicle.setWheelForce(0, 1);
            break;
            
        case 'S':
        case 's':
        case 'ArrowDown':
            vehicle.setWheelForce(0, 0);
            vehicle.setWheelForce(0, 1);
            break;
            
        case 'A':
            case 'a':
        case 'ArrowLeft':
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
            break;

        case 'D':
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


function attOptions() {
    boxBody.mass = options.boxMass;
    sphereBody.mass = options.sphereMass;
    maxForce = options.wheelForce;
    maxSteerVal = options.wheelSteer;
    carro.setTamanho(options.tamanhoCarro);
}

function animate() {
    world.step(timeStep);
    
    if(options.debug) cannonDebugger.update()

    carro.attPositions();

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    renderer.render(scene, camera);

    //Ao pressionar enter, muda para terceira pessoa
    if(camera.lockOn) thirdPerson.Update();

    attOptions();
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
