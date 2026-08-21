import '@drewv-js/web-components/auto-register';
import '@drewv-js/web-components/styles.css';
import { DvButtonReact, DvCardReact } from '@dv-uikit/react';
import React from 'react';
import { createRoot } from 'react-dom/client';

const app = React.createElement(
	'main',
	{ style: { padding: '24px', display: 'grid', gap: '16px', maxWidth: '560px' } },
	React.createElement('h1', null, 'DV React Smoke App'),
	React.createElement(
		DvCardReact,
		{ heading: 'React Wrapper Check' },
		React.createElement('p', null, 'This verifies @dv-uikit/react + compatibility styles.')
	),
	React.createElement(DvButtonReact, { variant: 'primary', label: 'React smoke button' })
);

createRoot(document.getElementById('app')).render(app);
