import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Building extends THREE.BufferGeometry{

    constructor(building){

        super();

        this.name = "Building";
        var nv = 4;
        this.vertices = new Float32Array(nv * 2 * 3);

        this.triangleIndices = new Uint16Array(3 * (2 * nv + nv - 2));
        this.numVertices  = nv*2;
        this.numTriangles = this.triangleIndices.length / 3;

        this.outline = building.outline;

        this.extractVertices(nv);

        this.setTriangleIndices(nv);

        this.createBufferGeometry();
        
        this.getLados(nv);

        this.getPosition();

        this.setTexture();

        // this.getRotation();

        this.geometry = new THREE.BoxGeometry(this.width,30,this.length)
    }

    //Extrai os vértices da outline
    extractVertices(nv){

        var vertexOffset = 0;
        for (var i=0; i<nv; ++i) {
            var v = this.outline.slice(i*4, i*4+3);
            this.vertices[vertexOffset + 0] = v[0];
            this.vertices[vertexOffset + 1] = v[1];
            this.vertices[vertexOffset + 2] = v[2];
            vertexOffset += 3;
        }

        for (var i=0; i<nv; ++i) {
            var v = this.outline.slice(i*4, i*4+3);
            this.vertices[vertexOffset + 0] = v[0];
            this.vertices[vertexOffset + 1] = this.outline[i*4+3];
            this.vertices[vertexOffset + 2] = v[2];
            vertexOffset += 3;
        }

    }

    //Cria as tríplas que definem os triângulos a serem desenhados
    setTriangleIndices(nv){

        var triangleOffset = 0;
        for (var i=0; i<nv; ++i) {
            this.triangleIndices[triangleOffset + 2] = i;
            this.triangleIndices[triangleOffset + 1] = (i + 1) % nv;
            this.triangleIndices[triangleOffset] = nv+ (i+1)%nv;
            triangleOffset += 3;

            this.triangleIndices[triangleOffset + 2]  = i ;
            this.triangleIndices[triangleOffset + 1]  =nv+ (i+1)%nv;
            this.triangleIndices[triangleOffset]  =nv+ i ;
            triangleOffset += 3;
        }
        
        /* triangles for the roof */
        for (var i=0; i<(nv-2); ++i) {
            this.triangleIndices[triangleOffset + 2] = nv;
            this.triangleIndices[triangleOffset + 1] = nv + (i + 1) ;
            this.triangleIndices[triangleOffset] = nv + (i + 2) % nv;
            triangleOffset += 3;
        }
    }

    //Cria a buffer geometry a partir dos vértices de cada triângulo a ser desenhado
    createBufferGeometry(){
        const points = [];

        for(const index of this.triangleIndices){

            const eixoX = this.vertices[index*3];
            const eixoY = this.vertices[index*3+ 1];
            const eixoZ = this.vertices[index*3 + 2];

            points.push(new THREE.Vector3(eixoX, eixoY, eixoZ));
        }

        this.setFromPoints(points);
        this.computeVertexNormals();
    }

    getLados(nv){
        
        var vertices = [];
        var lados = [];

        for(var i=0; i<nv;i++){
            for(var j=i+1; j<nv;j++){
                lados.push({
                    x:this.vertices[i*3 + 0] - this.vertices[j*3+0],
                    y:this.vertices[i*3 + 1] - this.vertices[j*3+1],
                    z:this.vertices[i*3 + 2] - this.vertices[j*3+2],
                    i:i,
                    j:j
                });
            }
        }
        
        let magnitude = lado => lado.x*lado.x + lado.y*lado.y + lado.z*lado.z;

        //Ordena por tamanho do vetor
        lados.sort((a,b) => magnitude(a) - magnitude(b));

        //Elimina as diagonais, que são os maiores lados do retângulo
        lados = lados.slice(0,4);

        //Retira os lados redundantes
        lados = lados.filter(lado => lado.i == 0)

        this.lados = lados;

        lados = lados.map((lado) => Math.sqrt(magnitude(lado)))

        this.width = lados[0];
        this.length = lados[1];
    }

    getVertex(index){
        return (new THREE.Vector3(
            this.vertices[index*3 + 0],
            this.vertices[index*3 + 1],
            this.vertices[index*3 + 2]
        ));
    }

    getPosition(){

        let pivo = this.getVertex(this.lados[0].i).add(this.getVertex(this.lados[0].j)).multiplyScalar(1/2);

        this.position = pivo;
    }

    // getRotation(){

    //     const pivo = this.getVertex(this.lados[0].i);

    //     const direita = this.getVertex(this.lados[1].j);

    //     let direcao = direita.sub(pivo);

    //     const cosseno = direcao.angleTo(new THREE.Vector3(1,0,0));

    //     this.cosseno = cosseno;
    // }

    getPhysicsBody(material){
        return new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(this.width/2, 10, this.length/2)),
            position: new CANNON.Vec3(this.position.x + this.width/2, 10, this.position.z+this.length/2),
            material: material
        });
    }

    setTexture(){

        this.setAttribute( 'uv', new THREE.BoxGeometry(1,1,1).attributes.uv );
    }
};
