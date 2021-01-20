const THREE = require('three');

const noop = () => {};

///////////////////////////
// Reference Planes
export function referential({ layer } = {}) {
	const group = new THREE.Group();

	const gridX = new THREE.GridHelper(160, 10);
	gridX.rotation.x = Math.PI / 2;
	gridX.layers.set(layer);

	const gridY = new THREE.GridHelper(160, 10);
	gridY.rotation.y = Math.PI / 2;
	gridY.layers.set(layer);

	group.add(gridX);
	group.add(gridY);

	return { mesh: group };
}

///////////////////////////
// Build trails
export function trail({ layer } = {}) {
	const colorArray = [
		new THREE.Color(0xff0080),
		new THREE.Color(0xffffff),
		new THREE.Color(0x8000ff),
	];
	const positions = [];
	const colors = [];

	for (let i = 0; i < 100; i++) {
		positions.push((Math.random() - 0.5) * i, (Math.random() - 0.5) * i, (Math.random() - 0.5) * i);

		const clr = colorArray[Math.floor(Math.random() * colorArray.length)];

		colors.push(clr.r, clr.g, clr.b);
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

	const material = new THREE.PointsMaterial({
		size: 4,
		vertexColors: true,
		depthTest: false,
		sizeAttenuation: false,
	});

	const mesh = new THREE.Points(geometry, material);
	mesh.layers.set(layer);

	const transform = ({ clock }) => {
		const elapsedTime = clock.getElapsedTime();
		mesh.rotation.y = elapsedTime * 0.5;
	};

	return { mesh, transform };
}
