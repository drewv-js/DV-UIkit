# React Usage

The first internal release is consumed through `@dv-uikit/web-components`. React projects can use the bundled React export after installing that package.

## Usage

```ts
import '@dv-uikit/web-components/auto-register';
import '@dv-uikit/web-components/styles.css';
import { DvButtonReact, DvCardReact } from '@dv-uikit/web-components/react';
```

The standalone `@dv-uikit/react` workspace package is an internal build package for now. It may be published separately later if independent framework package installation becomes useful.
