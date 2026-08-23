import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import tokens from '../../design-tokens/src/tokens.json';

interface TokenValueMap {
	[key: string]: string | TokenValueMap;
}

type ColorTokenGroup = TokenValueMap;

const colorGroups = tokens.color as Record<string, ColorTokenGroup>;

const flattenTokens = (group: ColorTokenGroup, prefix = ''): Array<{ name: string; value: string }> =>
	Object.entries(group).flatMap(([key, value]) => {
		const name = prefix ? `${prefix}-${key}` : key;
		return typeof value === 'string' ? [{ name, value }] : flattenTokens(value, name);
	});

const renderTokenGroup = (groupName: string, group: ColorTokenGroup) => {
	const rows = flattenTokens(group)
		.map(
			({ name, value }) => html`
				<div class="token-row">
					<div class="token-details">
						<strong>${name}</strong>
						<code>${value}</code>
					</div>
					<div class="token-swatch" style="background-color: ${value}" role="img" aria-label="${name}: ${value}"></div>
				</div>
			`
		)
		.filter(Boolean);

	return html`
		<section class="token-group">
			<h2>${groupName}</h2>
			<div class="token-list">${rows}</div>
		</section>
	`;
};

const renderColorTokens = () => html`
	<style>
		:host {
			color: #111632;
			font-family: 'Sora', 'Segoe UI', sans-serif;
		}

		.color-token-page {
			max-width: 960px;
			margin: 0 auto;
		}

		.intro {
			margin: 0 0 2rem;
			color: #535a7a;
		}

		.token-group {
			margin: 0 0 2rem;
		}

		h2 {
			margin: 0 0 0.75rem;
			font-size: 1rem;
			font-weight: 700;
			letter-spacing: 0;
		}

		.token-list {
			border: 1px solid #c2c5df;
			border-radius: 0.5rem;
			overflow: hidden;
			background: #f8f9ff;
		}

		.token-row {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 9rem;
			min-height: 4.5rem;
			border-bottom: 1px solid #e8e9f6;
		}

		.token-row:last-child {
			border-bottom: 0;
		}

		.token-details {
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 0.25rem;
			padding: 0.75rem 1rem;
			min-width: 0;
		}

		.token-details strong {
			overflow-wrap: anywhere;
			font-size: 0.875rem;
			font-weight: 600;
		}

		.token-details code {
			color: #535a7a;
			font-size: 0.8125rem;
		}

		.token-swatch {
			min-height: 4.5rem;
			border-left: 1px solid #e8e9f6;
		}

		@media (max-width: 520px) {
			.token-row {
				grid-template-columns: minmax(0, 1fr) 5.5rem;
			}
		}
	</style>
	<div class="color-token-page">
		<p class="intro">Color tokens with their source values and visual swatches.</p>
		${Object.entries(colorGroups).map(([groupName, group]) => renderTokenGroup(groupName, group))}
	</div>
`;

const meta: Meta = {
	title: 'Design Tokens/Color Tokens',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	}
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
	render: renderColorTokens
};
