window.onload = function () {
    main();
};

function main() {
    var vShaderSrc =
        'attribute vec4 aPosition;' +
        'void main() {' +
        '   gl_Position = aPosition;' +
        '   gl_PointSize = 10.0;' +
        '}';
    var fShaderSrc =
        'precision mediump float;' +
        'uniform vec4 uFragColor;' +
        'void main() {' +
        '   gl_FragColor = uFragColor;' +
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

    var aPosition = gl.getAttribLocation(gl.program, 'aPosition');
    if (aPosition < 0) {
        console.log('Failed - aPosition!');
        return;
    }

    var uFragColor = gl.getUniformLocation(gl.program, 'uFragColor');
    if (uFragColor < 0) {
        console.log('Failed - uFragColor!');
        return;
    }

    canvas.onmousedown = function (event) {
        click(event, gl, canvas, aPosition, uFragColor);
    };

    var gPoints = [];
    var gColors = [{
        r: 0.5,
        g: 0.2,
        b: 0.4,
        a: 1.0
    }, {
        r: 0.0,
        g: 1.0,
        b: 0.4,
        a: 1.0
    }, {
        r: 0.8,
        g: 0.0,
        b: 0.0,
        a: 1.0
    }, {
        r: 1.0,
        g: 0.3,
        b: 0.8,
        a: 1.0
    }];

    function click(event, gl, canvas, aPosition, uFragColor) {
        var mousePos = {
            x: event.clientX,
            y: event.clientY
        };
        var canvasRect = event.target.getBoundingClientRect();
        var glPos = {
            x: ((mousePos.x - canvasRect.left) - canvas.width / 2) / (canvas.width / 2),
            y: (canvas.height / 2 - (mousePos.y - canvasRect.top)) / (canvas.height / 2)
        };
        gPoints.push(glPos);

        gl.clear(gl.COLOR_BUFFER_BIT);

        for (var i = 0, point; point = gPoints[i]; i++) {
            gl.vertexAttrib3f(aPosition, point.x, point.y, 0.0);
            var color = gColors[(Math.floor(Math.random() * 10) % 4)];
            gl.uniform4f(uFragColor, color.r, color.g, color.b, color.a);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
    
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
