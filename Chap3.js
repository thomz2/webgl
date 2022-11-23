//PROTÓTIPOS PARA INSTÂNCIAÇÃO DE OBJETOS, SEGUNDO O MOLDE DO CAP 2.5
//EX:
//Objeto(){
//   this.name;
//   this.vertices; 
//   this.triangleIndices;
//   this.numVertices ;
//   this.numTriangles;
//}


function Cube(){

    this.name = "cube";

    //Posições dos vértices, cada linha um vértice
    this.vertices = new Float32Array([
        -1.0,-1.0, 1.0,
        1.0, -1.0, 1.0,
        -1.0,1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0,-1.0, -1.0,
        1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0
    ]);

    //Indices dos triângulos, três valores consecutivos formam um
    //Cada linha uma face, composta de dois triângulos
    this.triangleIndices = new Uint16Array([
        0, 1, 2, 2, 1, 3, // front
        5, 4, 7, 7, 4, 6, // back
        4, 0, 6, 6, 0, 2, // left
        1, 5, 3, 3, 5, 7, // right
        2, 3, 6, 6, 3, 7, // top
        4, 5, 0, 0, 5, 1 // bottom
    ]);

    this.numVertices = this.vertices.length/3;
    this.numTriangles = this.triangleIndices . length /3;
}

// ///
// /// Resolution is the number of faces used to tesselate the cone .
// /// Cone is defined to be centered at the origin of the coordinate reference system , and lying on the XZ plane .
// /// Cone height is assumed to be 2.0. Cone radius is assumed to be 1.0 .

function Cone(resolution){

    // vertices definition
    // //////////////////////////////////////////////////////////
    this.vertices = new Float32Array (3*( resolution +2));

    // apex of the cone
    this.vertices [0] = 0.0;
    this.vertices [1] = 2.0;
    this.vertices [2] = 0.0;

    // base of the cone
    var radius = 1.0;
    var angle ;
    var step = 6.283185307179586476925286766559 / resolution ;
    var vertexoffset = 3;
    for (var i = 0; i < resolution ; i ++) {
        angle = step * i;
        this.vertices [ vertexoffset ] = radius * Math . cos ( angle );
        this.vertices [ vertexoffset +1] = 0.0;
        this.vertices [ vertexoffset +2] = radius * Math . sin ( angle );
        vertexoffset += 3;
    }

    //base do cone -> vértice de índice resolution + 1
    this.vertices[ vertexoffset ] = 0.0;
    this.vertices[ vertexoffset +1] = 0.0;
    this.vertices[ vertexoffset +2] = 0.0;

    // triangles defition
    // //////////////////////////////////////////////////////////
    this.triangleIndices = new Uint16Array (3*2* resolution ) ;


    // lateral surface -> usa o vértice do apex
    // (i+1)%resolution == 0 quando i = resolution - 1, ou seja, liga o último ao 1
    var triangleoffset = 0;
    for (var i = 0; i < resolution ; i ++) {
        this.triangleIndices [ triangleoffset ] = 0;
        this.triangleIndices [ triangleoffset +1] = 1 + (i % resolution);
        this.triangleIndices [ triangleoffset +2] = 1 + ((i +1) % resolution );
        triangleoffset += 3;
    }


    // bottom part of the cone -> usa o vértice da base
    // (i+1)%resolution == 0 quando i = resolution - 1, ou seja, liga o último ao 1
    for (var i = 0; i < resolution ; i ++) {
        this.triangleIndices [ triangleoffset ] = resolution +1;
        this.triangleIndices [ triangleoffset +1] = 1 + (i % resolution);
        this.triangleIndices [ triangleoffset +2] = 1 + ((i +1) % resolution );
        triangleoffset += 3;
    }

    this.numVertices = this.vertices . length /3;
    this.numTriangles = this.triangleIndices . length /3;

}

function Cylinder(resolution){

    this.name = "cylinder";

    this.vertices = new Float32Array(3*(2*resolution + 2));

    var step = 6.28318530718/resolution;
    var radius = 1.0;
    let vertexoffset = 0;

    //Definições dos vértices:

    //Base inferior -> Vértices da borda
    for(let i = 0; i<resolution;i++){

        let angle = step*i;
        
        this.vertices[vertexoffset] = radius*Math.cos(i);
        this.vertices[vertexoffset+1] = 0;
        this.vertices[vertexoffset+2] = radius*Math.sin(i);

        vertexoffset += 3;
    }

    //Base superior -> Vértices da borda
    for(let i = 0; i<resolution;i++){

        let angle = step*i;
        
        this.vertices[vertexoffset] = radius*Math.cos(i);
        this.vertices[vertexoffset+1] = 0;
        this.vertices[vertexoffset+2] = radius*Math.sin(i);

        vertexoffset += 3;
    }

    //Base inferior -> Vértice central
    this.vertices[vertexoffset] = 0;
    this.vertices[vertexoffset+1] = 0;
    this.vertices[vertexoffset+2] = 0;

    //Base superior -> Vértice central
    this.vertices[vertexoffset] = 0;
    this.vertices[vertexoffset+1] = 2;
    this.vertices[vertexoffset+2] = 0;


    //Definições dos triângulos:

    //3 vértices para cada triângulo,

    //2 triângulos por face lateral 
    //+ 1 triângulos por face inferior 
    //+ 1 triângulos por face superior 
    //= 4 triângulos por resolução

    //Logo, 3*4*resolution posições no array de inteiros
    this.triangleIndices = new Uint16Array (3*4* resolution ) ;

    // lateral surface
    // (i+1) % resolution é o próximo elemento, ou seja, o vértice do lado
    // se i for o último elemento, então (i+1) % resolution = 0, ligando o último ao primeiro
    var triangleoffset = 0;
    for (var i = 0; i < resolution ; i ++){

        //Os vértices de cima, entre 0 e resolution ligados aos de baixo
        this.triangleIndices [ triangleoffset ] = i;
        this.triangleIndices [ triangleoffset +1] = (i+1) % resolution ;
        this.triangleIndices [ triangleoffset +2] = (i % resolution ) + resolution ;

        triangleoffset += 3;

        //Os vértices de baixo, entre resolution e 2*resolution ligados ao de cima
        this.triangleIndices [ triangleoffset ] = (i % resolution ) + resolution ;
        this.triangleIndices [ triangleoffset +1] = (i+1) % resolution ;
        this.triangleIndices [ triangleoffset +2] = ((i +1) % resolution) + resolution ;

        triangleoffset += 3;
    }
 
    // base do cilindro -> fatias ligando as bordas ao centro do círculo
    for (var i = 0; i < resolution ; i ++) {
        this.triangleIndices [ triangleoffset ] = i;                        //borda
        this.triangleIndices [ triangleoffset +1] = (i+1) % resolution ;    //borda
        this.triangleIndices [ triangleoffset +2] = 2* resolution ;         //Centro inferior
        triangleoffset += 3;
    }

    // topo do cilindro -> fatias ligando as bordas ao centro do círculo
    for (var i = 0; i < resolution ; i ++){
        this.triangleIndices [ triangleoffset ] = resolution + i;                           //borda
        this.triangleIndices [ triangleoffset +1] = ((i +1) % resolution) + resolution ;    //borda
        this.triangleIndices [ triangleoffset +2] = 2* resolution +1;                       //Centro superior
        triangleoffset += 3;
    }

    this.numVertices = this.vertices . length /3;
    this.numTriangles = this.triangleIndices . length /3;
}
