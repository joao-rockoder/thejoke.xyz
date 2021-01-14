import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';

const IndexPage = () => (
	<Layout>
		<SEO title="Home" />
		<h1>Hi jonny</h1>
		<p>Now go build something great.</p>
		<div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
			<Image />
		</div>

		<article>
			<h2>Playground lab</h2>
			<Link to="/lab/escape-fractal/">Fractal</Link> <br />
			<Link to="/lab/fourier/">Fourier</Link> <br />
		</article>
	</Layout>
);

export default IndexPage;
