import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
// import {VertexNormalsHelper} from 'three/examples/jsm/helpers/VertexNormalsHelper';
import * as dat from 'dat.gui';
import { Carro } from './classes/Car2';
import { Tree } from './classes/Tree';
import { Building } from './classes/Building';
import { Track } from './classes/Track';
import { ThirdPersonCamera } from './classes/ThirdPersonCamera';
import { Sun } from './classes/Sun';
import { Lamp } from './classes/Lamp';
// import { Tunnel } from './classes/Tunnel';

import Race from './race';

import posx from '../assets/posx.jpg'
import negx from '../assets/negx.jpg'
import posy from '../assets/posy.jpg'
import negy from '../assets/negy.jpg'
import posz from '../assets/posz.jpg'
import negz from '../assets/negz.jpg'

import grass from '../assets/grass.jpg';
import space from '../assets/space.jpeg';
import highway from '../assets/highway.jpg';
import sides from '../assets/sides.jpg';
import front from '../assets/front.jpg';

import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import { handleClick, handleKeyDown, handleKeyUp } from './eventlisteners';
import { calcular_posicao_vertice, distPontos2D } from './fisica';

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

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;

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
    horario: 14,
    debug: false,
    tamanhoCarro: 1
};

gui = new dat.GUI();

function retornarAtivarGrama(){
    var grama = false;
    return () => {
        (grama)? scene.remove(instancedMesh) : scene.add( instancedMesh );
        grama = !grama;
    }
}

gui.add(options, 'boxMass', 0.1, 2);
gui.add(options, 'sphereMass', 0.1, 2);
gui.add(options, 'wheelForce', 5, 100);
gui.add(options, 'wheelSteer', Math.PI / 16, Math.PI / 2);
gui.add(options, 'tamanhoCarro', 0.1, 1.5);
gui.add(options, 'horario',0,24);
gui.add({"Mudar Câmera": () => camera.lockOn = !camera.lockOn}, 'Mudar Câmera')
gui.add({"Modo debug": () => options.debug = !options.debug}, 'Modo debug')
gui.add({"Ativar grama": retornarAtivarGrama()}, "Ativar grama");

//Luzes ambiente e direcional + Sol + background
const luzAmbiente = new THREE.AmbientLight(0xfffff0,0.3);
luzAmbiente.intensity = 0.2;
scene.add(luzAmbiente);

const sun = new Sun(scene, -200, 200, -200);

const cubeTextureLoader = new THREE.CubeTextureLoader();

scene.background = cubeTextureLoader.load([
    posx,
    negx,
    posy,
    negy,
    negz,
    posz
]);

//Malhas do Threejs

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.ShaderMaterial({
	uniforms:{},
    vertexShader:VS,
    fragmentShader:FS
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

//Gramado da cena
const groundGeo = new THREE.PlaneGeometry(300, 300);
const texture = new THREE.TextureLoader().load(grass);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(5,5);
const groundMat = new THREE.MeshStandardMaterial({ 
	map: texture
 });

const groundMesh = new THREE.Mesh(groundGeo, groundMat);
groundMesh.receiveShadow = true;
groundMesh.castShadow = true;
scene.add(groundMesh);

const pista = new THREE.Mesh(
    new Track(Race.track), 
    new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load(highway)
    })
);
pista.position.y = 0.1

scene.add(pista);
pista.receiveShadow = true;
pista.castShadow = true;

//Adciona as arvores
Race.trees.map(arvore => {
    const tree = new Tree(0.55, 4, 4); 
    tree.position.set(...arvore.position); 
    scene.add(tree)
});

//Adciona as construções => gambiarra mais horrorosa já escrita, refazer depois
Race.buildings.map(construcao =>{

    const building = new Building(construcao);

    const objeto = new THREE.Mesh(
        building.geometry,
        [new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(front)}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(front)}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sides)}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sides)}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(front)}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(front)})]
    );

    objeto.castShadow = true;
    objeto.receiveShadow = false;
    objeto.renderOrder = 0;

    console.log(objeto.position);

    objeto.position.x = building.position.x + building.width/2;
    objeto.position.y = 5;
    objeto.position.z = building.position.z+building.length/2;

    objeto.rotation.set(0,Math.PI/3,0)

    scene.add(objeto)

    console.log(new THREE.BoxGeometry(1,2,1))
});

Race.lamps.map(lampada => {
    const lamp = new Lamp(0.3, lampada.height*2);
    lamp.renderOrder = 10;
    lamp.setPosition(...lampada.position);
    lamp.addToScene(scene);

    // debug
    // const lightHelper = new THREE.SpotLightHelper(lamp.light);
    // scene.add(lightHelper);
});

const pontosDaLinhaAbaixo = [new THREE.Vector3(-70.56, 0.6, -5.73), new THREE.Vector3(-77.34, 0.6, -1.47)];

const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pontosDaLinhaAbaixo), 
    new THREE.LineBasicMaterial({ color: 0xff0000 }) 
);
scene.add(line);

const midpoint = new THREE.Vector3();
midpoint.addVectors(pontosDaLinhaAbaixo[0], pontosDaLinhaAbaixo[1]).multiplyScalar(0.5)

console.log("line pos")
console.log(line);

const raycasterLine = new THREE.Raycaster(midpoint, new THREE.Vector3(0, 1, 0));
scene.add(getRayCastLine(raycasterLine));

const carro = new Carro();

let carroflag = false;

// TESTE ESFERA 1
const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.ShaderMaterial({
    uniforms:{},
    vertexShader:VS,
    fragmentShader:FS
});
const sphereMesh = new THREE.Mesh( sphereGeo, sphereMat );

scene.add(sphereMesh);
// FIM DO TESTE

let sphereMesh2 = new THREE.Mesh();
let sphereMesh3 = new THREE.Mesh();

let farol1 = new THREE.SpotLight('aquamarine', 3);
farol1.angle = Math.PI / 7;
farol1.distance = 30;

// const slh = new THREE.SpotLightHelper(farol1);

let farol2 = new THREE.SpotLight();

farol2.copy(farol1);

const indice = 15702;

// parte assincrona do codigo, aqui faco operacoes com a malha do carro
// retirei o loadPLYModel do construtor do Carro e coloquei na funcao assincrona, fica melhor
(async function() {
    await carro.loadPLYModel();
    carroflag = true;

    scene.children.forEach((obj) => {
        try {
            // obj.castShadow = true;
            obj.receiveShadow = true;
        } catch (error) {
            console.log(obj);            
        } 

    });

    const sphereGeo2 = new THREE.SphereGeometry(0.1);
    const sphereMat2 = new THREE.MeshBasicMaterial({ color: 'pink' });
    sphereMesh2.geometry = sphereGeo2;
    sphereMesh2.material = sphereMat2;
    sphereMesh2.rotation.y = Math.PI / 4;

    scene.add(sphereMesh2);

    sphereMesh3.copy(sphereMesh2);

    scene.add(sphereMesh3);

    scene.add(farol1);
    scene.add(farol2);

})();
// jeito para checar se algo foi carregado: usando flag

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

//Corpo fisico das construções
Race.buildings.map( building => {
    const b = new Building(building);

    let body = b.getPhysicsBody(boxPhysMat);

    var axis = new CANNON.Vec3(0,1,0);
    var angle = Math.PI / 3;
    body.quaternion.setFromAxisAngle(axis, angle);

    world.addBody(body);
});

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

const vehicle = carro.vehicle;

// TODO: ver o que tem de errado aqui
carro.addToScene(scene);
carro.addToWorld(world);
// gambiarra para o carro ficar antes da largada
carro.carBody.quaternion.setFromEuler(0, -Math.PI/2 + 0.36, 0);


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

Race.lamps.map((lampada) => {

    lampada.position.y = 8;
    const lamp = new CANNON.Body({
        mass:0,
        shape:new CANNON.Cylinder(0.3,0.3,8,8),
        position: new CANNON.Vec3(...lampada.position).vadd(new CANNON.Vec3(0,4,0)),
        material: boxPhysMat
    });

    world.addBody(lamp);
});

//Instância da camera em terceira pessoa
//Target é o alvo observado
//Position é a posição em relação ao alvo, nesse caso atrás e em cima
//LookAt é onde a camera aponta em relação ao alvo
const thirdPerson = new ThirdPersonCamera({
    camera: camera,
    target: carro.vehicle.chassisBody,
    position: [20, 5, 0],
    lookAt: [-25,0,0]
});

//Listeners

// Add an event listener for the 'click' event
document.addEventListener('click', handleClick.bind(null, camera, scene));

document.addEventListener('keydown', handleKeyDown.bind(null, camera, carro));

document.addEventListener('keyup', handleKeyUp.bind(null, camera, carro));

const timeStep = 1 / 60;


function attOptions() {
    boxBody.mass = options.boxMass;
    sphereBody.mass = options.sphereMass;
    carro.maxForce = options.wheelForce;
    carro.maxSteerVal = options.wheelSteer;
    carro.setTamanho(options.tamanhoCarro);
    sun.setPosition(
        250*Math.cos(Math.PI*(1.5+options.horario/12)), 
        250*Math.sin(Math.PI*(1.5+options.horario/12)), 
        -200
    );
}

/////////////////////////////////////////
//////////// COMEÇO DA GRAMA/////////////
/////////////////////////////////////////

const clock = new THREE.Clock();

const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  
	void main() {

    vUv = uv;
    
    // VERTEX POSITION
    
    vec4 mvPosition = vec4( position, 1.0 );
    #ifdef USE_INSTANCING
    	mvPosition = instanceMatrix * mvPosition;
    #endif
    
    // DISPLACEMENT
    
    // here the displacement is made stronger on the blades tips.
    float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
    
    float displacement = sin( mvPosition.z + time * 10.0 ) * ( 0.1 * dispPower );
    mvPosition.z += displacement;
    
    //
    
    vec4 modelViewPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * modelViewPosition;

	}
`;

const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
  	vec3 baseColor = vec3( 0.3607, 0.662, 0.0156 );
    float clarity = ( vUv.y * 0.5 ) + 0.6;
    gl_FragColor = vec4( baseColor * clarity, 1 );
  }
`;

const uniforms = {
	time: {
  	value: 0
  }
}

const leavesMaterial = new THREE.ShaderMaterial({
	vertexShader,
  fragmentShader,
  uniforms,
  side: THREE.DoubleSide
});

const instanceNumber = 500000;
const dummy = new THREE.Object3D();

const geometry = new THREE.PlaneGeometry( 0.1, 1, 1, 4 );
geometry.translate( 0, 0.5, 0 ); // move grass blade geometry lowest point at 0.

const instancedMesh = new THREE.InstancedMesh( geometry, leavesMaterial, instanceNumber );

// Position and scale the grass blade instances randomly.

for ( let i=0 ; i<instanceNumber ; i++ ) {

    const track = Race.track.leftCurb;

    const index = Math.round(Math.random()*74);

    const x =  ( Math.random() - 0.5 ) * 100;

    const z = ( Math.random() - 0.5 ) * 100;

    if(Math.abs(x)-30 > Math.abs(track[index*3])){
        i--;
        continue;
    }

    if(Math.abs(z)-30 > Math.abs(track[index*3+2])){
        i--;
        continue;
    }

	dummy.position.set(
        x + track[index*3],
        0,
        z + track[index*3+2]
    );
  
  dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );
  
  dummy.rotation.y = Math.random() * Math.PI;
  
  dummy.updateMatrix();
  instancedMesh.setMatrixAt( i, dummy.matrix );

  dummy.position.y =0.7;

}

/////////////////////////////////////////
//////////// FIM DA GRAMA////////////////
/////////////////////////////////////////

// linha para testar raycast
function getRayCastLine (raycaster) {
    const lineGeometry = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints( [
            raycaster.ray.origin,
            raycaster.ray.at(1000, new THREE.Vector3(0, 0, 0))
        ] ),
        new THREE.LineBasicMaterial({ color: 0xff0000 })    
    );
    
    return lineGeometry;
}

function checkColisions() {
    if (carroflag) {
        const intersectsLine = raycasterLine.intersectObjects(scene.children);
        if (intersectsLine.length >= 3) {
            console.log("INTERSECTOU A LINHA!");   
        }
    }
}

function animate() {
    world.step(timeStep);
    
    if(options.debug) cannonDebugger.update()

    leavesMaterial.uniforms.time.value = clock.getElapsedTime();
    leavesMaterial.uniformsNeedUpdate = true;

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

    // realizar aqui animações quando a malha do carro for instanciada
    if (carro.carroMesh && sphereMesh2){

        const positions = carro.carroMesh.geometry.attributes.position.array;
        const position  = carro.carroMesh.position;

        // console.log("carro e farol carregados");
        // console.log(carro.carroMesh.geometry.getAttribute('position'));
        // console.log(carro.carroMesh.geometry.index);
        // console.log(carro.carroMesh.position);
        // sphereMesh2.quaternion.copy(carro.vehicle.chassisBody.quaternion);
        // console.log(sphereMesh2);
        
        
        var rotacaoQuaternio = carro.vehicle.chassisBody.quaternion;
        var rotacaoEuler = new CANNON.Vec3();
        rotacaoQuaternio.toEuler(rotacaoEuler);

        // var anguloRotacaoX = rotacaoEuler.x;
        var anguloRotacaoY = rotacaoEuler.y;
        console.log(anguloRotacaoY);
        // var anguloRotacaoZ = rotacaoEuler.z;
        
        const x1 = positions[indice];
        const y1 = positions[indice+1];
        const z1 = positions[indice+2];
        const posicao1 = new THREE.Vector3(x1, y1, z1);

        const raio = distPontos2D(
            posicao1.x, posicao1.z,
            3, 3
        );

        const par = calcular_posicao_vertice(
            carro.vehicle.chassisBody.position.x, carro.vehicle.chassisBody.position.z,
            -raio,
            6.2831853072 - anguloRotacaoY + 0.13
        );

        const par2 = calcular_posicao_vertice(
            carro.vehicle.chassisBody.position.x, carro.vehicle.chassisBody.position.z,
            -raio,
            6.2831853072 - anguloRotacaoY - 0.13
        );

        // colocando + 0.3 ajeita farol direito
        const parfarol = calcular_posicao_vertice(
            carro.vehicle.chassisBody.position.x, carro.vehicle.chassisBody.position.z,
            -raio + 1,
            6.2831853072 - anguloRotacaoY + 0.13
        );

        // colocando - 0.3 ajeita farol direito
        const par2farol = calcular_posicao_vertice(
            carro.vehicle.chassisBody.position.x, carro.vehicle.chassisBody.position.z,
            -raio + 1,
            6.2831853072 - anguloRotacaoY - 0.13
        );

        sphereMesh2.position.x = par.x;
        sphereMesh2.position.y = position.y;
        sphereMesh2.position.z = par.y;

        sphereMesh3.position.x = par2.x;
        sphereMesh3.position.y = position.y;
        sphereMesh3.position.z = par2.y;

        farol1.target = sphereMesh2;
        farol1.position.set(parfarol.x, position.y + 0.4, parfarol.y);

        farol2.target = sphereMesh3;
        farol2.position.set(par2farol.x, position.y + 0.4, par2farol.y);
        
    }


    checkColisions();
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
