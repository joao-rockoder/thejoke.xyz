const THREE = require('three');

export const noop = () => {};

export function makeModel(model) {
	const stats = new require('stats.js')();
	const clock = new THREE.Clock();

	const { scene } = makeScene(model.scene);
	const camera = model.cameras.cam1;

	const renderers = model.renderers
		.map((renderer) => makeRenderer(renderer, scene))
		.filter(Boolean);

	stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

	const transform = []; //TODO

	window.addEventListener('resize', onWindowResize, false);
	document.body.appendChild(stats.dom);

	renderers.forEach(({ renderer, element }) => {
		element.appendChild(renderer.domElement);
	});
	// set animation on first renderer
	renderers[0].renderer.setAnimationLoop(() => animate({ transform }));

	return () => {
		window.removeEventListener('resize', onWindowResize);

		renderers.forEach(({ renderer, element }) => {
			dispose(renderer, scene, THREE);
			element.removeChild(renderer.domElement);
		});

		stats.end();
		document.body.removeChild(stats.dom);
	};

	function animate(props) {
		const { transform = [] } = props || {};
		transform.map((fn) => fn({ clock }));
		renderers.forEach(({ update }) => update());
		stats.update();
	}

	// On window resize
	function onWindowResize() {
		// camera.aspect = window.innerWidth / window.innerHeight;
		// camera.updateProjectionMatrix();
		renderers.forEach(({ renderer }) => renderer.setSize(window.innerWidth, window.innerHeight));
	}
}

//////////
// MAKE RENDERER
export function makeRenderer({ args, properties = {}, other = {}, element, source }, scene) {
	if (!element) {
		return;
	}

	const { apply, orbitControls } = other;
	// RENDERER
	const renderer = new THREE.WebGLRenderer(args);

	if (apply) {
		apply(renderer);
	} else {
		//default initialization
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight - 2);
	}

	// add Orbit Controls
	if (orbitControls) {
		const OrbitControls = require('three-orbit-controls')(THREE);
		const controls = new OrbitControls(orbitControls.camera, renderer.domElement);
		controls.minDistance = orbitControls.minDistance;
		controls.maxDistance = orbitControls.maxDistance;
	}

	if (element) {
		element.appendChild(renderer.domElement);
	}

	Object.keys(properties).map((prop) => (renderer[prop] = properties[prop]));

	const update = source ? () => renderer.render(scene, source) : noop;

	return { renderer, element, update };
}

//////////
// MAKE SCENE
export function makeScene({ geometries = [], init, lights }) {
	// SCENE
	const scene = new THREE.Scene();
	init && init(scene);

	// add geometries
	const geo = geometries.map((obj) => obj.geometry({ layer: obj.layer }));
	geo.forEach((el) => scene.add(el.mesh));
	// add lighting
	Object.keys(lights).map((key) => scene.add(lights[key]));

	return { scene, lights, geometries: geo };
}

////////////////////////////
// Make Camera
export function applyToObject({ object, applyMethods }) {
	applyMethods(object);
	return object;
}

/////////////////
// DISPOSE
export function dispose(renderer, scene) {
	renderer.dispose();

	scene.traverse((object) => {
		// console.log('dispose geometry!');
		object.geometry && object.geometry.dispose();

		if (!object.material) return;

		if (object.material.isMaterial) {
			cleanMaterial(object.material);
		} else {
			// an array of materials
			for (const material of object.material) cleanMaterial(material);
		}
	});

	function cleanMaterial(material) {
		// console.log('dispose material');
		material.dispose();

		// dispose textures
		for (const key of Object.keys(material)) {
			const value = material[key];
			if (value && typeof value === 'object' && 'minFilter' in value) {
				// console.log('dispose texture!');
				value.dispose();
			}
		}
	}
	scene.remove.apply(scene, scene.children);
}
