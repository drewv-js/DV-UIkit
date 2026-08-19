import { fas } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { IconName } from '../icon-name.generated';
import { CURATED_ICON_NAMES } from './icon-catalog';

const toKebabAlias = (camelKey: string) =>
	camelKey
		.replace(/^fa/, '')
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.toLowerCase();

/** Lookup of every free solid icon, keyed by both its canonical name and its FA4-style aliases. */
const iconsByName: Record<string, IconDefinition> = {};
for (const [key, definition] of Object.entries(fas)) {
	if (!definition?.iconName) continue;
	iconsByName[definition.iconName] ??= definition;
	const alias = toKebabAlias(key);
	if (alias) iconsByName[alias] ??= definition;
}

export const getIconDefinition = (name?: string): IconDefinition | undefined =>
	name ? iconsByName[name] : undefined;

/** The curated icon names surfaced in Storybook controls and the "All Icons" gallery. */
export const getAllIconNames = (): IconName[] => [...CURATED_ICON_NAMES].sort() as IconName[];

