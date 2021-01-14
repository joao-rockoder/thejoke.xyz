/* eslint-disable */
import React, { useRef, useEffect } from 'react';

import './reset.css';

const Fractal = () => {
	const ref = useRef(null);

	useEffect(() => {
		if (typeof window !== undefined) {
			const init = require('./model').init;
			const dispose = init(ref.current)();
			return dispose;
		}
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
