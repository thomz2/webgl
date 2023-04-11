import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'

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

        // bounding box
        this.cube2BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

        // npm install http-server -g
        // cd .\webgl\threejs\src\assets\
        // http-server .\ -i
        
        // this.loadPLYModel();
    

        // parte fisica
        this.carBody = new CANNON.Body({
            mass: 5,
            position: new CANNON.Vec3(-86, 0.1, -33),
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

    // TODO: deixar que nem a funcao abaixo
    async loadOBJModel(){

        const loader = new OBJLoader();

        var carro = this;
        loader.load(
            'https://raw.githubusercontent.com/thomz2/webgl/main/src/assets/eclipse-white.obj',
            function ( object ) {
                carro.carroMesh = object;
                carro.addToScene(carro.scene);
                console.log(carro.carroMesh);
            }
        );

        return true;
    }

    async loadPLYModel(){

        const loader = new PLYLoader();

        loader.load(
            'https://raw.githubusercontent.com/thomz2/webgl/main/src/assets/car.ply',
            (geometry) => {

                geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.count * 3), 3));

                const color = new THREE.Color();
                const count = geometry.attributes.position.count;
                const positions = geometry.attributes.position.array;

                //Guarda as cores em um array, cria três valores rgb para cada vértice
                const colors = [];

                for (let i = 0; i < count; i++) {

                    //Vértices 0-5000 => acessórios e pneus
                    if(i < 5000){
                        colors[3*i] = 0;  //Red
                        colors[3*i+1] = 0;//Green
                        colors[3*i+2] = 0;//Blue
                    }

                    else if( i < 6000){
                        colors[3*i] = 130/255;
                        colors[3*i+1] = 135/255;
                        colors[3*i+2] = 136/255;
                    }

                    else if( i < 6250){
                        colors[3*i] = 1;
                        colors[3*i+1] = 1;
                        colors[3*i+2] = 1;
                    }
                    
                    //Vértices 5001-12400 => interior do carro e parte de metal das rodas
                    else if(i < 12400){
                        colors[3*i] = 130/255;
                        colors[3*i+1] = 135/255;
                        colors[3*i+2] = 136/255;
                    }

                    else if(i < 15900){
                        colors[3*i] = 189/255;
                        colors[3*i+1] = 22/255;
                        colors[3*i+2] = 44/255;
                    }

                    //Vértices 12401-~15991 => chassís e placa do carro
                    else{
                        colors[3*i] = 130/255;
                        colors[3*i+1] = 135/255;
                        colors[3*i+2] = 136/255;
                    }
                    
                }

                  geometry.setAttribute('color', new THREE.BufferAttribute( new Float32Array(colors), 3 ));
                  
                const material= new THREE.MeshPhongMaterial({vertexColors:true})
                  
                this.carroMesh = new THREE.Mesh(
                    geometry,
                    material
                );

                this.carroMesh.castShadow = true;
                this.carroMesh.receiveShadow = true;

                console.log(this.carroMesh)
        
        
                this.scene.add(this.carroMesh);

            },
            (error) => {
                console.log(error);
            }
        );

    }

}
