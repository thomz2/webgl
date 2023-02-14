import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';

export class Carro {

    constructor(scene = false, world = false) {
        
        this.criarMaterial = () => new THREE.ShaderMaterial({
            uniforms:{}, 
            vertexShader: `
                varying vec4 pos;
                varying vec3 v_normal;
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    pos = vec4(position,1.0);
                    v_normal = normal;
                }
            `, 
            fragmentShader: `
                varying vec4 pos;
                varying vec3 v_normal;
                void main() {
                    gl_FragColor = (vec4(v_normal, 1.0)*pos) ;
                }
            `
        });

        // criando a parte visual
        this.scene = scene;
        this.world = world;
        

        this.loadModel();
        // console.log(this.carroMesh.chassis.scale);
        // console.log(this.carroMesh.rodas[0]);

        // parte fisica
        this.carBody = new CANNON.Body({
            mass: 5,
            position: new CANNON.Vec3(0, 6, 0),
            shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 2))
        });
        this.vehicle = new CANNON.RigidVehicle({
            chassisBody: this.carBody
        });
        const positions = [
            new CANNON.Vec3(-2, 0, 2,5),
            new CANNON.Vec3(-2, 0, -2,5),
            new CANNON.Vec3(2, 0, 2,5),
            new CANNON.Vec3(2, 0, -2,5),
        ];
        for (var i = 0; i < 4; ++i) {
            this.vehicle.addWheel({
                body: new CANNON.Body({mass: 1, material: new CANNON.Material('wheel')}),
                position: positions[i],
                axis: new CANNON.Vec3(0, 0, 1),
                direction: new CANNON.Vec3(0, -1, 0)
            });
            this.vehicle.wheelBodies[i].addShape(new CANNON.Sphere(1));
            this.vehicle.wheelBodies[i].angularDamping = 0.4;
            // console.log(this.vehicle.wheelBodies[i]);
        };

        if (world) this.vehicle.addToWorld(world);

        this.maxForce = 40;
        this.maxSteerVal = Math.PI / 8;
    }
    
    attPositions() {
        if(this.carroMesh){
            this.carroMesh.position.copy(this.vehicle.chassisBody.position);
            this.carroMesh.quaternion.copy(this.vehicle.chassisBody.quaternion);
            this.carroMesh.rotateY(Math.PI)
        }
    }

    addToWorld(world) {
        this.vehicle.addToWorld(world);
    }

    addToScene(scene) {
        this.scene = scene;
        scene.add(this.carroMesh);
    }

    //Modificar posteriormente para alterar o tamanho do modelo
    setTamanho(tam) {
        // tamanho de 0.1 a 1
    
        // this.carroMesh.chassis.scale.setScalar(tam);
        
        // this.vehicle.chassisBody.removeShape(this.vehicle.chassisBody.shapes[0]);
        // this.vehicle.chassisBody.addShape(new CANNON.Box((new CANNON.Vec3(4, 0.5, 2)).scale(tam)));
        
        // for (var i = 0; i < 4; ++i) {
        //     this.carroMesh.rodas[i].scale.setScalar(tam);
            
        //     this.vehicle.wheelBodies[i].removeShape(this.vehicle.wheelBodies[i].shapes[0]);
        //     this.vehicle.wheelBodies[i].addShape(new CANNON.Sphere(tam));
        // }

    }

    async loadModel(){

        const loader = new OBJLoader();

        var carro = this;
        loader.load(
            'https://raw.githubusercontent.com/thomz2/webgl/main/src/assets/car.obj',
            function ( object ) {
                carro.carroMesh = object;
                carro.addToScene(carro.scene)
                console.log("done")
            }
        );

        return true;
    }

}
