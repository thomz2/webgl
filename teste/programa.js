SpiderGL.openNamespace();
let gl = null;
let positionAttribIndex = 0;

function initSGL() {
    console.log("SpiderGL Version: " + SGL_VERSION_STRING);
    let canvas = document.getElementById("OUTPUT-CANVAS");
    setup(canvas);
    gl = canvas.getContext("webgl");
}

function setup(canvas){

    let ativado = true;

    //Adiciona a capacidade de afastar, aproximar, mover para esquerda/direita/cima/baixo
    canvas.addEventListener("keydown", (event) => {
        if (event.keyCode == 37)
        programa.translation[0] -= 0.001
        if(event.keyCode == 38)
        programa.translation[1] += 0.001
        if(event.keyCode == 39)
        programa.translation[0] += 0.001
        if(event.keyCode == 40)
        programa.translation[1] -= 0.001
        if(event.keyCode == 90)
        programa.translation[2] += 0.001
        if(event.keyCode == 88)
        programa.translation[2] -= 0.001    
    });

    //Mudança de figura com delay
    canvas.addEventListener("keydown", (event) => {
          if (!ativado) return false;
          ativado = false;
          setTimeout(function() { ativado = true; }, 150);
          if(event.keyCode == 13)
          programa.nextFigura();
        });
}


let programa = {

    figura: null,

    translation: [0.0,0.0,0.0],

    rotation: SglMat4.rotationAngleAxis(sglDegToRad(0.0), [0.0, 0.0, 1.0]),

    onInitialize : function(){

        initSGL();

        var vsSource = "\
            precision highp float;                                  \n\
                                                                    \n\
            attribute vec3 aPosition;                               \n\
            attribute vec3 aColor;                                  \n\
                                                                    \n\
            uniform   mat4  uModelViewProjectionMatrix;             \n\
            uniform   float uColorCorrection;                       \n\
                                                                    \n\
            varying   vec3 vColor;                                  \n\
                                                                    \n\
            void main(void) {                                       \n\
                vColor = aColor * uColorCorrection;                 \n\
                                                                    \n\
                gl_Position = uModelViewProjectionMatrix * vec4(aPosition, 1.0); \n\
            }                                                       \n\ ";

        var fsSource = "\
            precision highp float;                                 \n\
                                                                    \n\
            varying   vec3 vColor;                                 \n\
                                                                    \n\                         \n\
            void main(void) {                                      \n\
                                                                    \n\
                gl_FragColor = vec4(vColor, 1.0);                  \n\
            }                                                      \n\ ";

        var vsShader = new SglVertexShader(gl, {source: vsSource});
        var fsShader = new SglFragmentShader(gl, {source: fsSource});


        this.shaderProgram = new SglProgram(gl, {
            autoLink: true,
            shaders: [vsShader,fsShader],
            attributes: {
                aPosition: 0,
                aColor: 1
            },
            uniforms: {
                uModelViewProjectionMatrix:  SglMat4.identity(),
                uColorCorrection: 1.5
            }
        });

        //Renderiza um cubo caso não haja figura disponível
        //Mudar aqui a figura inicial

        if(this.figura == null) this.createFiguras();

        this.figura.setupGraphics(gl);

        this.figura.createBuffers();

    },

    onDraw: function(){

        var w = 800;
        var h = 420;

        gl.clearColor(0.2, 0.2, 0.6, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.viewport(0, 0, w, h);
        gl.enable(gl.DEPTH_TEST);

        this.shaderProgram.bind();

        var pMatrix = SglMat4.perspective(sglDegToRad(45.0),w/h,0.1,10.0);
        var mvMatrix = SglMat4.translation([-1.5, 0.0, -5.0]);
        var mTranslate = SglMat4.translation(this.translation);
            mvMatrix = SglMat4.mul(mvMatrix, mTranslate);
        var mvpMatrix = SglMat4.mul(SglMat4.mul(pMatrix, mvMatrix), this.rotation);


        this.shaderProgram.setUniforms({
            uModelViewProjectionMatrix: mvpMatrix
        });

        this.figura.setupBuffers();

        this.figura.desenhar();

        this.shaderProgram.unbind();
    },

    nextFigura: function(){
        let indice = this.indice+1;

        if(indice >= this.figuras.length) indice = 0;

        this.figura = this.figuras[indice];

        this.indice = indice;
    },

    createFiguras: function(){
        this.figuras = [ new Cone(10), new Cubo(), new Triangulo(), new Cone(100), new Cone(1000), new Cilindro(10)];
        this.indice = 0;
        this.figura = this.figuras[0];
    }
}



class Figura{

    setupGraphics(gl){
        
        this.gl = gl;

        return this;
    }

    createBuffers(){

        this.VertexPositionBuffer = new SglVertexBuffer(this.gl, {
            data: new Float32Array(this.vertices),
            usage: this.gl.STATIC_DRAW
        });

        this.VertexColorsBuffer = new  SglVertexBuffer(this.gl, {
            data: new Float32Array(this.colors),
            usage: this.gl.STATIC_DRAW
        });
    }

    setupBuffers(){

        this.VertexPositionBuffer.vertexAttribPointer({
            index: 0, // o indice do atributo selecionado no construtor (no caso 0 para o atributo da posicao)
            size: 3, // acredito que cada vertica do triangulo seja definido por 3 valores (x, y, z)
            glType: this.gl.FLOAT, // o tipo base do atributo (nesse caso float)
            normalized: false, // a boolean value, true if the attribute has an integer type and must be normalized (false by default, even if it would not be necessary to normalize in our example);
            stride: 0, // os bytes do começo de um elemento e o começo do proximo (nesse caso o valor especial 0 indica que os valores são adjacentes)
            offset: 0, // o offset (em bytes) do começo do buffer (0 nesse caso pois o primeiro elemento útil eh o primeiro do buffer)
            enable: true // ativar o array de atributos do vertice no primeiro indice especificado
        });

        this.VertexColorsBuffer.vertexAttribPointer({
            index: 1, // ind 1 = atributo da cor
            size: 3,
            glType: this.gl.FLOAT,
            normalized: false,
            stride: 0,
            offset: 0,
            enable: true
        });

    }
}


class Triangulo extends Figura{

    constructor(){

        super();

        this.vertices = [
            0.0, 1.0, 0.0,
           -1.0,-1.0, 0.0,
            1.0,-1.0, 0.0
        ];

        this.colors = [
            1.0, 0.0, 0.0, // R
            0.0, 1.0, 0.0, // G
            0.0, 0.0, 1.0  // B
        ];
    }

    desenhar(){
        this.gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

class Cubo extends Figura{

    constructor(){

        super();

        this.vertices = [
            // Front face
            -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
          
            // Back face
            -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
          
            // Top face
            -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
          
            // Bottom face
            -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
          
            // Right face
            1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
          
            // Left face
            -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
          ];

          //Consertar?
          this.colors = [
            1.0, 0.0, 0.0, // R
            0.0, 0.0, 1.0, // B
            0.0, 1.0, 0.0, // G
            1.0, 1.0, 1.0, // W
            0.0, 0.0, 1.0, // B
            1.0, 0.0, 0.0, // R
            0.0, 0.0, 1.0, // B
            1.0, 0.0, 0.0, // R
            1.0, 0.0, 0.0, // R
            1.0, 1.0, 1.0, // W
            0.0, 1.0, 0.0, // G
            0.0, 0.0, 1.0, // B
            1.0, 0.0, 0.0, // R
            1.0, 1.0, 1.0, // W
            0.0, 1.0, 0.0, // G
            0.0, 0.0, 1.0, // B
            1.0, 0.0, 0.0, // R
            0.0, 0.0, 1.0, // B
            0.0, 1.0, 0.0, // G
            0.0, 0.0, 1.0, // B
            0.0, 0.0, 1.0, // B
            1.0, 0.0, 0.0, // R
            1.0, 1.0, 1.0, // W
            1.0, 0.0, 0.0, // R

          ];
    }

    setupBuffers(){

        super.setupBuffers();

        this.initIndexBuffer(this.gl);
      }

    desenhar(){
    
        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;

        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }


    initIndexBuffer(gl) {

        const indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      
        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.
      
        const indices = [
          0,
          1,
          2,
          0,
          2,
          3, // front
          4,
          5,
          6,
          4,
          6,
          7, // back
          8,
          9,
          10,
          8,
          10,
          11, // top
          12,
          13,
          14,
          12,
          14,
          15, // bottom
          16,
          17,
          18,
          16,
          18,
          19, // right
          20,
          21,
          22,
          20,
          22,
          23, // left
        ];
      
        // Now send the element array to GL
      
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW
        );
      
        this.indexBuffer = indexBuffer;
      }
}


class Cone extends Figura{

    constructor(resolution){

        super();

        this.resolution = resolution;

        this.setupVertices(resolution);
        this.setupColors();
        this.initIndexBuffer();
    }

    setupVertices(resolution){

        this.vertices = [];

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
            this.vertices [ vertexoffset ] = radius * Math.cos ( angle );
            this.vertices [ vertexoffset +1] = 0.0;
            this.vertices [ vertexoffset +2] = radius * Math.sin ( angle );
            vertexoffset += 3;
        }

        this.vertices [ vertexoffset ] = 0.0;
        this.vertices [ vertexoffset +1] = 0.0;
        this.vertices [ vertexoffset +2] = 0.0;
    }

    setupColors(){
        this.colors = [];

        let i = 0;
        for(let vertex of this.vertices){
            this.colors[i++] = (vertex > 0)? (vertex < 1)? vertex : 1 : -vertex;

            if(i%4 == 3)
                this.colors[i++] = 1.0;
        }
    }

    initIndexBuffer(){

        let resolution = this.resolution;

        let triangleIndices = [];
        
        // lateral surface
        var triangleoffset = 0;
        for (var i = 0; i < resolution ; i ++) {
            triangleIndices [ triangleoffset ] = 0;
            triangleIndices [ triangleoffset +1] = 1 + (i % resolution);
            triangleIndices [ triangleoffset +2] = 1 + ((i +1) % resolution );
            triangleoffset += 3;
        }

        for (var i = 0; i < resolution ; i ++) {
            triangleIndices [ triangleoffset ] = resolution +1;
            triangleIndices [ triangleoffset +1] = 1 + (i % resolution);
            triangleIndices [ triangleoffset +2] = 1 + ((i +1) % resolution);
            triangleoffset += 3;
        }

        let indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleIndices), gl.STATIC_DRAW);

        this.indexBuffer = indexBuffer;
    }

    desenhar(){

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        const vertexCount = 6*this.resolution;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;

        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    
}

class Cilindro extends Figura{

    constructor(resolution){

        super();

        this.resolution = resolution;

        this.setupVertices(resolution);
        this.setupColors();
        this.initIndexBuffer();
    }

    setupVertices(resolution){

        this.vertices = [];

        // base of the cone
        var radius = 1.0;
        var angle ;
        var step = 6.283185307179586476925286766559 / resolution ;
        var vertexoffset = 0;

        for (var i = 0; i < resolution ; i ++) {
            angle = step * i;
            this.vertices [ vertexoffset ] = radius * Math.cos ( angle );
            this.vertices [ vertexoffset +1] = 0.0;
            this.vertices [ vertexoffset +2] = radius * Math.sin ( angle );
            vertexoffset += 3;
        }

        // upper circle
        for (var i = 0; i < resolution ; i ++) {
            angle = step * i;
            this . vertices [ vertexoffset ] = radius * Math . cos ( angle );
            this . vertices [ vertexoffset +1] = 2.0;
            this . vertices [ vertexoffset +2] = radius * Math . sin ( angle );
            vertexoffset += 3;
        }
        
        this.vertices [ vertexoffset ] = 0.0;
        this.vertices [ vertexoffset +1] = 0.0;
        this.vertices [ vertexoffset +2] = 0.0;

        vertexoffset += 3;
        this . vertices [ vertexoffset ] = 0.0;
        this . vertices [ vertexoffset +1] = 2.0;
        this . vertices [ vertexoffset +2] = 0.0;



    }

    setupColors(){
        this.colors = [];

        let i = 0;
        for(let vertex of this.vertices){
            this.colors[i++] = (vertex > 0)? (vertex < 1)? vertex : 1 : -vertex;

            if(i%4 == 3)
                this.colors[i++] = 1.0;
        }
    }

    initIndexBuffer(){

        let resolution = this.resolution;

        let triangleIndices = [];
        
        // lateral surface
        var triangleoffset = 0;
        for (var i = 0; i < resolution ; i ++){
            triangleIndices [ triangleoffset ] = i;
            triangleIndices [ triangleoffset +1] = (i+1) % resolution ;
            triangleIndices [ triangleoffset +2] = (i % resolution ) + resolution ;
            triangleoffset += 3;
            triangleIndices [ triangleoffset ] = (i % resolution ) + resolution ;
            triangleIndices [ triangleoffset +1] = (i+1) % resolution ;
            triangleIndices [ triangleoffset +2] = ((i +1) % resolution) + resolution ;
            triangleoffset += 3;
        }
        // bottom of the cylinder
        for (var i = 0; i < resolution ; i ++){
            triangleIndices [ triangleoffset ] = i;
            triangleIndices [ triangleoffset +1] = (i+1) % resolution ;
            triangleIndices [ triangleoffset +2] = 2* resolution ;
            triangleoffset += 3;
        }
        // top of the cylinder
        for (var i = 0; i < resolution ; i ++){
            triangleIndices [ triangleoffset ] = resolution + i;
            triangleIndices [ triangleoffset +1] = ((i +1) % resolution) + resolution ;
            triangleIndices [ triangleoffset +2] = 2* resolution +1;
            triangleoffset += 3;
        }

        let indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleIndices), gl.STATIC_DRAW);

        this.indexBuffer = indexBuffer;
    }

    desenhar(){

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        const vertexCount = 12*this.resolution;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;

        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    
}
