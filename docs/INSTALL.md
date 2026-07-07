# Install and Use

## Who this is for

Personal projects that need to consume the private package from npmjs.

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

## 3. Use in plain JS/TS

```ts
import '@dv-uikit/web-components';
import '@dv-uikit/web-components/styles.css';

const button = document.createElement('dv-button');
button.setAttribute('variant', 'primary');
button.textContent = 'Save changes';
document.body.appendChild(button);
```

## 4. Use in React

```tsx
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
