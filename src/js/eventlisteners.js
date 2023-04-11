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
                }
            }
        };
    }
};