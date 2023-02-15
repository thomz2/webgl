import * as THREE from 'three';

export class Lamp extends THREE.Group{

    constructor(radius=0.85, height=5, angle=60){

        super();
        
        const tronco = new THREE.Mesh(
                            new THREE.CylinderGeometry(radius,radius,height,32), 
                            new THREE.MeshPhongMaterial({color: 0x725c42})
                        );

        tronco.position.set(0,height/2,0);
        tronco.receiveShadow = true;
        tronco.castShadow = true;

        const lampada = new THREE.Mesh(
            new THREE.BoxGeometry(2,2,2), 
            new THREE.MeshBasicMaterial({color: 0xffffff})
        ); 
        
        lampada.position.set(0,1+height,0);

        this.add(tronco);
        this.add(lampada);

        this.height = height;
        this.light = new THREE.SpotLight();
        this.light.angle = Math.PI*angle/180;
        this.light.decay = 100;
        this.light.intensity = 0.3;
        this.light.target = tronco;

    };

    setPosition(x,y,z){
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        this.light.position.x = this.position.x;
        this.light.position.y = this.position.y + this.height;
        this.light.position.z = this.position.z;

        console.log(this.position)
    }

    addToScene(scene){
        scene.add(this);
        scene.add(this.light);
    }
};