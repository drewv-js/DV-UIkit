# React Usage

The first internal release is consumed through `@drewv-js/web-components`. React projects can use the bundled React export after installing that package.

## Usage

```ts
import '@drewv-js/web-components/auto-register';
import '@drewv-js/web-components/styles.css';
import { DvButtonReact, DvCardReact } from '@drewv-js/web-components/react';
```

The standalone `@dv-uikit/react` workspace package is an internal build package for now. It may be published separately later if independent framework package installation becomes useful.
