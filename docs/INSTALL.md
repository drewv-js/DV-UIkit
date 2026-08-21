# Install And Use

## Who this is for

Projects owned by the DV UIkit GitHub account that need to consume the private `@dv-uikit/web-components` package from npmjs.

## 1. Configure private npm access

Create a project-level `.npmrc` file:

```ini
@dv-uikit:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
always-auth=true
```

Set `NPM_TOKEN` in your shell, local secret manager, or GitHub Actions secrets. Never commit the token value.

## 2. Install

```bash
npm install @dv-uikit/web-components
```

For a reproducible build, install an exact version:

```bash
npm install @dv-uikit/web-components@0.1.0
```

## 3. Use in plain JS/TS

```ts
import '@dv-uikit/web-components/auto-register';
import '@dv-uikit/web-components/styles.css';

const button = document.createElement('dv-button');
button.setAttribute('variant', 'primary');
button.textContent = 'Save changes';
document.body.appendChild(button);
```

## 4. Use in React

```tsx
import '@dv-uikit/web-components/auto-register';
import '@dv-uikit/web-components/styles.css';
import { DvButtonReact, DvCardReact } from '@dv-uikit/web-components/react';

export function App() {
	return (
		<DvCardReact heading="Profile">
			<p>Update your settings.</p>
			<DvButtonReact variant="primary">Save</DvButtonReact>
		</DvCardReact>
	);
}
```

## 5. Tailwind token reuse (optional)

In consumer Tailwind config, load the preset:

```js
module.exports = {
	presets: [require('@dv-uikit/web-components/tailwind-preset')]
};
```

Most consumers only need to import `styles.css`. Use the Tailwind preset when the application needs the design-token names in its own Tailwind classes.

## 6. Supported consumer entrypoints

- `@dv-uikit/web-components`
- `@dv-uikit/web-components/auto-register`
- `@dv-uikit/web-components/react`
- `@dv-uikit/web-components/styles.css`
- `@dv-uikit/web-components/tailwind-preset`

## 7. Troubleshooting

- `401` or `403` on install:
  - Ensure `NPM_TOKEN` is set in the environment where install runs.
  - Ensure the token has read access for private packages.
  - Ensure the consumer repo has the `.npmrc` scope mapping shown above.
- Components render as plain tags:
  - Ensure `@dv-uikit/web-components/auto-register` is imported once at app startup.
- Styles are missing:
  - Ensure `@dv-uikit/web-components/styles.css` is imported in the app entry.

## Private package notes

- The package is hosted on npmjs with restricted access.
- `NPM_TOKEN` needs read access to install the package.
- `NPM_PUBLISH_TOKEN` is used only by the repository's publish workflow.
- The package is not currently intended for public npm use.
