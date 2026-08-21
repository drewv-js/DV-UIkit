# Install And Use

## Who this is for

Projects owned by the DV UIkit GitHub account that need to consume the private `@drewv-js/web-components` package from GitHub Packages.

## 1. Configure private npm access

Create a project-level `.npmrc` file:

```ini
@drewv-js:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
always-auth=true
```

Set `GITHUB_PACKAGES_TOKEN` in your shell, local secret manager, or GitHub Actions secrets. Never commit the token value.

## 2. Install

```bash
npm install @drewv-js/web-components
```

For a reproducible build, install an exact version:

```bash
npm install @drewv-js/web-components@0.1.0
```

## 3. Use in plain JS/TS

```ts
import '@drewv-js/web-components/auto-register';
import '@drewv-js/web-components/styles.css';

const button = document.createElement('dv-button');
button.setAttribute('variant', 'primary');
button.textContent = 'Save changes';
document.body.appendChild(button);
```

## 4. Use in React

```tsx
import '@drewv-js/web-components/auto-register';
import '@drewv-js/web-components/styles.css';
import { DvButtonReact, DvCardReact } from '@drewv-js/web-components/react';

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
	presets: [require('@drewv-js/web-components/tailwind-preset')]
};
```

Most consumers only need to import `styles.css`. Use the Tailwind preset when the application needs the design-token names in its own Tailwind classes.

## 6. Supported consumer entrypoints

- `@drewv-js/web-components`
- `@drewv-js/web-components/auto-register`
- `@drewv-js/web-components/react`
- `@drewv-js/web-components/styles.css`
- `@drewv-js/web-components/tailwind-preset`

## 7. Troubleshooting

- `401` or `403` on install:
  - Ensure `GITHUB_PACKAGES_TOKEN` is set in the environment where install runs.
  - Ensure the token has read access for private packages.
  - Ensure the consumer repo has the `.npmrc` scope mapping shown above.
- Components render as plain tags:
  - Ensure `@drewv-js/web-components/auto-register` is imported once at app startup.
- Styles are missing:
  - Ensure `@drewv-js/web-components/styles.css` is imported in the app entry.

## Private package notes

- The package is hosted on GitHub Packages with restricted access.
- `GITHUB_PACKAGES_TOKEN` needs `read:packages` access to install the package.
- GitHub Actions uses its built-in `GITHUB_TOKEN` with `packages: write` permission to publish.
- The package is not currently intended for public registry use.
