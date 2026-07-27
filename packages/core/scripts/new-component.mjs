import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const nameArgIndex = process.argv.findIndex((arg) => arg === '--name');
const rawName = nameArgIndex >= 0 ? process.argv[nameArgIndex + 1] : undefined;

if (!rawName) {
  console.error('Usage: npm run component:new -- --name <component-name>');
  process.exit(1);
}

const name = rawName.trim().toLowerCase();
if (!/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error('Component name must match: ^[a-z][a-z0-9-]*$');
  process.exit(1);
}

const className = `Dv${name
  .split('-')
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join('')}`;

const dir = join(process.cwd(), 'src', 'components', name);
if (existsSync(dir)) {
  console.error(`Component directory already exists: ${dir}`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });

writeFileSync(
  join(dir, `${name}.tsx`),
  `import { Component, h, Host, Prop } from '@stencil/core';\n\n@Component({\n  tag: 'dv-${name}',\n  styleUrl: '${name}.scss',\n  shadow: true\n})\nexport class ${className} {\n  @Prop({ reflect: true })\n  label = '${className}';\n\n  render() {\n    return (\n      <Host>\n        <slot>{this.label}</slot>\n      </Host>\n    );\n  }\n}\n`
);

writeFileSync(
  join(dir, `${name}.scss`),
  `:host {\n  display: block;\n}\n`
);

writeFileSync(
  join(dir, `${name}.spec.tsx`),
  `import { newSpecPage } from '@stencil/core/testing';\nimport { ${className} } from './${name}';\n\ndescribe('dv-${name}', () => {\n  it('renders', async () => {\n    const page = await newSpecPage({\n      components: [${className}],\n      html: '<dv-${name}></dv-${name}>'\n    });\n\n    expect(page.root).toBeTruthy();\n  });\n});\n`
);

writeFileSync(
  join(dir, `${name}.stories.ts`),
  `import type { Meta, StoryObj } from '@storybook/web-components-vite';\n\ntype ${className}Args = {\n  label: string;\n};\n\nconst meta: Meta<${className}Args> = {\n  title: 'Components/${className.replace('Dv', '')}',\n  tags: ['autodocs'],\n  argTypes: {\n    label: { control: 'text' }\n  },\n  args: {\n    label: '${className}'\n  },\n  render: ({ label }) => \`<dv-${name} label=\"\${label}\"></dv-${name}>\`\n};\n\nexport default meta;\n\ntype Story = StoryObj<${className}Args>;\n\nexport const Default: Story = {\n  args: {}\n};\n`
);

console.log(`Created component scaffold at src/components/${name}`);
