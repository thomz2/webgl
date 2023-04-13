// fisica.js

export function distPontos2D(x1, y1, x2, y2) {
    return Math.sqrt( Math.pow( (x1 - x2), 2 ) + Math.pow( (y1 - y2), 2 ) );
}

export function dist3Pontos2D(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt( Math.pow( (x1 - x2), 2 ) + Math.pow( (y1 - y2), 2 ) + Math.pow( (z1 - z2), 2 ) ) ;
}

// ANGULO EM RADIANO
export function calcular_posicao_vertice(centro_x, centro_y, raio, angulo) {
    const x = centro_x + raio * Math.cos(angulo);
    const y = centro_y + raio * Math.sin(angulo);

    return {x, y};
}
