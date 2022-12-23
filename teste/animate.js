function Animate(programa){

    let deltaTime = 0;
    let then = 0;
    let squareRotation = 0;

    // Draw the scene repeatedly
    let render = function(now) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;
        
        squareRotation += deltaTime;

        programa.rotation = SglMat4.rotationAngleAxis(squareRotation, [0.0, 1.0, 0.0]);
        programa.rotation = SglMat4.mul(SglMat4.rotationAngleAxis(squareRotation, [1.0, 0.0, 1.0]), programa.rotation);
        programa.rotation = SglMat4.mul(SglMat4.rotationAngleAxis(squareRotation, [1.0, 1.0, 1.0]), programa.rotation);

        programa.onInitialize();
        programa.onDraw();   

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
