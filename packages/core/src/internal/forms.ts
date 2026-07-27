function getFormSubmitter(form: HTMLFormElement): Element | undefined {
	const internalNativeSelector = 'button:not([type]), button[type="submit"], input[type="submit"]';
	const internalSelector = '[type="submit"], dv-button:not([type="button"]):not([type="reset"])';

	const internalSubmitter = form.querySelector(internalNativeSelector) ?? form.querySelector(internalSelector);

	if (internalSubmitter) return internalSubmitter;

	if (form.id) {
		const externalNativeSelector = `button:not([type])[form="${form.id}"], button[type="submit"][form="${form.id}"], input[type="submit"][form="${form.id}"]`;
		const externalSelector = `dv-button[form="${form.id}"]:not([type="button"]):not([type="reset"])`;

		const externalSubmitter =
			document.querySelector(externalNativeSelector) ?? document.querySelector(externalSelector);

		if (externalSubmitter) return externalSubmitter;
	}

	return undefined;
}

export function submitOwningForm(element: HTMLElement, internals: ElementInternals) {
	const form = internals?.form ?? element.closest('form');

	if (!form) return;

	const submitter = getFormSubmitter(form);

	// Mirrors native behavior: if the default submit button is disabled, Enter does not submit.
	// Checks IDL property (native elements) and attribute (custom elements e.g. dv-button).
	if ((submitter as HTMLButtonElement)?.disabled || submitter?.hasAttribute('disabled')) return;

	const nativeSubmitter =
		submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement ? submitter : undefined;
	form.requestSubmit(nativeSubmitter);
}

