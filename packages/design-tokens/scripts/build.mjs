import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const srcPath = join(root, 'src', 'tokens.json');
const buildCssPath = join(root, 'build', 'css', 'dv-tokens.css');
const buildJsonPath = join(root, 'build', 'json', 'tokens.json');
const buildTailwindPath = join(root, 'build', 'tailwind', 'dv-tailwind-tokens.cjs');

const raw = readFileSync(srcPath, 'utf8');
const tokens = JSON.parse(raw);

const toCompatibilityColor = (theme, status) => ({
	...theme,
	surface: theme.background.subtle,
	surfaceStrong: theme.background.default,
	border: theme.border.default,
	text: theme.content.default,
	textMuted: theme.content.subtle,
	brand: theme.brand.primary,
	brandStrong: theme.brand['primary-hover'],
	action: theme.brand.action,
	actionHover: theme.brand['action-hover'],
	actionActive: theme.brand['action-active'],
	accent: theme.brand.accent,
	accentHover: theme.brand['accent-hover'],
	danger: status.error,
	statusSuccess: status.success,
	statusWarning: status.warning,
	statusInfo: status.info,
	statusNeutral: status.neutral
});

const sourceColor = tokens.color;
const generatedColor = toCompatibilityColor(sourceColor, sourceColor.status);
generatedColor.dark = toCompatibilityColor(sourceColor.dark, sourceColor.status);
tokens.color = generatedColor;

const css = `:root {\n  --dv-font-sans: ${tokens.font.sans};\n  --dv-color-surface: ${tokens.color.surface};\n  --dv-color-surface-strong: ${tokens.color.surfaceStrong};\n  --dv-color-border: ${tokens.color.border};\n  --dv-color-text: ${tokens.color.text};\n  --dv-color-text-muted: ${tokens.color.textMuted};\n  --dv-color-brand: ${tokens.color.brand};\n  --dv-color-brand-strong: ${tokens.color.brandStrong};\n  --dv-color-danger: ${tokens.color.danger};\n  --dv-radius-sm: ${tokens.radius.sm};\n  --dv-radius-md: ${tokens.radius.md};\n  --dv-radius-lg: ${tokens.radius.lg};\n  --dv-radius-xl: ${tokens.radius.xl};\n  --dv-space-1: ${tokens.space['1']};\n  --dv-space-2: ${tokens.space['2']};\n  --dv-space-3: ${tokens.space['3']};\n  --dv-space-4: ${tokens.space['4']};\n  --dv-space-6: ${tokens.space['6']};\n  --dv-space-8: ${tokens.space['8']};\n  --dv-shadow-soft: ${tokens.shadow.soft};\n}\n`;

const tailwindModule = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: '${tokens.color.brand}',\n        'brand-strong': '${tokens.color.brandStrong}',\n        surface: '${tokens.color.surface}',\n        'surface-strong': '${tokens.color.surfaceStrong}',\n        border: '${tokens.color.border}',\n        text: '${tokens.color.text}',\n        'text-muted': '${tokens.color.textMuted}',\n        danger: '${tokens.color.danger}'\n      },\n      borderRadius: {\n        sm: '${tokens.radius.sm}',\n        md: '${tokens.radius.md}',\n        lg: '${tokens.radius.lg}',\n        xl: '${tokens.radius.xl}'\n      },\n      spacing: {\n        1: '${tokens.space['1']}',\n        2: '${tokens.space['2']}',\n        3: '${tokens.space['3']}',\n        4: '${tokens.space['4']}',\n        6: '${tokens.space['6']}',\n        8: '${tokens.space['8']}'\n      },\n      boxShadow: {\n        soft: '${tokens.shadow.soft}'\n      }\n    }\n  }\n};\n`;

const themeCss = `
:root {
  --dv-color-action: ${tokens.color.action};
  --dv-color-action-hover: ${tokens.color.actionHover};
  --dv-color-action-active: ${tokens.color.actionActive};
  --dv-color-accent: ${tokens.color.accent};
  --dv-color-accent-hover: ${tokens.color.accentHover};
  --dv-color-status-success: ${tokens.color.statusSuccess};
  --dv-color-status-warning: ${tokens.color.statusWarning};
  --dv-color-status-info: ${tokens.color.statusInfo};
  --dv-color-status-neutral: ${tokens.color.statusNeutral};
}

[data-theme="dark"] {
  --dv-color-surface: ${tokens.color.dark.surface};
  --dv-color-surface-strong: ${tokens.color.dark.surfaceStrong};
  --dv-color-border: ${tokens.color.dark.border};
  --dv-color-text: ${tokens.color.dark.text};
  --dv-color-text-muted: ${tokens.color.dark.textMuted};
  --dv-color-brand: ${tokens.color.dark.brand};
  --dv-color-brand-strong: ${tokens.color.dark.brandStrong};
  --dv-color-action: ${tokens.color.dark.action};
  --dv-color-action-hover: ${tokens.color.dark.actionHover};
  --dv-color-action-active: ${tokens.color.dark.actionActive};
  --dv-color-accent: ${tokens.color.dark.accent};
  --dv-color-accent-hover: ${tokens.color.dark.accentHover};
  --dv-color-status-success: ${tokens.color.dark.statusSuccess};
  --dv-color-status-warning: ${tokens.color.dark.statusWarning};
  --dv-color-status-info: ${tokens.color.dark.statusInfo};
  --dv-color-status-neutral: ${tokens.color.dark.statusNeutral};
}
`;
const fullCss = css + themeCss;
const themeTailwindModule = `module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '${tokens.color.brand}',
        'brand-strong': '${tokens.color.brandStrong}',
        action: '${tokens.color.action}',
        'action-hover': '${tokens.color.actionHover}',
        'action-active': '${tokens.color.actionActive}',
        accent: '${tokens.color.accent}',
        'accent-hover': '${tokens.color.accentHover}',
        surface: '${tokens.color.surface}',
        'surface-strong': '${tokens.color.surfaceStrong}',
        border: '${tokens.color.border}',
        text: '${tokens.color.text}',
        'text-muted': '${tokens.color.textMuted}',
        danger: '${tokens.color.danger}',
        'status-success': '${tokens.color.statusSuccess}',
        'status-warning': '${tokens.color.statusWarning}',
        'status-info': '${tokens.color.statusInfo}',
        'status-neutral': '${tokens.color.statusNeutral}'
      },
      borderRadius: {
        sm: '${tokens.radius.sm}',
        md: '${tokens.radius.md}',
        lg: '${tokens.radius.lg}',
        xl: '${tokens.radius.xl}'
      },
      spacing: {
        1: '${tokens.space['1']}',
        2: '${tokens.space['2']}',
        3: '${tokens.space['3']}',
        4: '${tokens.space['4']}',
        6: '${tokens.space['6']}',
        8: '${tokens.space['8']}'
      },
      boxShadow: {
        soft: '${tokens.shadow.soft}'
      }
    }
  }
};
`;

for (const path of [buildCssPath, buildJsonPath, buildTailwindPath]) {
	mkdirSync(dirname(path), { recursive: true });
}

writeFileSync(buildCssPath, fullCss);
tokens.color = sourceColor;
writeFileSync(buildJsonPath, JSON.stringify(tokens, null, 2) + '\n');
writeFileSync(buildTailwindPath, themeTailwindModule);

console.log('Built design token artifacts:');
console.log('- build/css/dv-tokens.css');
console.log('- build/json/tokens.json');
console.log('- build/tailwind/dv-tailwind-tokens.cjs');
