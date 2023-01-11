import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import nebula from '../img/nebula.jpg';
import stars from '../img/stars.jpg';
import texturaplaneta from '../img/planetaearthlike.jpg';

const renderer = new THREE.WebGL1Renderer();

renderer.setSize(innerWidth, innerHeight);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

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

camera.position.set(1, 2, 5);

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    map: textureLoader.load(nebula)
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);

scene.add(box);
box.position.set(0, 2, 0);
box.receiveShadow = true;
box.castShadow = true;

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30, 50);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 30, 30);
const sphereMaterial = new THREE.MeshStandardMaterial({
    wireframe: false,
    map: textureLoader.load(texturaplaneta)
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.x = -10;
sphere.castShadow = true;
sphere.receiveShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const spotLight2 = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight2);
spotLight2.position.set(100, -10, 0);
spotLight2.castShadow = true;
spotLight2.angle = 0.2;

const sLH2 = new THREE.SpotLightHelper(spotLight2);
// scene.add(sLH2);

const sLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
scene.fog = new THREE.FogExp2(0x333333, 0.01);

scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([
//     nebula,
//     nebula,
//     stars,
//     stars,
//     stars,
//     stars
// ]);

const plane2Geometry = new THREE.PlaneGeometry(20, 20, 10, 10);
const plane2Material = new THREE.ShaderMaterial({
    wireframe: true,
    vertexShader: `
        uniform float u_time;

        void main() {
            float newX = sin(position.x * u_time) * sin(position.y * u_time);
            vec3 newPosition = vec3(newX, position.y, position.z);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `,
    fragmentShader: `
        void main () {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `,
    uniforms: {
        u_time: {type: 'f', value: 0.0}
    }
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

const sphere2Geometry = new THREE.SphereGeometry(4);
const sphere2Material = new THREE.ShaderMaterial({
    wireframe: true,
    vertexShader: `
        uniform float u_time;

        void main() {
            float newX = sin(position.x * u_time) * cos(position.y * u_time) * 5.0;
            float newY = sin(position.y * u_time) * sin(position.z * u_time) * 5.0;
            float newZ = cos(position.z * u_time) * cos(position.x * u_time) * 5.0;
            vec3 newPosition = vec3(newX, newY, newZ);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `,
    fragmentShader: `
        void main () {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `,
    uniforms: {
        u_time: {type: 'f', value: 0.0}
    }
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

const gui = new dat.GUI();

const options = {
    sphereColor: '#ffffff',
    wireframe: false,
    speed: 0.001,
    angle: 0.2,
    penumbra: 0,
    intensity: 1
};

gui.addColor(options, 'sphereColor').onChange(function(e) {
    sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function(e) {
    sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0, 0.1);

gui.add(options, 'angle', 0, 1);

gui.add(options, 'penumbra', 0, 1);

gui.add(options, 'intensity', 0, 1);

let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
    
    console.log("clientX = " + e.clientX + " | X = " + mousePosition.x);
    console.log("clientY = " + e.clientY + " | Y = " + mousePosition.y);

});

const rayCaster = new THREE.Raycaster();

const clock = new THREE.Clock();

function animate(time) {
    box.rotation.x = time / 7000;
    box.rotation.y = time / 7000;
    
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight2.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);

    for (let i = 0; i < intersects.length; ++i) {
        if (intersects[i].object.id === box.id) {
            intersects[i].object.material.color.set(0x00FF00);
            break;
        }
        box.material.color.set(0x0000FF);
    }

    plane2.material.uniforms.u_time.value = clock.getElapsedTime();
    sphere2.material.uniforms.u_time.value = clock.getElapsedTime() / 10;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
});