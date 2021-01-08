/* eslint-disable */
import React, { useRef, useEffect } from 'react';

import { init } from './model';

import './reset.css';

const Fractal = () => {
	const ref = useRef(null);

	useEffect(() => {
		const dispose = init(ref.current)();
		return dispose;
	});
	return (
		<div ref={ref}>
			<a href="/" style={{ position: 'fixed', bottom: 0, margin: 20 }}>
				Back
			</a>
		</div>
	);
};

export default Fractal;
