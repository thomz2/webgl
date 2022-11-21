//NVMC vai ser o objeto que terá todas as propriedades necessárias para execução do programa
//Nesse caso, fará a ligação do backend do servidor responder o frontend do usuário
//Este último representado pelo NVMCClient
var NVMC = {};

// Global NVMC Client -> cliente, que irá renderizar os 
// ID 2.0
/***********************************************************************/
var NVMCClient = NVMCClient || {};
/***********************************************************************/

NVMCClient.ground = {};

//Inicializa tudo ao carregar a página
NVMCClient.onInitialize = function () {// line 119, Listing 2.9
    NVMC.log("SpiderGL Version : " + SGL_VERSION_STRING + "\n");
  
    var game = this.game;
    
    //Handler de eventos de keys
    var handleKey = {};
    handleKey["W"] = function (on) {
      game.playerAccelerate = on;
    };
    handleKey["S"] = function (on) {
      game.playerBrake = on;
    };
    handleKey["A"] = function (on) {
      game.playerSteerLeft = on;
    };
    handleKey["D"] = function (on) {
      game.playerSteerRight = on;
    };
    this.handleKey = handleKey;
    
    //Cria a stack? ( não sei a aplicação ainda...)
    this.stack = new SglMatrixStack();
    //Inicializa todos os objetos, isto é
    //Pega os objetos definidos dentro dessa função e cria os buffers para eles
    this.initializeObjects(this.ui.gl);
    //Instancia o shader a ser usado -> ***AINDA A SER DEFINIDO***
    this.uniformShader = new uniformShader(this.ui.gl);
  };


NVMCClient.initializeObjects = function (gl) {
    //Instancia um triângulo
    this.triangle = new Triangle();
    //Cria o buffer para esse triângulo
    this.createObjectBuffers(gl, this.triangle);
};

//Protótipo de um triângulo
function Triangle () {
    this.name = " Triangle ";
    this.vertices = new Float32Array ([0,0,0,0.5,0,-1,-0.5,0,-1]);
    this.triangleIndices = new Uint16Array ([0,1,2]);
    this.numVertices = 3;
    this.numTriangles = 1;
 };


//Criador de buffers para objetos, 
//recebe um objeto e cria os buffers para três propriedades:
//Posição dos vértices,                        o vertex Buffer
//Índices dos vértices que compõem triângulos, o indexBufferTriangles
//Arestas dos triângulos,                      o indexBufferEdges
NVMCClient.createObjectBuffers = function (gl, obj) {

  //Procedimento padrão, cria buffer
  obj.vertexBuffer = gl.createBuffer();
  //Liga a referência desse buffer ao gl.ARRAY_BUFFER, que age como ponteiro
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
  //Copia as informações para o gl.ARRAY_BUFFER, que na verdade é o obj.vertexBuffer
  gl.bufferData(gl.ARRAY_BUFFER, obj.vertices, gl.STATIC_DRAW);
  //Reseta o ponteiro para nulo, agora que o obj.vertexBuffer já tem os valores
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
  //Procedimento padrão para os índices dos vértices que compõem os triângulos do objeto
  obj.indexBufferTriangles = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferTriangles);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, obj.triangleIndices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // Para cada um dos triângulos, cria as três arestas ligando um vértice ao outro
  // como para (v1,v2) == (v2,v1), temos que colocar também mais três arestas simétricas
  var edges = new Uint16Array(obj.numTriangles * 3 * 2);
  for (var i = 0; i < obj.numTriangles; ++i) {
    edges[i * 6 + 0] = obj.triangleIndices[i * 3 + 0];
    edges[i * 6 + 1] = obj.triangleIndices[i * 3 + 1];
    edges[i * 6 + 2] = obj.triangleIndices[i * 3 + 0];
    edges[i * 6 + 3] = obj.triangleIndices[i * 3 + 2];
    edges[i * 6 + 4] = obj.triangleIndices[i * 3 + 1];
    edges[i * 6 + 5] = obj.triangleIndices[i * 3 + 2];
  }

  //Procedimento padrão para as arestas dos triângulos
  obj.indexBufferEdges = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferEdges);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, edges, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

//O shader a ser usado -> retorna o programa linkado ao shader de vértices e fragmentos
uniformShader = function (gl) {

    //Pseudo código para o shader do vértice -> desenha os vertices nas suas posições
    //Proximo passo cria as arestas
    var vertexShaderSource = `

    uniform mat4 uModelViewMatrix ; 
    uniform mat4 uProjectionMatrix ; 
    attribute vec3 aPosition ; 

    void main ( void ) 
    { 
        gl_Position = uProjectionMatrix * 
        uModelViewMatrix * vec4 ( aPosition , 1.0) ; 
    } 
    `;
    //Pseudo código para o shader de fragmentos -> pinta com a cor
    var fragmentShaderSource = `
    precision highp float ; 
    uniform vec4 uColor ; 
    void main ( void ) 
    { 
        gl_FragColor = vec4 ( uColor ); 
    } 
    `;
    // create the vertex shader
    var vertexShader = gl. createShader (gl. VERTEX_SHADER ) ;
    gl. shaderSource ( vertexShader , vertexShaderSource );
    gl. compileShader ( vertexShader ) ;
    // create the fragment shader
    var fragmentShader = gl. createShader (gl. FRAGMENT_SHADER );
    gl. shaderSource ( fragmentShader , fragmentShaderSource );
    gl. compileShader ( fragmentShader )

    // O atributo de posição tem indice 0
    var aPositionIndex = 0;

    // Create the shader program
    var shaderProgram = gl. createProgram ();
    gl. attachShader ( shaderProgram , vertexShader );
    gl. attachShader ( shaderProgram , fragmentShader );
    gl. bindAttribLocation ( shaderProgram , aPositionIndex , "aPosition ");
    gl. linkProgram ( shaderProgram );
    // If creating the shader program failed , alert
    if (! gl. getProgramParameter ( shaderProgram , gl. LINK_STATUS )) {
        var str = " Unable to initialize the shader program ";
        str += "VS : + gl. getShaderInfoLog ( vertexShader ) + ";
        alert (str );
    }
    shaderProgram.aPositionIndex = aPositionIndex ;
    shaderProgram.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram , " uModelViewMatrix ");
    shaderProgram.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram , " uProjectionMatrix ");
    shaderProgram.uColorLocation = gl.getUniformLocation (shaderProgram , " uColor ") ;

    return shaderProgram ;
};
  

//Desenha os objetos
//Última etapa, favor checar as outras antes
//Principalmente o onInitialize
NVMCClient.drawObject = function (gl, obj, fillColor, lineColor) {

  //Faz o procedimento padrão de colocar a referência no ARRAY_BUFFER
  //O vertexBuffer guardará as informações das posições dos vértices
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
  //Cria um atributo de índice aPositionIndex e guarda no contexto
  gl.enableVertexAttribArray(this.uniformShader.aPositionIndex);
  //Cria o ponteiro que seleciona as informações dos vértices para um atributo
  //Nesse caso, vai de 3 em 3 floats começando do índice 0 e sem espaçamento
  gl.vertexAttribPointer(this.uniformShader.aPositionIndex, 3, gl.FLOAT, false, 0, 0);

  //?
  gl.enable(gl.POLYGON_OFFSET_FILL);

  gl.polygonOffset(1.0, 1.0);

  //Alguma operação interna levando em conta os índices dos vértices dos triângulos do objeto?
  //Possivelmente o ELEMENT_ARRAY_BUFFER é usado para obter os índices dos triângulos
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferTriangles);
  //Algo relacionado ao modo de pintar ser pintar toda área do triângulo com a cor fillColor?
  gl.uniform4fv(this.uniformShader.uColorLocation, fillColor);
  //Desenha os elementos, número de triângulos baseado na quantidade explicitada no objeto
  gl.drawElements(gl.TRIANGLES, obj.triangleIndices.length, gl.UNSIGNED_SHORT, 0);

  gl.disable(gl.POLYGON_OFFSET_FILL);

  //Cor das linhas presumo, faz o setup delas
  gl.uniform4fv(this.uniformShader.uColorLocation, lineColor);
  //Usa o buffer de elementos para referenciar os índices das arestas guardados no indexBufferEdges
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferEdges);
  //Desenha as linhas
  gl.drawElements(gl.LINES, obj.numTriangles * 3 * 2, gl.UNSIGNED_SHORT, 0);

  //Reseta o ponteiro para ele apontar para o null
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  //Retira o atributo aPositionIndex( que nesse shader tem índice 0)
  gl.disableVertexAttribArray(this.uniformShader.aPositionIndex);
  //Reseta o ponteiro para ele apontar para o null
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

NVMCClient.drawCar = function (gl) {
  this.drawObject(gl, this.triangle, [1, 1, 1, 1], [1, 1, 1, 1]);
};

NVMCClient.drawScene = function (gl) {
  var width = this.ui.width;
  var height = this.ui.height
  var ratio = width / height;
  var stack = this.stack;

  gl.viewport(0, 0, width, height);

  // Clear the framebuffer
  gl.clearColor(0.34, 0.5, 0.74, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(this.uniformShader);

  gl.uniformMatrix4fv(this.uniformShader.uProjectionMatrixLocation, false, SglMat4.perspective(3.14 / 4, ratio, 1, 100));

  // var invV = SglMat4.lookAt([-30,20,30], [0,0,0], [0,1,0]);

  if (!this.first) {
    this.first = true;
    this.initpos = this.game.state.players.me.dynamicState.position;
  }
  var pos = this.game.state.players.me.dynamicState.position;//line 94, Listing 2.15
  var invV = SglMat4.lookAt([this.initpos[0], 10, this.initpos[2]], this.initpos, [0, 0, -1]);

  stack.loadIdentity();
  stack.multiply(invV);

  var T = SglMat4.translation(pos);
  stack.multiply(T);

  var D = SglMat4.rotationAngleAxis(this.game.state.players.me.dynamicState.orientation, [0, 1, 0]);
  stack.multiply(D);

  gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix);

  this.drawCar(gl);

  gl.useProgram(null);
  gl.disable(gl.DEPTH_TEST);
};
/***********************************************************************/



// NVMC Client Events
/***********************************************************************/

NVMCClient.onTerminate = function () {};

NVMCClient.onConnectionOpen = function () {
  NVMC.log("[Connection Open]");
};

NVMCClient.onConnectionClosed = function () {
  NVMC.log("[Connection Closed]");
};

NVMCClient.onConnectionError = function (errData) {
  NVMC.log("[Connection Error] : " + errData);
};

NVMCClient.onLogIn = function () {
  NVMC.log("[Logged In]");
};

NVMCClient.onLogOut = function () {
  NVMC.log("[Logged Out]");
};

NVMCClient.onNewRace = function (race) {
  NVMC.log("[New Race]");
};

NVMCClient.onPlayerJoin = function (playerID) {
  NVMC.log("[Player Join] : " + playerID);
  this.game.opponents[playerID].color = [0.0, 1.0, 0.0, 1.0];
};

NVMCClient.onPlayerLeave = function (playerID) {
  NVMC.log("[Player Leave] : " + playerID);
};

NVMCClient.onKeyDown = function (keyCode, event) {
  this.handleKey[keyCode] && this.handleKey[keyCode](true);
};

NVMCClient.onKeyUp = function (keyCode, event) {
  this.handleKey[keyCode] && this.handleKey[keyCode](false);
};

NVMCClient.onKeyPress = function (keyCode, event) {};

NVMCClient.onMouseButtonDown = function (button, x, y, event) {};

NVMCClient.onMouseButtonUp = function (button, x, y, event) {};

NVMCClient.onMouseMove = function (x, y, event) {};

NVMCClient.onMouseWheel = function (delta, x, y, event) {};

NVMCClient.onClick = function (button, x, y, event) {};

NVMCClient.onDoubleClick = function (button, x, y, event) {};

NVMCClient.onDragStart = function (button, x, y) {};

NVMCClient.onDragEnd = function (button, x, y) {};

NVMCClient.onDrag = function (button, x, y) {};

NVMCClient.onResize = function (width, height, event) {};

NVMCClient.onAnimate = function (dt) {
  this.ui.postDrawEvent();
};

NVMCClient.onDraw = function () {
  var gl = this.ui.gl;
  this.drawScene(gl);
};
