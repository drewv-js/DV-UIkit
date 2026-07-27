# Install and Use

## Who this is for

Any external project (personal or team) that needs to consume the private `@dv-uikit/web-components` package from npmjs.

## 1. Add npm auth in each consumer repo

Create a project-level `.npmrc` file:

```ini
@dv-uikit:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
always-auth=true
```

Set `NPM_TOKEN` in your shell or local secret manager.

## 2. Install

```bash
npm install @dv-uikit/web-components
```

If you publish and consume lockstep versions internally, pin an exact version:

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
