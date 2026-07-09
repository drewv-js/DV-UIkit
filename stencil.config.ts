import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'dvuikit',
  srcDir: 'src',
  globalStyle: 'dist/styles.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: 'loader'
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'single-export-module',
      generateTypeDeclarations: true
    }
  ],
  testing: {
    browserHeadless: 'shell'
  }
};
