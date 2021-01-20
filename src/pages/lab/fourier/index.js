/* eslint-disable */
import React, { useRef, useEffect } from 'react';
import { Link } from 'gatsby';

import Layout from 'components/layout';

import Conductor from './conductor.js';
import WaveController from './wave-controller.js';
import RangeController from './range-controller.js';
import WaveSplitController from './wave-split-controller.js';
import WaveDrawController from './wave-draw-controller.js';
import WaveSamplesController from './wave-samples-controller.js';
import WaveFrequenciesController from './wave-frequencies-controller.js';
import EpicyclesController from './epicycles-controller.js';
import ComplexSinusoidController from './complex-sinusoid-controller.js';
import SkewedSinusoidController from './skewed-sinusoid-controller.js';
import SkewedPathController from './skewed-path-controller.js';
import DrawController from './draw-controller.js';
import ImageSwapController from './image-swap-controller.js';
import ImageBuildUpController from './image-build-up-controller.js';
import JpegCompressorController from './jpeg-compressor-controller.js';
import ImageMultController from './image-mult-controller.js';
import { peaceHandPoints } from './points/peace-hand-points.js';
import { titlePoints } from './points/title-points.js';
import { getWave, squareWave } from './wave-things.js';
import { playSoundWave } from './synth.js';
import { loopLikeAJpeg } from './jpeg.js';

// import './styles.css';

const Fourier = () => {
	const ref = useRef(null);
	useEffect(() => {
		const controllers = loadCanvasControllers([]);

		const conductor = new Conductor(controllers);
		conductor.start();
		// To let me play around with things in the console.
		window.conductor = conductor;
	});

	return (
		<Layout>
			<div ref={ref}>
				<canvas id="combo-sine-wave" className="sketch" width="500" height="300" />
				<canvas id="combo-sine-wave-split" className="sketch" width="500" height="500" />
				<p>
					Being able to split them up on a computer can give us an understanding of what a person
					actually hears. We can understand how high or low a sound is, or figure out what note it
					is.
				</p>
				<p>
					We can also use this process on waves that don't look like they're made of sine waves.
				</p>
				<p>Let's take a look at this guy. It’s called a square wave.</p>
				<canvas id="square-wave" className="sketch" width="500" height="300"></canvas>
				<p>It might not look like it, but it also can be split up into sine waves.</p>
				<canvas id="square-wave-split" className="sketch" width="500" height="500"></canvas>
				<p>
					We need a lot of them this time – technically an infinite amount to perfectly represent
					it. As we add up more and more sine waves the pattern gets closer and closer to the square
					wave we started with.
				</p>
				<canvas id="square-wave-build-up" className="sketch" width="500" height="500"></canvas>
				<p>
					<input
						id="square-wave-build-up-slider"
						type="range"
						min="0"
						max="1"
						defaultValue="0"
						step="any"
					/>
				</p>

				<div className="multi-container">
					<div className="sketch">
						<canvas id="wave-draw" className="sketch-child" width="500" height="300"></canvas>
						<p id="wave-draw-instruction" className="instruction wave-instruction">
							Draw here!
						</p>
					</div>
					<canvas id="wave-draw-split" className="sketch" width="500" height="500"></canvas>
				</div>
				<p>
					<input id="wave-draw-slider" type="range" min="0" max="1" defaultValue="1" step="any" />
					<button id="wave-draw-button" className="button">
						Play Wave
					</button>
				</p>
				<p>
					<em>
						Move the slider to see how as we add more sine waves, it gets closer and closer to your
						drawing
					</em>
				</p>
				<p>
					Again, aside from the extra wigglyness, the wave looks pretty similar with just half of
					the sine waves.
				</p>
				<p>
					We can actually use the fact that the wave is pretty similar to our advantage. By using a
					Fourier transform, we can get the important parts of a sound, and only store those to end
					up with something that's pretty close to the original sound.
				</p>
				<p>Normally on a computer we store a wave as a series of points.</p>
				<canvas id="wave-samples" className="sketch" width="500" height="500"></canvas>
				<p>
					What we can do instead is represent it as a bunch of sine waves. Then we can compress the
					sound by ignoring the smaller frequencies. Our end result won't be the same, but it'll
					sound pretty similar to a person.
				</p>
				<canvas id="wave-frequencies" className="sketch" width="500" height="500"></canvas>
				<p>
					This is essentially what MP3s do, except they're more clever about which frequencies they
					keep and which ones they throw away.
				</p>
				<p>
					So in this case, we can use Fourier transforms to get an understanding of the fundamental
					properties of a wave, and then we can use that for things like compression.
				</p>
				<p>
					Ok, now let's dig more into the Fourier transform. This next part looks cool, but also
					gives you a bit more understanding of what the Fourier transform does. But mostly looks
					cool.
				</p>
				<h2 id="epicycles">Epicycles</h2>
				<p>
					Now at the start, I said it splits things into sine waves. The thing is, the sine waves it
					creates are not just regular sine waves, but they’re 3D. You could call them "complex
					sinusoids". Or just "spirals".
				</p>
				<canvas id="complex-sinusoid" className="sketch" width="500" height="500"></canvas>
				<p>
					If we take a look from the side, they look like sine waves. From front on, though, these
					look like circles.
				</p>
				<canvas id="complex-sinusoid-turn" className="sketch" width="500" height="500"></canvas>
				<p>
					So far everything we’ve been doing has only required the regular 2D sine waves. When we do
					a Fourier transform on 2D waves, the complex parts cancel out so we just end up with sine
					waves.
				</p>
				<p>But we can use the 3D sine waves to make something fun looking like this:</p>
				<canvas id="peace-epicycles" className="sketch" width="500" height="500"></canvas>
				<p>What’s going on here?</p>
				<p>
					Well, we can think of the drawing as a 3D shape because of the way it moves around in
					time. If you imagine the hand being drawn by a person, the three dimensions represent
					where the tip of their pencil is at that moment. The x and y dimensions tell us the
					position, and then the time dimension is the time at that moment.
				</p>
				<canvas id="peace-3d" className="sketch" width="500" height="500"></canvas>
				<p>
					Now that we have a 3D pattern, we can't use the regular 2D sine waves to represent it. No
					matter how many of the 2D sine waves we add up, we'll never get something 3D. So we need
					something else.
				</p>
				<p>
					What we can use is the 3D spiral sine waves from before. If we add up lots of those, we
					can get something that looks like our 3D pattern.
				</p>
				<p>
					Remember, these waves look like circles when we look at them from front on. The name for
					the pattern of a circle moving around another circle is an epicycle.
				</p>
				<canvas id="peace-build-up" className="sketch" width="500" height="500"></canvas>
				<p>
					<input
						id="peace-build-up-slider"
						type="range"
						min="0"
						max="1"
						defaultValue="1"
						step="any"
					/>
				</p>
				<p>
					<em>Use the slider above to control how many circles there are.</em>
				</p>
				<p>
					Like before, we get a pretty good approximation of our pattern with just a few circles.
					Because this is a fairly simple shape, all the last ones do is make the edges a little
					sharper.
				</p>
				<p>All this applies to any drawing, really! Now it’s your chance to play around with it.</p>
				<div className="multi-container">
					<div className="sketch">
						<canvas id="draw-zone" className="sketch-child" width="500" height="500"></canvas>
						<p id="draw-zone-instruction" className="instruction">
							Draw here!
						</p>
						<button id="draw-zone-undo-button" className="button embedded-button">
							Undo
						</button>
					</div>
					<canvas id="circle-zone" className="sketch" width="500" height="500"></canvas>
				</div>
				<p>
					<input id="circle-zone-slider" type="range" min="0" max="1" defaultValue="1" step="any" />
				</p>
				<p>
					<em>Use the slider to control how many circles are used for your drawing</em>
				</p>
				<p>
					Again, you'll see for most shapes, we can approximate them fairly well with just a small
					number of circles, instead of saving all the points.
				</p>
				<p>
					Can we use this for real data? Well, we could! In reality we have another data format
					called SVG, which probably does a better job for the types of shapes we tend to create. So
					for the moment, this is really just for making cool little gifs.
				</p>
				<canvas id="fourier-title" className="sketch" width="500" height="300"></canvas>
				<p>There is another type of visual data that does use Fourier transforms, however.</p>
				<h2 id="jpegs">JPEGs</h2>
				<p>
					Did you know Fourier transforms can also be used on images? In fact, we use it all the
					time, because that's how JPEGs work! We're applying the same principles to images –
					splitting up something into a bunch of sine waves, and then only storing the important
					ones.
				</p>
				<p>
					Now we're dealing with images, we need a different type of sine wave. We need to have
					something that no matter what image we have, we can add up a bunch of these sine waves to
					get back to our original image.
				</p>
				<p>
					To do that, each of our sine waves will be images too. Instead of a wave that's a line, we
					now have images with black and white sections. To represent the size of a wave, each image
					will have more or less contrast.
				</p>
				<p>
					We can also use these to represent color in the same way, but let's start with
					black-and-white images for now. To represent colorless images, we need some horizontal
					wave images,
				</p>
				<p>
					<img
						id="img-y-component"
						src="/images/fourier/components-4-0.png"
						className="sketch sketch-small"
					/>
				</p>
				<p>Along with some vertical wave images.</p>
				<p>
					<img
						id="img-x-component"
						src="/images/fourier/components-0-4.png"
						className="sketch sketch-small"
					/>
				</p>
				<p>
					By themselves, just horizontal and vertical images aren't enough to represent the types of
					images we get. We also need some extra ones that you get by multiplying the two together.
				</p>
				<div className="multi-container">
					<img
						id="img-mult-x-component"
						src="/images/fourier/components-0-4.png"
						className="sketch sketch-mult"
					/>
					<div className="maths">×</div>
					<img
						id="img-mult-y-component"
						src="/images/fourier/components-4-0.png"
						className="sketch sketch-mult"
					/>
					<div className="maths">=</div>
					<img
						id="img-x-y-component"
						src="/images/fourier/components-4-4.png"
						className="sketch sketch-mult"
					/>
				</div>
				<p>For an 8x8 image, here are all the images we need.</p>
				<div className="img-component-container">
					<img src="/images/fourier/components-0-0.png" className="img-component" />
					<img src="/images/fourier/components-0-1.png" className="img-component" />
					<img src="/images/fourier/components-0-2.png" className="img-component" />
					<img src="/images/fourier/components-0-3.png" className="img-component" />
					<img src="/images/fourier/components-0-4.png" className="img-component" />
					<img src="/images/fourier/components-0-5.png" className="img-component" />
					<img src="/images/fourier/components-0-6.png" className="img-component" />
					<img src="/images/fourier/components-0-7.png" className="img-component" />
					<img src="/images/fourier/components-1-0.png" className="img-component" />
					<img src="/images/fourier/components-1-1.png" className="img-component" />
					<img src="/images/fourier/components-1-2.png" className="img-component" />
					<img src="/images/fourier/components-1-3.png" className="img-component" />
					<img src="/images/fourier/components-1-4.png" className="img-component" />
					<img src="/images/fourier/components-1-5.png" className="img-component" />
					<img src="/images/fourier/components-1-6.png" className="img-component" />
					<img src="/images/fourier/components-1-7.png" className="img-component" />
					<img src="/images/fourier/components-2-0.png" className="img-component" />
					<img src="/images/fourier/components-2-1.png" className="img-component" />
					<img src="/images/fourier/components-2-2.png" className="img-component" />
					<img src="/images/fourier/components-2-3.png" className="img-component" />
					<img src="/images/fourier/components-2-4.png" className="img-component" />
					<img src="/images/fourier/components-2-5.png" className="img-component" />
					<img src="/images/fourier/components-2-6.png" className="img-component" />
					<img src="/images/fourier/components-2-7.png" className="img-component" />
					<img src="/images/fourier/components-3-0.png" className="img-component" />
					<img src="/images/fourier/components-3-1.png" className="img-component" />
					<img src="/images/fourier/components-3-2.png" className="img-component" />
					<img src="/images/fourier/components-3-3.png" className="img-component" />
					<img src="/images/fourier/components-3-4.png" className="img-component" />
					<img src="/images/fourier/components-3-5.png" className="img-component" />
					<img src="/images/fourier/components-3-6.png" className="img-component" />
					<img src="/images/fourier/components-3-7.png" className="img-component" />
					<img src="/images/fourier/components-4-0.png" className="img-component" />
					<img src="/images/fourier/components-4-1.png" className="img-component" />
					<img src="/images/fourier/components-4-2.png" className="img-component" />
					<img src="/images/fourier/components-4-3.png" className="img-component" />
					<img src="/images/fourier/components-4-4.png" className="img-component" />
					<img src="/images/fourier/components-4-5.png" className="img-component" />
					<img src="/images/fourier/components-4-6.png" className="img-component" />
					<img src="/images/fourier/components-4-7.png" className="img-component" />
					<img src="/images/fourier/components-5-0.png" className="img-component" />
					<img src="/images/fourier/components-5-1.png" className="img-component" />
					<img src="/images/fourier/components-5-2.png" className="img-component" />
					<img src="/images/fourier/components-5-3.png" className="img-component" />
					<img src="/images/fourier/components-5-4.png" className="img-component" />
					<img src="/images/fourier/components-5-5.png" className="img-component" />
					<img src="/images/fourier/components-5-6.png" className="img-component" />
					<img src="/images/fourier/components-5-7.png" className="img-component" />
					<img src="/images/fourier/components-6-0.png" className="img-component" />
					<img src="/images/fourier/components-6-1.png" className="img-component" />
					<img src="/images/fourier/components-6-2.png" className="img-component" />
					<img src="/images/fourier/components-6-3.png" className="img-component" />
					<img src="/images/fourier/components-6-4.png" className="img-component" />
					<img src="/images/fourier/components-6-5.png" className="img-component" />
					<img src="/images/fourier/components-6-6.png" className="img-component" />
					<img src="/images/fourier/components-6-7.png" className="img-component" />
					<img src="/images/fourier/components-7-0.png" className="img-component" />
					<img src="/images/fourier/components-7-1.png" className="img-component" />
					<img src="/images/fourier/components-7-2.png" className="img-component" />
					<img src="/images/fourier/components-7-3.png" className="img-component" />
					<img src="/images/fourier/components-7-4.png" className="img-component" />
					<img src="/images/fourier/components-7-5.png" className="img-component" />
					<img src="/images/fourier/components-7-6.png" className="img-component" />
					<img src="/images/fourier/components-7-7.png" className="img-component" />
				</div>
				<p>
					If we take the images, adjust their contrast to the right amount, and then add them up we
					can create any image.
				</p>
				<p>
					Let's start with this letter 'A'. It's pretty small, but we need it to be small otherwise
					we'll end up with too many other images.
				</p>
				<p>
					<img src="/images/fourier/a.png" className="sketch sketch-letter" />
				</p>
				<p>
					As we add more and more of these images, we end up with something that becomes closer and
					closer to the actual image. But I think you'll see the pattern here, as we get a
					reasonable approximation with just a few of them.
				</p>
				<div className="hidden-preload">
					<img src="/images/fourier/img-buildup-0-0.png" />
					<img src="/images/fourier/img-buildup-0-1.png" />
					<img src="/images/fourier/img-buildup-0-2.png" />
					<img src="/images/fourier/img-buildup-0-3.png" />
					<img src="/images/fourier/img-buildup-0-4.png" />
					<img src="/images/fourier/img-buildup-0-5.png" />
					<img src="/images/fourier/img-buildup-0-6.png" />
					<img src="/images/fourier/img-buildup-0-7.png" />
					<img src="/images/fourier/img-buildup-1-0.png" />
					<img src="/images/fourier/img-buildup-1-1.png" />
					<img src="/images/fourier/img-buildup-1-2.png" />
					<img src="/images/fourier/img-buildup-1-3.png" />
					<img src="/images/fourier/img-buildup-1-4.png" />
					<img src="/images/fourier/img-buildup-1-5.png" />
					<img src="/images/fourier/img-buildup-1-6.png" />
					<img src="/images/fourier/img-buildup-1-7.png" />
					<img src="/images/fourier/img-buildup-2-0.png" />
					<img src="/images/fourier/img-buildup-2-1.png" />
					<img src="/images/fourier/img-buildup-2-2.png" />
					<img src="/images/fourier/img-buildup-2-3.png" />
					<img src="/images/fourier/img-buildup-2-4.png" />
					<img src="/images/fourier/img-buildup-2-5.png" />
					<img src="/images/fourier/img-buildup-2-6.png" />
					<img src="/images/fourier/img-buildup-2-7.png" />
					<img src="/images/fourier/img-buildup-3-0.png" />
					<img src="/images/fourier/img-buildup-3-1.png" />
					<img src="/images/fourier/img-buildup-3-2.png" />
					<img src="/images/fourier/img-buildup-3-3.png" />
					<img src="/images/fourier/img-buildup-3-4.png" />
					<img src="/images/fourier/img-buildup-3-5.png" />
					<img src="/images/fourier/img-buildup-3-6.png" />
					<img src="/images/fourier/img-buildup-3-7.png" />
					<img src="/images/fourier/img-buildup-4-0.png" />
					<img src="/images/fourier/img-buildup-4-1.png" />
					<img src="/images/fourier/img-buildup-4-2.png" />
					<img src="/images/fourier/img-buildup-4-3.png" />
					<img src="/images/fourier/img-buildup-4-4.png" />
					<img src="/images/fourier/img-buildup-4-5.png" />
					<img src="/images/fourier/img-buildup-4-6.png" />
					<img src="/images/fourier/img-buildup-4-7.png" />
					<img src="/images/fourier/img-buildup-5-0.png" />
					<img src="/images/fourier/img-buildup-5-1.png" />
					<img src="/images/fourier/img-buildup-5-2.png" />
					<img src="/images/fourier/img-buildup-5-3.png" />
					<img src="/images/fourier/img-buildup-5-4.png" />
					<img src="/images/fourier/img-buildup-5-5.png" />
					<img src="/images/fourier/img-buildup-5-6.png" />
					<img src="/images/fourier/img-buildup-5-7.png" />
					<img src="/images/fourier/img-buildup-6-0.png" />
					<img src="/images/fourier/img-buildup-6-1.png" />
					<img src="/images/fourier/img-buildup-6-2.png" />
					<img src="/images/fourier/img-buildup-6-3.png" />
					<img src="/images/fourier/img-buildup-6-4.png" />
					<img src="/images/fourier/img-buildup-6-5.png" />
					<img src="/images/fourier/img-buildup-6-6.png" />
					<img src="/images/fourier/img-buildup-6-7.png" />
					<img src="/images/fourier/img-buildup-7-0.png" />
					<img src="/images/fourier/img-buildup-7-1.png" />
					<img src="/images/fourier/img-buildup-7-2.png" />
					<img src="/images/fourier/img-buildup-7-3.png" />
					<img src="/images/fourier/img-buildup-7-4.png" />
					<img src="/images/fourier/img-buildup-7-5.png" />
					<img src="/images/fourier/img-buildup-7-6.png" />
					<img src="/images/fourier/img-buildup-7-7.png" />
				</div>
				<div id="letter-buildup" className="multi-container">
					<img
						id="letter-buildup-letter"
						src="/images/fourier/img-buildup-0-0.png"
						className="sketch sketch-letter"
					/>
					<div id="letter-buildup-components" className="img-component-container">
						<img src="/images/fourier/img-components-0-0.png" className="img-component" />
						<img src="/images/fourier/img-components-0-1.png" className="img-component" />
						<img src="/images/fourier/img-components-0-2.png" className="img-component" />
						<img src="/images/fourier/img-components-0-3.png" className="img-component" />
						<img src="/images/fourier/img-components-0-4.png" className="img-component" />
						<img src="/images/fourier/img-components-0-5.png" className="img-component" />
						<img src="/images/fourier/img-components-0-6.png" className="img-component" />
						<img src="/images/fourier/img-components-0-7.png" className="img-component" />
						<img src="/images/fourier/img-components-1-0.png" className="img-component" />
						<img src="/images/fourier/img-components-1-1.png" className="img-component" />
						<img src="/images/fourier/img-components-1-2.png" className="img-component" />
						<img src="/images/fourier/img-components-1-3.png" className="img-component" />
						<img src="/images/fourier/img-components-1-4.png" className="img-component" />
						<img src="/images/fourier/img-components-1-5.png" className="img-component" />
						<img src="/images/fourier/img-components-1-6.png" className="img-component" />
						<img src="/images/fourier/img-components-1-7.png" className="img-component" />
						<img src="/images/fourier/img-components-2-0.png" className="img-component" />
						<img src="/images/fourier/img-components-2-1.png" className="img-component" />
						<img src="/images/fourier/img-components-2-2.png" className="img-component" />
						<img src="/images/fourier/img-components-2-3.png" className="img-component" />
						<img src="/images/fourier/img-components-2-4.png" className="img-component" />
						<img src="/images/fourier/img-components-2-5.png" className="img-component" />
						<img src="/images/fourier/img-components-2-6.png" className="img-component" />
						<img src="/images/fourier/img-components-2-7.png" className="img-component" />
						<img src="/images/fourier/img-components-3-0.png" className="img-component" />
						<img src="/images/fourier/img-components-3-1.png" className="img-component" />
						<img src="/images/fourier/img-components-3-2.png" className="img-component" />
						<img src="/images/fourier/img-components-3-3.png" className="img-component" />
						<img src="/images/fourier/img-components-3-4.png" className="img-component" />
						<img src="/images/fourier/img-components-3-5.png" className="img-component" />
						<img src="/images/fourier/img-components-3-6.png" className="img-component" />
						<img src="/images/fourier/img-components-3-7.png" className="img-component" />
						<img src="/images/fourier/img-components-4-0.png" className="img-component" />
						<img src="/images/fourier/img-components-4-1.png" className="img-component" />
						<img src="/images/fourier/img-components-4-2.png" className="img-component" />
						<img src="/images/fourier/img-components-4-3.png" className="img-component" />
						<img src="/images/fourier/img-components-4-4.png" className="img-component" />
						<img src="/images/fourier/img-components-4-5.png" className="img-component" />
						<img src="/images/fourier/img-components-4-6.png" className="img-component" />
						<img src="/images/fourier/img-components-4-7.png" className="img-component" />
						<img src="/images/fourier/img-components-5-0.png" className="img-component" />
						<img src="/images/fourier/img-components-5-1.png" className="img-component" />
						<img src="/images/fourier/img-components-5-2.png" className="img-component" />
						<img src="/images/fourier/img-components-5-3.png" className="img-component" />
						<img src="/images/fourier/img-components-5-4.png" className="img-component" />
						<img src="/images/fourier/img-components-5-5.png" className="img-component" />
						<img src="/images/fourier/img-components-5-6.png" className="img-component" />
						<img src="/images/fourier/img-components-5-7.png" className="img-component" />
						<img src="/images/fourier/img-components-6-0.png" className="img-component" />
						<img src="/images/fourier/img-components-6-1.png" className="img-component" />
						<img src="/images/fourier/img-components-6-2.png" className="img-component" />
						<img src="/images/fourier/img-components-6-3.png" className="img-component" />
						<img src="/images/fourier/img-components-6-4.png" className="img-component" />
						<img src="/images/fourier/img-components-6-5.png" className="img-component" />
						<img src="/images/fourier/img-components-6-6.png" className="img-component" />
						<img src="/images/fourier/img-components-6-7.png" className="img-component" />
						<img src="/images/fourier/img-components-7-0.png" className="img-component" />
						<img src="/images/fourier/img-components-7-1.png" className="img-component" />
						<img src="/images/fourier/img-components-7-2.png" className="img-component" />
						<img src="/images/fourier/img-components-7-3.png" className="img-component" />
						<img src="/images/fourier/img-components-7-4.png" className="img-component" />
						<img src="/images/fourier/img-components-7-5.png" className="img-component" />
						<img src="/images/fourier/img-components-7-6.png" className="img-component" />
						<img src="/images/fourier/img-components-7-7.png" className="img-component" />
					</div>
				</div>
				<p>For actual JPEG images there are just a few extra details.</p>
				<p>
					The image gets broken up into 8x8 chunks, and each chunk gets split up separately. We use
					a set of frequencies to determine how light or dark each pixel is, and then another two
					sets for the color, one for red-green, and another for blue-yellow. The number of
					frequencies that we use for each chunk determines the quality of the JPEG.
				</p>
				<p>
					Here's a real JPEG image, zoomed in so we can see the details. When we play with the
					quality levels we can see this process happen.
				</p>
				<div id="jpeg-example" className="sketch">
					<img src="/images/fourier/cat.png" className="sketch-child clear-pixels" />
				</div>
			</div>
			<Link to="/">Go back to the homepage</Link>
		</Layout>
	);
};

export default Fourier;

function loadCanvasControllers(controllers) {
	const comboWave = getWave(
		(t) => Math.sin(2 * Math.PI * t) + 0.5 * Math.sin(6 * Math.PI * t),
		128
	);
	if (hasElement('combo-sine-wave')) {
		let controller = new WaveController('combo-sine-wave');
		// Here we stretch out the wave to make it look nicer. Kind of lazy but w/e.
		controller.setPath(comboWave.map((t) => 2 * t));
		controllers.push(controller);
	}
	if (hasElement('combo-sine-wave-split')) {
		let controller = new WaveSplitController('combo-sine-wave-split');
		controller.setPath(comboWave);
		controller.fadeFrequencies = false;
		controllers.push(controller);
	}

	// SQUARE WAVE
	if (hasElement('square-wave')) {
		let controller = new WaveController('square-wave');
		controller.setPath(getWave(squareWave, 128));
		controllers.push(controller);
	}
	let squareWaveSplitController;
	if (hasElement('square-wave-split')) {
		squareWaveSplitController = new WaveSplitController('square-wave-split');
		squareWaveSplitController.setPath(getWave(squareWave, 256));
		controllers.push(squareWaveSplitController);
	}

	let squareWaveBuildUpController;
	if (hasElement('square-wave-build-up')) {
		squareWaveBuildUpController = new WaveSplitController('square-wave-build-up');
		squareWaveBuildUpController.setPath(getWave(squareWave, 128));
		squareWaveBuildUpController.splitAnim = false;
		controllers.push(squareWaveBuildUpController);
	}
	if (hasElement('square-wave-build-up-slider')) {
		const slider = new RangeController('square-wave-build-up-slider');
		if (squareWaveBuildUpController) {
			slider.onValueChange.push((val) => (squareWaveBuildUpController.fourierAmt = val));
		}
		controllers.push(slider);
	}

	// DRAW WAVE
	let waveDrawController, waveDrawSliderController, waveDrawButton, waveDrawSplitController;
	if (hasElement('wave-draw')) {
		waveDrawController = new WaveDrawController('wave-draw');
		controllers.push(waveDrawController);
	}
	if (hasElement('wave-draw-instruction')) {
		const instruction = document.getElementById('wave-draw-instruction');
		if (waveDrawController) {
			waveDrawController.onDrawingStart.push(() => instruction.classList.add('hidden'));
		}
	}
	if (hasElement('wave-draw-slider')) {
		waveDrawSliderController = new RangeController('wave-draw-slider');
		waveDrawSliderController.animate = false;
		controllers.push(waveDrawSliderController);
	}
	if (hasElement('wave-draw-split')) {
		waveDrawSplitController = new WaveSplitController('wave-draw-split');
		if (waveDrawController != null) {
			waveDrawController.onDrawingStart.push(() => {
				waveDrawSplitController.splitAnim = true;
				waveDrawSplitController.setPath([]);
			});
			waveDrawController.onDrawingEnd.push(() => {
				waveDrawSplitController.splitAnim = true;
				waveDrawSplitController.setPath(waveDrawController.normPath);
			});
			// Reset the slider back to 1 when the wave changes to draw the full wave.
			if (waveDrawSliderController) {
				waveDrawController.onDrawingStart.push(() => (waveDrawSliderController.slider.value = 1));
				waveDrawController.onDrawingEnd.push(() => (waveDrawSliderController.slider.value = 1));
			}
		}
		if (waveDrawSliderController != null) {
			waveDrawSliderController.onValueChange.push((val) => {
				waveDrawSplitController.fourierAmt = val;
				waveDrawSplitController.splitAnim = false;
			});
		}
		controllers.push(waveDrawSplitController);
	}
	if (hasElement('wave-draw-button')) {
		const button = document.getElementById('wave-draw-button');
		if (button) {
			button.addEventListener('click', () => playSoundWave(waveDrawSplitController.partialWave));
		}
	}

	if (hasElement('wave-samples')) {
		const waveSamplesController = new WaveSamplesController('wave-samples');
		// Initially set it to the square wave
		waveSamplesController.setWave(getWave(squareWave, 256));
		if (waveDrawController) {
			waveDrawController.onDrawingEnd.push(() => {
				// Map from [0, 1] to [-1, 1]
				waveSamplesController.setWave(waveDrawController.normPath);
			});
		}
		controllers.push(waveSamplesController);
	}
	if (hasElement('wave-frequencies')) {
		const waveFrequenciesController = new WaveFrequenciesController('wave-frequencies');
		// Intially use the frequencies from the square wave
		if (squareWaveSplitController) {
			waveFrequenciesController.setFourierData(squareWaveSplitController.fourierData);
		}
		if (waveDrawSplitController) {
			waveDrawSplitController.onFourierChange.push(() => {
				// Map from [0, 1] to [-1, 1]
				waveFrequenciesController.setFourierData(waveDrawSplitController.fourierData);
			});
		}
		controllers.push(waveFrequenciesController);
	}

	//  EPICYCLES

	if (hasElement('complex-sinusoid')) {
		let controller = new SkewedSinusoidController('complex-sinusoid');
		controllers.push(controller);
	}
	if (hasElement('complex-sinusoid-turn')) {
		let controller = new ComplexSinusoidController('complex-sinusoid-turn');
		controllers.push(controller);
	}

	const adjustedPeaceHandPoints = peaceHandPoints.map((p) => {
		return { x: p.x * 1.5 - 170, y: p.y * 1.5 - 50 };
	});
	if (hasElement('peace-epicycles')) {
		let controller = new EpicyclesController('peace-epicycles');
		controller.setPath(adjustedPeaceHandPoints, -1, 0.05);
		controllers.push(controller);
	}
	if (hasElement('peace-3d')) {
		let controller = new SkewedPathController('peace-3d');
		controller.setPath(adjustedPeaceHandPoints, -1, 0.05);
		controllers.push(controller);
	}
	let peaceBuildUpSlider;
	if (hasElement('peace-build-up-slider')) {
		peaceBuildUpSlider = new RangeController('peace-build-up-slider');
		controllers.push(peaceBuildUpSlider);
	}
	if (hasElement('peace-build-up')) {
		let controller = new EpicyclesController('peace-build-up');
		controller.setPath(adjustedPeaceHandPoints, -1, 0.05);
		if (peaceBuildUpSlider) {
			peaceBuildUpSlider.onValueChange.push((val) => controller.setFourierAmt(val));
		}
		controllers.push(controller);
	}

	let drawZone, circleZoneSlider;
	if (hasElement('draw-zone')) {
		drawZone = new DrawController('draw-zone');
		controllers.push(drawZone);
	}
	if (hasElement('draw-zone-instruction')) {
		const instruction = document.getElementById('draw-zone-instruction');
		if (drawZone) {
			drawZone.onDrawingStart.push(() => instruction.classList.add('hidden'));
		}
	}
	if (hasElement('draw-zone-undo-button')) {
		const undoButton = document.getElementById('draw-zone-undo-button');
		if (drawZone) {
			undoButton.addEventListener('click', () => drawZone.undo());
		}
	}
	if (hasElement('circle-zone-slider')) {
		circleZoneSlider = new RangeController('circle-zone-slider');
		circleZoneSlider.animate = false;
		controllers.push(circleZoneSlider);
	}
	if (hasElement('circle-zone')) {
		let epicycles = new EpicyclesController('circle-zone');
		epicycles.animatePathAmt = false;
		if (drawZone) {
			drawZone.onDrawingStart.push(() => epicycles.setPath([]));
			drawZone.onDrawingEnd.push(() => epicycles.setPath(drawZone.path, 1024));
			// Reset the slider back to 1 to draw the full shape when it changes.
			if (circleZoneSlider) {
				drawZone.onDrawingStart.push(() => {
					circleZoneSlider.slider.value = 1;
					epicycles.setFourierAmt(1);
				});
			}
		}
		if (circleZoneSlider) {
			circleZoneSlider.onValueChange.push((val) => epicycles.setFourierAmt(val));
		}
		controllers.push(epicycles);
	}

	if (hasElement('fourier-title')) {
		let fourierTitle = new EpicyclesController('fourier-title');
		fourierTitle.setPath(
			titlePoints.map((p) => {
				return {
					x: p.x * 0.9,
					y: p.y * 0.9 - 40,
				};
			})
		);
		fourierTitle.period = 15;
		controllers.push(fourierTitle);
	}

	//JPEGS

	if (hasElement('img-x-component')) {
		let controller = new ImageSwapController('img-x-component');
		const imageSrcs = [];
		for (let i = 1; i < 8; i++) {
			imageSrcs.push('/images/fourier/components-0-' + i + '.png');
		}
		controller.imageSrcs = imageSrcs;
		controllers.push(controller);
	}
	if (hasElement('img-y-component')) {
		let controller = new ImageSwapController('img-y-component');
		const imageSrcs = [];
		for (let i = 1; i < 8; i++) {
			imageSrcs.push('/images/fourier/components-' + i + '-0.png');
		}
		controller.imageSrcs = imageSrcs;
		controllers.push(controller);
	}

	let imgMultXController, imgMultYController;
	if (hasElement('img-mult-x-component')) {
		imgMultXController = new ImageSwapController('img-mult-x-component');
		const imageSrcs = [];
		for (let i = 1; i < 8; i++) {
			imageSrcs.push('/images/fourier/components-0-' + i + '.png');
		}
		imgMultXController.imageSrcs = imageSrcs;
		imgMultXController.maxY = 0.5;
		controllers.push(imgMultXController);
	}
	if (hasElement('img-mult-y-component')) {
		imgMultYController = new ImageSwapController('img-mult-y-component');
		const imageSrcs = [];
		for (let i = 1; i < 8; i++) {
			imageSrcs.push('/images/fourier/components-' + i + '-0.png');
		}
		imgMultYController.imageSrcs = imageSrcs;
		imgMultYController.minY = 0.5;
		controllers.push(imgMultYController);
	}
	if (hasElement('img-x-y-component')) {
		let controller = new ImageMultController(
			'img-x-y-component',
			imgMultXController,
			imgMultYController
		);
		controllers.push(controller);
	}

	let letterBuildUpController;
	if (hasElement('letter-buildup-letter')) {
		letterBuildUpController = new ImageSwapController('letter-buildup-letter');
		const imageSrcs = [];
		for (let [y, x] of loopLikeAJpeg(8)) {
			imageSrcs.push('/images/fourier/img-buildup-' + x + '-' + y + '.png');
		}
		letterBuildUpController.imageSrcs = imageSrcs;
		letterBuildUpController.scrollFocus = document.querySelector('#letter-buildup');
		letterBuildUpController.minY = 0.2;
		letterBuildUpController.maxY = 0.6;
		controllers.push(letterBuildUpController);
	}
	if (hasElement('letter-buildup-components')) {
		let controller = new ImageBuildUpController(
			'letter-buildup-components',
			letterBuildUpController
		);
		controllers.push(controller);
	}
	if (hasElement('jpeg-example')) {
		let controller = new JpegCompressorController('jpeg-example');
		controllers.push(controller);
	}

	return controllers;
}

function hasElement(id) {
	return document.getElementById(id) != null;
}
