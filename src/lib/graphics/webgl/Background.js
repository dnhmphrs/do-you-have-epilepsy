import { createShaderProgram, setupBuffer } from './UtilFunctions';

const bgVertShaderSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0, 1);
  }
`;

const bgFragShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform float time;
  uniform float aspectRatio;

  // Simple pseudo-random number generator
  float random(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  void main() {
    // Generate random color based on time
    float r = random(time);
    float g = random(time + 1.0);
    float b = random(time + 2.0);
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;


export function setupBackground(gl) {
	const program = createShaderProgram(gl, bgVertShaderSource, bgFragShaderSource);
	const positionBuffer = setupBuffer(gl, [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
	const positionAttributeLocation = gl.getAttribLocation(program, 'position');
	const timeUniformLocation = gl.getUniformLocation(program, 'time');
	const aspectRatioUniformLocation = gl.getUniformLocation(program, 'aspectRatio');

	return {
		program,
		positionBuffer,
		positionAttributeLocation,
		timeUniformLocation,
		aspectRatioUniformLocation
	};
}

export function drawBackground(gl, bg, time, aspectRatio) {
	gl.useProgram(bg.program);
	gl.bindBuffer(gl.ARRAY_BUFFER, bg.positionBuffer);
	gl.vertexAttribPointer(bg.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(bg.positionAttributeLocation);
	// uniforms
	gl.uniform1f(bg.timeUniformLocation, time);
	gl.uniform1f(bg.aspectRatioUniformLocation, aspectRatio);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export function cleanupBackground(gl, bg) {
	gl.deleteProgram(bg.program);
	gl.deleteBuffer(bg.positionBuffer);
}
