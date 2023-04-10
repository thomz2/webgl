import * as THREE from 'three';
import sunimg from '../../assets/sun.jpg';

export class Sun {

    constructor (scene, x=0, y=0, z=0) {
        // spotlight
        this.spotLight = new THREE.SpotLight(0xFFFFFF, 0.85);
        this.spotLight.angle = 0.7;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 1024 * 4;
        this.spotLight.shadow.mapSize.height = 1024 * 4;
        
        // scene
        this.scene = scene;
        
        // sun
        this.sun = new THREE.Mesh(
            new THREE.SphereGeometry(10),
        
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(sunimg)
            })
        );
        
        // adicionando na cena
        this.scene.add(this.spotLight);
        this.scene.add(this.sun);

        // posição
        this.setPosition(x,y,z)

        // helper
        this.sLightHelper = new THREE.SpotLightHelper(this.spotLight)

    };
    
    addSpotlightHelper () {
        this.scene.add(this.sLightHelper);
    }

    remSpotlightHelper () {
        this.scene.remove(this.sLightHelper)
    }

    setPosition (x, y, z) {
        this.spotLight.position.set(x, y, z);
        this.sun.position.x = x;
        this.sun.position.y = y;
        this.sun.position.z = z;
    }
};
