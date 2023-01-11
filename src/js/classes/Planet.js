import * as THREE from 'three';

export class Planet extends THREE.Mesh {

    constructor(planetTexture, raio = 0, posX = 0, ringTexture = undefined) {
        super();   
        this.PlanetTexture = planetTexture;
        this.position.x = posX;
        this.ringTexture = ringTexture;
        this.textureLoader = new THREE.TextureLoader();   
        this.obj = new THREE.Object3D();
        this.setStandardPlanet(raio);
    }

    setRing(raioInterno, raioExterno, thetasegs = 32) {
        const ringGeo = new THREE.RingGeometry(raioInterno, raioExterno, thetasegs);
        const ringMat = new THREE.MeshBasicMaterial({
            map: this.textureLoader.load(this.ringTexture),
            side: THREE.DoubleSide
        });
        this.ring = new THREE.Mesh(ringGeo, ringMat);
        this.ring.position.x = this.position.x;
        this.ring.rotation.x = - Math.PI * 0.5;
        this.obj.add(this.ring);
    }

    setBasicPlanet(raio, wS = 30, hS = 30, material = {map: this.textureLoader.load(this.PlanetTexture)}) {
        this.geometry = new THREE.SphereGeometry(raio, wS = 30, hS = 30);
        this.material = new THREE.MeshBasicMaterial(material);
        this.obj.add(this);
    }

    setStandardPlanet(raio, wS = 30, hS = 30, material = {map: this.textureLoader.load(this.PlanetTexture)}) {
        this.geometry = new THREE.SphereGeometry(raio, wS, hS);
        this.material = new THREE.MeshStandardMaterial(material);
        this.obj.add(this);
    }

    addOnScene(scene) {
        scene.add(this.obj);
    }
    
};