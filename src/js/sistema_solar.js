import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Planet } from './classes/Planet';

import starsTexture from '../img/stars.jpg';
import sunTexture from '../img/sun.jpg';
import mercuryTexture from '../img/mercury.jpg';
import venusTexture from '../img/venus.jpg';
import earthTexture from '../img/earth.jpg';
import marsTexture from '../img/mars.jpg';
import jupiterTexture from '../img/jupiter.jpg';
import saturnTexture from '../img/saturn.jpg';
import saturnRingTexture from '../img/saturn ring.png';
import uranusTexture from '../img/uranus.jpg';
import uranusRingTexture from '../img/uranus ring.png';
import neptuneTexture from '../img/neptune.jpg';
import plutoTexture from '../img/pluto.jpg';

const renderer = new THREE.WebGLRenderer();
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

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const auxTextureLoader = new THREE.TextureLoader();

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const sol = new Planet(sunTexture);
sol.setBasicPlanet(16);
sol.addOnScene(scene);

const mercurio = new Planet(mercuryTexture, 3.2, 28);
mercurio.addOnScene(scene);

const venus = new Planet(venusTexture, 5.8, 44);
venus.addOnScene(scene);

const terra = new Planet(earthTexture, 6, 62);
terra.addOnScene(scene);

const marte = new Planet(marsTexture, 4, 78);
marte.addOnScene(scene);

const jupiter = new Planet(jupiterTexture, 12, 100);
jupiter.addOnScene(jupiter);

const saturno = new Planet(saturnTexture, 10, 138, saturnRingTexture);
saturno.setRing(10, 20);
saturno.addOnScene(scene);

const urano = new Planet(uranusTexture, 7, 176, uranusRingTexture);
urano.setRing(7, 12);
urano.addOnScene(scene);

const netuno = new Planet(neptuneTexture, 7, 200);
netuno.addOnScene(scene);

const plutao = new Planet(plutoTexture, 2.8, 216);
plutao.addOnScene(scene);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

// function createPlanet(size, texture, positionX, ring) {
//     const geo = new THREE.SphereGeometry(size, 30, 30);
//     const mat = new THREE.MeshStandardMaterial({
//         map: auxTextureLoader.load(texture)
//     });
//     const mesh = new THREE.Mesh(geo, mat);
//     const obj = new THREE.Object3D();
//     obj.add(mesh);
//     if (ring) {
//         const ringGeo = new THREE.RingGeometry(
//             ring.innerRadius, 
//             ring.outerRadius, 
//             32);
//         const ringMat = new THREE.MeshBasicMaterial({
//             map: this.textureLoader.load(ring.Texture),
//             side: THREE.DoubleSide
//         });
//         const ringMesh = new THREE.Mesh(ringGeo, ringMat);
//         obj.add(ringMesh)
//         ringMesh.position.x = positionX;
//         ringMesh.rotation.x = -0.5 * Math.PI;
//     }
//     scene.add(obj);
//     mesh.position.x = positionX;
//     return {mesh, obj};
// }

function animate(time) {
    // rotacao em volta de si mesmo
    sol.rotateY(0.004);
    mercurio.rotateY(0.004);
    venus.rotateY(0.002);
    terra.rotateY(0.02);
    marte.rotateY(0.018);
    jupiter.rotateY(0.04);
    saturno.rotateY(0.038);
    urano.rotateY(0.03);
    netuno.rotateY(0.032);
    plutao.rotateY(0.008);

    // rotacao em volta do sol
    mercurio.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    terra.obj.rotateY(0.01);
    marte.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturno.obj.rotateY(0.0009);
    urano.obj.rotateY(0.0004);
    netuno.obj.rotateY(0.0001);
    plutao.obj.rotateY(0.00007);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
});