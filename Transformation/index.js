window.onload = function() {
    main();
};

function main() {
    var vShaderSrc =
        'attribute vec4 aPosition;' +
        'uniform mat4 uMatrix;' +
        'void main() {' +
        '   gl_Position = uMatrix * aPosition;' +
        '}';
    var fShaderSrc =
        'void main() {' +
        '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);' +
        '}';

    var canvas = document.getElementById('canvas');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('No WebGL!');
        return;
    }

    if (!initShaders(gl, vShaderSrc, fShaderSrc)) {
        console.log('Initialization failed!');
        return;
    }

    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed - initVertexBuffers!');
        return;
    }

    var translateMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.1, 0.5, 0.0, 1.0
    ]);

    var uMatrix = gl.getUniformLocation(gl.program, 'uMatrix');
    if (!uMatrix) {
        console.log('Failed - uMatrix!');
        return;
    }

    gl.uniformMatrix4fv(uMatrix, false, translateMatrix);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0, 0.1, -0.1, -0.1, 0.1, -0.1
    ]);

    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed - vertexBuffer');
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(gl.program, 'aPosition');
    if (aPosition < 0) {
        console.log('Failed - aPosition');
        return;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
}
