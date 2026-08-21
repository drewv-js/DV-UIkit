import '@drewv-js/web-components/styles.css';
import { DvUikitVuePlugin } from '@dv-uikit/vue';
import { createApp, h } from 'vue';

const Root = {
	render() {
		return h('main', { style: { padding: '24px', display: 'grid', gap: '16px', maxWidth: '560px' } }, [
			h('h1', 'DV Vue Smoke App'),
			h('p', 'This verifies @dv-uikit/vue registration + compatibility styles.'),
			h('dv-card', { heading: 'Vue Wrapper Check' }, [h('p', 'Custom element rendered via Vue app.')]),
			h('dv-button', { variant: 'primary', label: 'Vue smoke button' })
		]);
	}
};

const app = createApp(Root);
app.use(DvUikitVuePlugin);
app.mount('#app');
