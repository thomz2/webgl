// eventListeners.js

import * as THREE from 'three';

export function handleClick(camera, scene, event) {
    var mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientX / window.innerHeight) * 2 + 1
    );

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        // The first intersected object is the closest one
        const point = intersects[0].point;

        // Print the X, Y, and Z coordinates to the console
        console.log(`COORDENADAS: X: ${point.x}, Y: ${point.y}, Z: ${point.z}`);

        for (let i = 0; i < intersects.length; i++) {
            const obj = intersects[i].object;
            if (obj.type === 'Mesh' && obj.geometry.type === 'BufferGeometry') {
                // Lógica para identificar o clique em um objeto .OBJ aqui
                console.log('Clique detectado em um objeto .OBJ:', obj);
                if (obj.name === 'carro2js') {
                    console.log('Carro encontrado!');

                    var indiceVertice = intersects[i].face.a;
                    var vertice = obj.geometry.attributes.position.array[indiceVertice];

                    console.log('Info vertice carro:', vertice);
                    console.log('Indice do vertice', indiceVertice);
                };
            };
        };
    };
};

export function handleKeyDown(camera, carro, event) {

    const vehicle = carro.vehicle;
    const maxForce = carro.maxForce;
    const maxSteerVal = carro.maxSteerVal;

    switch (event.key) {

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
    };
};

export function handleKeyUp(camera, carro, event) {

    const vehicle = carro.vehicle;

    switch (event.key) {
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
    };
};
