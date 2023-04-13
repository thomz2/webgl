import * as THREE from 'three';

export class Tree extends THREE.Group{

    constructor(radius=0.85, height=5, ratio=3){

        super();
        
        const tronco = new THREE.Mesh(
                            new THREE.CylinderGeometry(radius,radius,height,50), 
                            new THREE.MeshPhongMaterial({color: 0x725c42})
                        );

        tronco.position.set(0,height/2,0);
        tronco.receiveShadow = true;
        tronco.castShadow = true;

        const folhas = new THREE.Mesh(
            new THREE.ConeGeometry(radius*ratio*2,height*ratio,3200), 
            new THREE.MeshPhongMaterial({color: 0x3A5F0B})
        ); 
        
        folhas.position.set(0,height*(ratio/2+1),0);
        folhas.receiveShadow = true;
        folhas.castShadow = true;

        this.add(tronco);
        this.add(folhas);

    };
};
