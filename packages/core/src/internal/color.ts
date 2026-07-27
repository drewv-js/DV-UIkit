interface ColorVariants {
  bg: string;
  'bg-knockout': string;
  text: string;
  'text-knockout': string;
  border: string;
}

type ColorGroups = Record<string, ColorVariants>;
type ColorGroup = 'status';

const statusColorMap: ColorGroups = {
  success: {
    bg: 'bg-status-success',
    'bg-knockout': 'bg-status-success-knockout',
    text: 'text-status-success',
    'text-knockout': 'text-status-success-knockout',
    border: 'border-status-success'
  },
  info: {
    bg: 'bg-status-info',
    'bg-knockout': 'bg-status-info-knockout',
    text: 'text-status-info',
    'text-knockout': 'text-status-info-knockout',
    border: 'border-status-info'
  },
  warning: {
    bg: 'bg-status-warning',
    'bg-knockout': 'bg-status-warning-knockout',
    text: 'text-status-warning',
    'text-knockout': 'text-status-warning-knockout',
    border: 'border-status-warning'
  },
  error: {
    bg: 'bg-status-error',
    'bg-knockout': 'bg-status-error-knockout',
    text: 'text-status-error',
    'text-knockout': 'text-status-error-knockout',
    border: 'border-status-error'
  },
  neutral: {
    bg: 'bg-status-neutral',
    'bg-knockout': 'bg-status-neutral-knockout',
    text: 'text-status-neutral',
    'text-knockout': 'text-status-neutral-knockout',
    border: 'border-status-neutral'
  }
};

export function getColorGroups(groups: ColorGroup[]): ColorGroups {
  const output: ColorGroups = {};

  for (const group of groups) {
    if (group === 'status') {
      Object.assign(output, statusColorMap);
      continue;
    }

    console.warn(`[color.ts] Unknown color group: "${group}"`);
  }

  return output;
}
