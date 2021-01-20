/* eslint-disable */
import React, { useRef, useEffect, useState } from 'react';

import styles from './abacus.module.scss';

const Abacus = () => {
	const renderer1 = useRef(null);
	const renderer2 = useRef(null);
	const [sliderPos, setSliderPos] = useState(window.innerWidth - 100);

	const init = require('./scene').default;
	useEffect(() => {
		if (typeof window !== undefined) {
			const dispose = init([renderer1.current, renderer2.current]);
			return dispose;
		}
	}, [init]);
	return (
		<div className={styles.container}>
			<div ref={renderer1} className={styles.renderer} style={{ right: `${sliderPos}px` }}></div>
			<div ref={renderer2} className={styles.renderer2} style={{ left: `${sliderPos}px` }}></div>

			<a href="/" style={{ position: 'fixed', bottom: 0, margin: 20 }}>
				Back
			</a>
			<Slider pos={sliderPos} setPos={setSliderPos} />
		</div>
	);
};

export default Abacus;

function Slider({ pos, setPos }) {
	const ref = useRef(null);
	// const [pos, setPos] = useState(0);

	function onPointerDown() {
		window.addEventListener('pointermove', onPointerMove, false);
		window.addEventListener('pointerup', onPointerUp, false);
	}
	function onPointerUp() {
		window.removeEventListener('pointermove', onPointerMove, false);
		window.removeEventListener('pointerup', onPointerUp, false);
	}

	function onPointerMove(e) {
		setPos(Math.max(0, Math.min(window.innerWidth, e.pageX)));
	}

	const offsetWidth = ref && ref.current && ref.current.offsetWidth;
	useEffect(() => {
		if (typeof window !== undefined) {
			// slider.style.touchAction = 'none'; // disable touch scroll
			ref.current.addEventListener('pointerdown', onPointerDown);
		}
	});

	return (
		<div ref={ref} className={styles.slider} style={{ left: pos - offsetWidth / 2 + 'px' }}></div>
	);
}
