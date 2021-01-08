const dat = require('dat.gui');
const THREE = require('three');

const ASPECT = window.innerWidth / window.innerHeight;
const ZOOM = 4.0;
const OFFSET = new THREE.Vector2(-2.0 * ASPECT, -2.0);
const ANTIALIAS = false;
const PRECISION = 'highp';

const PARAMETERS = {
	a: { value: 1.01, min: -5.0, max: 5.0 },
	b: { value: 0.01, min: -5.0, max: 5.0 },
	c: { value: 0.01, min: -5.0, max: 5.0 },
	d: { value: 0.01, min: -5.0, max: 5.0 },
	e: { value: 0.01, min: -5.0, max: 5.0 },
	f: { value: 0.01, min: -5.0, max: 5.0 },
	zoom: { value: ZOOM, min: -5.0, max: 5.0 },
};

// INIT SCENE/ RENDERER
export function init(el) {
	// MATERIAL
	const { mesh, uniforms } = buildGeometry(PARAMETERS);
	// GUI
	const { gui } = buildGUI({ parameters: PARAMETERS, uniforms });

	// RENDERER
	const renderer = new THREE.WebGLRenderer({ antialias: ANTIALIAS, precision: PRECISION });
	renderer.setSize(window.innerWidth, window.innerHeight - 2);

	// SCENE
	const scene = new THREE.Scene();
	const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
	const { animate, windowResize, scroll } = makeEventHandlers({
		renderer,
		scene,
		camera,
		uniforms,
	});

	scene.add(mesh);

	return function init() {
		el.appendChild(renderer.domElement);
		console.log('appending', renderer.domElement);

		window.addEventListener('resize', windowResize, false);
		document.addEventListener('wheel', scroll);

		animate();
		console.log('animating2');

		return () => {
			window.removeEventListener('resize', windowResize);
			document.removeEventListener('wheel', scroll);

			mesh.geometry.dispose();
			mesh.material.dispose();
			scene.remove(mesh);
			renderer.renderLists.dispose();
			gui.destroy();
			el.removeChild(renderer.domElement);
			console.log('disposed');
		};
	};
}

// MATERIAL / GEOMETRY
function buildGeometry(parameters) {
	const uniforms = {
		res: { type: 'vec2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
		aspect: { type: 'float', value: ASPECT },
		zoom: { type: 'float', value: parameters['zoom'].value },
		offset: { type: 'vec2', value: OFFSET },
		pset1: {
			type: 'vec3',
			value: new THREE.Vector3(parameters['a'].value, parameters['b'].value, parameters['c'].value),
		},
		pset2: {
			type: 'vec3',
			value: new THREE.Vector3(parameters['d'].value, parameters['e'].value, parameters['f'].value),
		},
	};
	const geometry = new THREE.PlaneBufferGeometry(2, 2);
	const material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		fragmentShader: fragmentShader(),
	});
	return {
		mesh: new THREE.Mesh(geometry, material),
		uniforms,
	};
}

// GUI
function buildGUI({ parameters, uniforms }) {
	const gui = new dat.GUI({ width: 300 });

	const guiParameters = Object.keys(parameters).reduce((acc, key) => {
		return { ...acc, [key]: parameters[key].value };
	}, {});

	for (var key in parameters) {
		gui
			.add(guiParameters, key, parameters[key].min, parameters[key].max)

			.onChange(() => updateUniforms(guiParameters, uniforms));
	}

	return { gui };

	function updateUniforms(parameters, uniforms) {
		uniforms['pset1']['value'] = new THREE.Vector3(
			parameters['a'],
			parameters['b'],
			parameters['c']
		);
		uniforms['pset2']['value'] = new THREE.Vector3(
			parameters['d'],
			parameters['e'],
			parameters['f']
		);
		uniforms['zoom']['value'] = parameters['zoom'];
	}
}

// make event handlers
function makeEventHandlers({ renderer, scene, camera, uniforms }) {
	//aspect intentionaly not updated
	const aspect = window.innerWidth / window.innerHeight;

	function animate() {
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}

	function windowResize() {
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight - 2);
	}

	function scroll(event) {
		const zoom = uniforms.zoom.value;
		let zoomTransform = zoom;
		let offset = uniforms.offset.value;
		let zoom_0 = zoom;
		if ('wheelDeltaY' in event) {
			// chrome vs. firefox
			zoomTransform *= 1 - event.wheelDeltaY * 0.0003;
		} else {
			zoomTransform *= 1 + event.deltaY * 0.01;
		}

		let space = zoomTransform - zoom_0;
		let mouseX = event.clientX / window.innerWidth;
		let mouseY = 1 - event.clientY / window.innerHeight;
		offset = offset.add(new THREE.Vector2(-mouseX * space * aspect, -mouseY * space));

		uniforms['zoom']['value'] = zoomTransform;
		uniforms['offset']['value'] = offset;
	}

	return { animate, windowResize, scroll };
}

// shaders ===========================================
// don't need vertex shader

function fragmentShader() {
	return `
precision highp float;
uniform vec2 res;
uniform float aspect;
uniform float zoom;
uniform vec2 offset;

// gui parameters
uniform vec3 pset1;
uniform vec3 pset2;

vec2 cm (vec2 a, vec2 b){
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + b.x*a.y);
}

vec2 conj (vec2 a){
  return vec2(a.x, -a.y);
}

float mandelbrot(vec2 c){
  float alpha = 1.0;
  vec2 z = vec2(0.0 , 0.0);
  vec2 z_0;
  vec2 z_1;
  vec2 z_2;

  for(int i=0; i < 200; i++){  // i < max iterations
    z_2 = z_1;
    z_1 = z_0;
    z_0 = z;

    float x_0_sq = z_0.x*z_0.x;
    float y_0_sq = z_0.y*z_0.y;
    vec2 z_0_sq = vec2(x_0_sq - y_0_sq, 2.0*z_0.x*z_0.y);
    float x_1_sq = z_1.x*z_1.x;
    float y_1_sq = z_1.y*z_1.y;
    vec2 z_1_sq = vec2(x_1_sq - y_1_sq, 2.0*z_1.x*z_1.y);

    // the recurrence equation
    z = pset1.x*z_0_sq + c + pset1.y*z_1_sq
    + pset1.z*cm(z_1_sq, z_2) + pset2.x*cm(z_1_sq, z_0)
    + pset2.y*cm(z_2, z_0) + pset2.z*cm(z_1, z_2);

    float z_0_mag = x_0_sq + y_0_sq;
    float z_1_mag = x_1_sq + y_1_sq;

    if(z_0_mag > 12.0){
      float frac = (12.0 - z_1_mag) / (z_0_mag - z_1_mag);
      alpha = (float(i) - 1.0 + frac)/200.0; // should be same as max iterations
      break;
    }
  }

  return alpha;
}

void main(){ // gl_FragCoord in [0,1]
  vec2 uv = zoom * vec2(aspect, 1.0) * gl_FragCoord.xy / res + offset;
  float s = 1.0 - mandelbrot(uv);

  vec3 coord = vec3(s, s, s);
  gl_FragColor = vec4(pow(coord, vec3(5.38, 6.15, 3.85)), 1.0);
}
  `;
}
