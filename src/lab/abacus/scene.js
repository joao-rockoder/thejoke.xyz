import { applyToObject, makeModel } from './utils';

import { referential, trail } from './geometry';

const THREE = require('three');
const ASPECT_RATIO = window.innerWidth / window.innerHeight;

const cam2 = applyToObject({
	object: new THREE.PerspectiveCamera(50, ASPECT_RATIO, 1, 100000),
	applyMethods: (obj) => {
		obj.position.set(0, 0, 0);
		obj.layers.disable(0);
		obj.layers.enable(1);
	},
});
const cam1 = applyToObject({
	object: new THREE.PerspectiveCamera(50, ASPECT_RATIO, 1, 100000),
	applyMethods: (obj) => {
		obj.position.set(0, 0, 200);
		obj.layers.enableAll();
		obj.add(cam2);
	},
});

const model = (elements) => ({
	scene: {
		init: (scene) => (scene.background = new THREE.Color(0xb0b0b0)),
		geometries: [
			{ geometry: referential, layer: 0 },
			{ geometry: trail, layer: 1 },
		],
		lights: {
			directional: applyToObject({
				object: new THREE.DirectionalLight(0xffffff, 0.6),
				applyMethods: (obj) => obj.position.set(0.75, 0.75, 1.0).normalize(),
			}),
			ambientLight: new THREE.AmbientLight(0xcccccc, 0.2),
		},
	},
	cameras: {
		cam1,
		cam2,
	},
	renderers: [
		{
			args: {
				antialias: false,
				// precision: 'highp',
			},
			properties: {},
			other: { orbitControls: { camera: cam1, minDistance: 100, maxDistance: 10000 } },
			element: elements[0],
			source: cam1,
		},
		{
			args: {
				antialias: false,
				preserveDrawingBuffer: true,
			},
			properties: { autoClearColor: false },
			element: elements[1],
			source: cam2,
		},
	],
});

// INIT SCENE/ RENDERER
export default function init(elements) {
	return makeModel(model(elements));
}
