type StoryArgTypes<TArgs> = Partial<Record<Extract<keyof TArgs, string>, Record<string, unknown>>> &
	Record<string, Record<string, unknown>>;

export type ComponentSnippets<TArgs> = {
	react: (args: TArgs) => string;
	vue: (args: TArgs) => string;
};

export type StoryHelperOptions = {
	excludeCategories?: string[];
};

export function getStoryHelpers<TArgs>(
	_componentTag: string,
	_options: StoryHelperOptions = {}
): { argTypes: StoryArgTypes<TArgs> } {
	void _options;

	return {
		argTypes: {} as StoryArgTypes<TArgs>
	};
}

export function buildMultiFrameworkSource(reactSnippet: string, vueSnippet: string): string {
	return [
		'// React',
		'```tsx',
		reactSnippet.trim(),
		'```',
		'',
		'// Vue',
		'```vue',
		vueSnippet.trim(),
		'```'
	].join('\n');
}