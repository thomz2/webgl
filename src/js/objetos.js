import * as THREE from '../../node_modules/three';

export class Track extends THREE.BufferGeometry{

    constructor(track){

        super();
        
        this.name = "Track";

        var nv = 74;
        this.vertices = new Float32Array(nv * 2 * 3);

        var vertexOffset = 0;
        for (var i=0; i<nv; ++i) {
            var v = track.leftCurb.slice(i*3, i*3 + 3);
            this.vertices[vertexOffset + 0] = v[0];
            this.vertices[vertexOffset + 1] = v[1];
            this.vertices[vertexOffset + 2] = v[2];
            vertexOffset += 3;
        }

        for (var i=0; i<nv; ++i) {
            var v = track.rightCurb.slice(i*3, i*3 + 3);
            this.vertices[vertexOffset + 0] = v[0];
            this.vertices[vertexOffset + 1] = v[1];
            this.vertices[vertexOffset + 2] = v[2];
            vertexOffset += 3;
        }

        this.triangleIndices = new Uint16Array(nv * 3 * 2);

        var triangleoffset = 0;
        for (var i=0; i< nv ; ++i) {
            this.triangleIndices[triangleoffset + 2] = i ; 
            this.triangleIndices[triangleoffset + 1] = (i + 1)%nv;
            this.triangleIndices[triangleoffset + 0] = nv + (i+1) %nv;
            triangleoffset += 3;

            this.triangleIndices[triangleoffset + 2] = i ;
            this.triangleIndices[triangleoffset + 1] = nv + (i+1) %nv;
            this.triangleIndices[triangleoffset + 0] =nv + i;
            triangleoffset += 3;
        }

        this.numVertices  = nv*2;
        this.numTriangles = this.triangleIndices.length / 3;

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
}

export class Tree extends THREE.Group{

    constructor(radius=0.85, height=5, ratio=3){

        super();
        
        const tronco = new THREE.Mesh(
                            new THREE.CylinderGeometry(radius,radius,height,32), 
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

    }
}

export class Building extends THREE.BufferGeometry{

    constructor(b){

        super();

        this.name = "Building";

        var nv = 4;
        this.vertices = new Float32Array(nv * 2 * 3);

        var vertexOffset = 0;
        for (var i=0; i<nv; ++i) {
            var v = b.outline.slice(i*4, i*4+3);
            this.vertices[vertexOffset + 0] = v[0];
            this.vertices[vertexOffset + 1] = v[1];
            this.vertices[vertexOffset + 2] = v[2];
            vertexOffset += 3;
        }

        for (var i=0; i<nv; ++i) {
            var v = b.outline.slice(i*4, i*4+3);
            this.vertices[vertexOffset + 0] = v[0];
            this.vertices[vertexOffset + 1] = b.outline[i*4+3];
            this.vertices[vertexOffset + 2] = v[2];
            vertexOffset += 3;
        }

        this.triangleIndices = new Uint16Array(3 * (2 * nv + nv - 2));

        var triangleOffset = 0;
        for (var i=0; i<nv; ++i) {
            this.triangleIndices[triangleOffset + 0] = i;
            this.triangleIndices[triangleOffset + 1] = (i + 1) % nv;
            this.triangleIndices[triangleOffset + 2] = nv+ (i+1)%nv;
            triangleOffset += 3;

            this.triangleIndices[triangleOffset + 0]  = i ;
            this.triangleIndices[triangleOffset + 1]  =nv+ (i+1)%nv;
            this.triangleIndices[triangleOffset + 2]  =nv+ i ;
            triangleOffset += 3;
        }
        
        /* triangles for the roof */
        for (var i=0; i<(nv-2); ++i) {
            this.triangleIndices[triangleOffset + 0] = nv;
            this.triangleIndices[triangleOffset + 1] = nv + (i + 1) ;
            this.triangleIndices[triangleOffset + 2] = nv + (i + 2) % nv;
            triangleOffset += 3;
        }

        this.numVertices  = nv*2;
        this.numTriangles = this.triangleIndices.length / 3;

        const points = [];

        for(const index of this.triangleIndices){

            const eixoX = this.vertices[index*3];
            const eixoY = this.vertices[index*3+ 1];
            const eixoZ = this.vertices[index*3 + 2];

            points.push(new THREE.Vector3(eixoX, eixoY, eixoZ));
        }

        this.setFromPoints(points);
    }
};
