import { submitOwningForm } from './forms';

describe('submitOwningForm', () => {
	let form: HTMLFormElement;
	let element: HTMLElement;
	let internals: ElementInternals;

	beforeEach(() => {
		form = document.createElement('form');
		form.requestSubmit = jest.fn();
		element = document.createElement('div');
		internals = { form } as unknown as ElementInternals;
	});

	it('should submit with internal button[type="submit"] as submitter', () => {
		const button = document.createElement('button');
		button.type = 'submit';
		form.appendChild(button);

		submitOwningForm(element, internals);

		expect(form.requestSubmit).toHaveBeenCalledWith(button);
	});

	it('should submit with internal button without type attribute as submitter', () => {
		const button = document.createElement('button');
		form.appendChild(button);

		submitOwningForm(element, internals);

		expect(form.requestSubmit).toHaveBeenCalledWith(button);
	});

	it('should submit with external button via form attribute as submitter', () => {
		form.id = 'submitOwningForm-test-form';
		const externalButton = document.createElement('button');
		externalButton.type = 'submit';
		externalButton.setAttribute('form', 'submitOwningForm-test-form');
		document.body.appendChild(externalButton);

		submitOwningForm(element, internals);

		expect(form.requestSubmit).toHaveBeenCalledWith(externalButton);

		document.body.removeChild(externalButton);
	});

	it('should submit without native submitter when dv-button is the submitter', () => {
		const oButton = document.createElement('dv-button');
		form.appendChild(oButton);

		submitOwningForm(element, internals);

		expect(form.requestSubmit).toHaveBeenCalledWith(undefined);
	});

	it('should submit without native submitter when external dv-button is the submitter', () => {
		form.id = 'submitOwningForm-obutton-form';
		const oButton = document.createElement('dv-button');
		oButton.setAttribute('form', 'submitOwningForm-obutton-form');
		document.body.appendChild(oButton);

		submitOwningForm(element, internals);

		expect(form.requestSubmit).toHaveBeenCalledWith(undefined);

		document.body.removeChild(oButton);
	});

	it('should submit without native submitter when dv-button[type="button"] is present', () => {
		const oButton = document.createElement('dv-button');
		oButton.setAttribute('type', 'button');
		form.appendChild(oButton);

		submitOwningForm(element, internals);

		expect(form.requestSubmit).toHaveBeenCalledWith(undefined);
	});

	it('should submit without native submitter when external dv-button[type="button"] is present', () => {
		form.id = 'submitOwningForm-obutton-excluded-form';
		const oButton = document.createElement('dv-button');
		oButton.setAttribute('type', 'button');
		oButton.setAttribute('form', 'submitOwningForm-obutton-excluded-form');
		document.body.appendChild(oButton);

		submitOwningForm(element, internals);

		expect(form.requestSubmit).toHaveBeenCalledWith(undefined);

		document.body.removeChild(oButton);
	});

	it('should submit without native submitter when no submitter is found', () => {
		submitOwningForm(element, internals);

		expect(form.requestSubmit).toHaveBeenCalledWith(undefined);
	});
});

