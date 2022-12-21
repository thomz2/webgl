//Dá problemas com o html, reclama sem quando não explicita type module, 
//mas quando explicitado diz que viola a política de segurança

export class Figura{

    setupGraphics(gl){
        
        this.gl = this.gl;

        return this;
    }

    createBuffers(){

        this.VertexPositionBuffer = new Sthis.glVertexBuffer(this.gl, {
            data: new Float32Array(this.vertices),
            usage: this.gl.STATIC_DRAW
        });

        this.VertexColorsBuffer = new Sthis.glVertexBuffer(this.gl, {
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


export class Triangulo extends Figura{

    constructor(){

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
}