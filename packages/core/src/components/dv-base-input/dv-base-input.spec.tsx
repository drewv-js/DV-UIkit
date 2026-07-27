import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvBaseInput } from './dv-base-input';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-base-input', () => {
	let baseInput: TypedSpecPage<DvBaseInput>;

	// Initialize a new instance for DvBaseInput
	beforeEach(async () => {
		baseInput = (await newSpecPage({
			components: [DvBaseInput],
			html: '<dv-base-input></dv-base-input>',
			supportsShadowDom: true
		})) as TypedSpecPage<DvBaseInput>;
	});

	// Teardown instance and restore after each test case
	afterEach(() => {
		baseInput = null;
	});

	describe('Initialization with default state', () => {
		it('should render with native input', async () => {
			await baseInput.waitForChanges();
			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input).not.toBeNull();
		});

		it('should have default prop values', () => {
			const instance = baseInput.rootInstance;
			expect(instance.nameValue).toBe('default');
			expect(instance.label).toBe('');
			expect(instance.placeholder).toBe('');
			expect(instance.type).toBe('text');
			expect(instance.required).toBe(false);
			expect(instance.disabled).toBe(false);
			expect(instance.errorText).toBe('');
			expect(instance.helpText).toBe('');
			expect(instance.size).toBe('md');
			expect(instance.value).toBe('');
		});

		it('should initialize hasStartIcon, hasEndIcon, and hasActions as false', () => {
			expect(baseInput.rootInstance.hasStartIcon).toBe(false);
			expect(baseInput.rootInstance.hasEndIcon).toBe(false);
			expect(baseInput.rootInstance.hasActions).toBe(false);
		});
	});

	describe('Props', () => {
		it('should render with custom props', async () => {
			baseInput.root.label = 'Test Label';
			baseInput.root.type = 'email';
			baseInput.root.required = true;
			baseInput.root.value = 'test@email.com';
			baseInput.root.placeholder = 'Test Placeholder';
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			const label = baseInput.root.shadowRoot.querySelector('dv-label');

			expect(label).toBeTruthy();
			expect(label.getAttribute('label')).toBe('Test Label');
			expect(input.placeholder).toBe('Test Placeholder');
			expect(input.type).toBe('email');
			expect(input.required).toBe(true);
			expect(input.value).toBe('test@email.com');
		});

		it('should not render dv-label when label prop is empty', async () => {
			await baseInput.waitForChanges();
			const label = baseInput.root.shadowRoot.querySelector('dv-label');
			expect(label).toBeNull();
		});

		it('should render with all supported input types', async () => {
			const types = ['text', 'password', 'email', 'number', 'time'] as const;
			for (const type of types) {
				baseInput.root.type = type;
				await baseInput.waitForChanges();
				const input = baseInput.root.shadowRoot.querySelector('input');
				expect(input.type).toBe(type);
			}
		});

		it('should handle disabled state correctly', async () => {
			baseInput.root.disabled = true;
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.disabled).toBe(true);
			expect(input.className).toContain('cursor-not-allowed');
		});

		it('should render error message when errorText is set', async () => {
			baseInput.root.errorText = 'This is an error';
			await baseInput.waitForChanges();

			const errorDiv = baseInput.root.shadowRoot.querySelector('div.body-xs.mt-1');
			const errorSpan = errorDiv?.querySelector('span.text-status-error');
			expect(errorSpan?.textContent).toBe('This is an error');
		});

		it('should not render error message when errorText is empty', async () => {
			await baseInput.waitForChanges();
			const errorSpan = baseInput.root.shadowRoot.querySelector('span.text-status-error');
			expect(errorSpan).toBeNull();
		});

		it('should display help text when provided', async () => {
			baseInput.root.helpText = 'This is help text';
			await baseInput.waitForChanges();

			const helpDiv = baseInput.root.shadowRoot.querySelector('div.body-xs.mt-1');
			const helpSpan = helpDiv?.querySelector('span');
			expect(helpSpan?.textContent).toBe('This is help text');
		});

		it('should not render help text when error is present', async () => {
			baseInput.root.helpText = 'Help text';
			baseInput.root.errorText = 'Error text';
			await baseInput.waitForChanges();

			// error div should exist but help text span should not
			const helpSpan = baseInput.root.shadowRoot.querySelector('span.line-clamp-2');
			expect(helpSpan).toBeNull();
		});

		it('should render help text with disabled styling when disabled', async () => {
			baseInput.root.helpText = 'Help text';
			baseInput.root.disabled = true;
			await baseInput.waitForChanges();

			const helpDiv = baseInput.root.shadowRoot.querySelector('div.body-xs.mt-1');
			expect(helpDiv.className).toContain('text-disabled');
		});

		it('should render help text with subtle styling when not disabled', async () => {
			baseInput.root.helpText = 'Help text';
			baseInput.root.disabled = false;
			await baseInput.waitForChanges();

			const helpDiv = baseInput.root.shadowRoot.querySelector('div.body-xs.mt-1');
			expect(helpDiv.className).toContain('text-subtle');
		});

		it('should apply sm size classes to input when size is sm', async () => {
			baseInput.root.size = 'sm';
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('py-1');
			expect(input.className).toContain('body-sm');
		});

		it('should apply md size classes to input when size is md', async () => {
			baseInput.root.size = 'md';
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('py-2');
			expect(input.className).toContain('body-default');
		});

		it('should apply error classes to input when errorText is set', async () => {
			baseInput.root.errorText = 'Error';
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('text-status-error');
			expect(input.className).toContain('border-status-error');
		});

		it('should apply default classes to input when not disabled and no error', async () => {
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('text-default');
			expect(input.className).toContain('border-form-default');
			expect(input.className).toContain('bg-form-default');
		});

		it('should set label variant to error when errorText set', async () => {
			baseInput.root.label = 'Test Label';
			baseInput.root.errorText = 'Error message';
			baseInput.root.disabled = false;
			await baseInput.waitForChanges();

			const label = baseInput.root.shadowRoot.querySelector('dv-label');
			expect(label.getAttribute('variant')).toBe('error');
		});

		it('should set label variant to disabled when disabled and no errorText set', async () => {
			baseInput.root.label = 'Test Label';
			baseInput.root.errorText = '';
			baseInput.root.disabled = true;
			await baseInput.waitForChanges();

			const label = baseInput.root.shadowRoot.querySelector('dv-label');
			expect(label.getAttribute('variant')).toBe('disabled');
		});

		it('should set label variant to error when both disabled and errorText set', async () => {
			baseInput.root.label = 'Test Label';
			baseInput.root.errorText = 'Error message';
			baseInput.root.disabled = true;
			await baseInput.waitForChanges();

			const label = baseInput.root.shadowRoot.querySelector('dv-label');
			expect(label.getAttribute('variant')).toBe('error');
		});

		it('should set label variant to undefined when neither disabled nor errorText set', async () => {
			baseInput.root.label = 'Test Label';
			baseInput.root.errorText = '';
			baseInput.root.disabled = false;
			await baseInput.waitForChanges();

			const label = baseInput.root.shadowRoot.querySelector('dv-label');
			expect(label.getAttribute('variant')).toBeNull();
		});
	});

	describe('Events', () => {
		it('should set hasStartIcon to true when start slot slotchange fires with assigned elements', async () => {
			const mockSlot = {
				assignedElements: jest.fn().mockReturnValue([document.createElement('span')])
			};
			(baseInput.rootInstance as any).handleStartIconSlotChange({ target: mockSlot } as unknown as Event);
			await baseInput.waitForChanges();

			expect(baseInput.rootInstance.hasStartIcon).toBe(true);
		});

		it('should set hasStartIcon to false when start slot slotchange fires with no assigned elements', async () => {
			baseInput.rootInstance.hasStartIcon = true;

			const mockSlot = { assignedElements: jest.fn().mockReturnValue([]) };
			(baseInput.rootInstance as any).handleStartIconSlotChange({ target: mockSlot } as unknown as Event);
			await baseInput.waitForChanges();

			expect(baseInput.rootInstance.hasStartIcon).toBe(false);
		});

		it('should set hasEndIcon to true when end slot slotchange fires with assigned elements', async () => {
			const mockSlot = {
				assignedElements: jest.fn().mockReturnValue([document.createElement('span')])
			};
			(baseInput.rootInstance as any).handleEndIconSlotChange({ target: mockSlot } as unknown as Event);
			await baseInput.waitForChanges();

			expect(baseInput.rootInstance.hasEndIcon).toBe(true);
		});

		it('should set hasEndIcon to false when end slot slotchange fires with no assigned elements', async () => {
			baseInput.rootInstance.hasEndIcon = true;

			const mockSlot = { assignedElements: jest.fn().mockReturnValue([]) };
			(baseInput.rootInstance as any).handleEndIconSlotChange({ target: mockSlot } as unknown as Event);
			await baseInput.waitForChanges();

			expect(baseInput.rootInstance.hasEndIcon).toBe(false);
		});

		it('should call syncIconSizes and syncIconColors when start icon slotchange fires', () => {
			const syncSizesSpy = jest.spyOn(baseInput.rootInstance as any, 'syncIconSizes');
			const syncColorsSpy = jest.spyOn(baseInput.rootInstance as any, 'syncIconColors');

			const mockSlot = { assignedElements: jest.fn().mockReturnValue([]) };
			(baseInput.rootInstance as any).handleStartIconSlotChange({ target: mockSlot } as unknown as Event);

			expect(syncSizesSpy).toHaveBeenCalled();
			expect(syncColorsSpy).toHaveBeenCalled();
			syncSizesSpy.mockRestore();
			syncColorsSpy.mockRestore();
		});

		it('should call syncIconSizes and syncIconColors when end icon slotchange fires', () => {
			const syncSizesSpy = jest.spyOn(baseInput.rootInstance as any, 'syncIconSizes');
			const syncColorsSpy = jest.spyOn(baseInput.rootInstance as any, 'syncIconColors');

			const mockSlot = { assignedElements: jest.fn().mockReturnValue([]) };
			(baseInput.rootInstance as any).handleEndIconSlotChange({ target: mockSlot } as unknown as Event);

			expect(syncSizesSpy).toHaveBeenCalled();
			expect(syncColorsSpy).toHaveBeenCalled();
			syncSizesSpy.mockRestore();
			syncColorsSpy.mockRestore();
		});

		it('should set hasActions to true when actions slot slotchange fires with assigned elements', async () => {
			const mockSlot = {
				assignedElements: jest.fn().mockReturnValue([document.createElement('dv-icon-button')])
			};
			(baseInput.rootInstance as any).handleActionsSlotChange({ target: mockSlot } as unknown as Event);
			await baseInput.waitForChanges();

			expect(baseInput.rootInstance.hasActions).toBe(true);
		});

		it('should set hasActions to false when actions slot slotchange fires with no assigned elements', async () => {
			baseInput.rootInstance.hasActions = true;

			const mockSlot = { assignedElements: jest.fn().mockReturnValue([]) };
			(baseInput.rootInstance as any).handleActionsSlotChange({ target: mockSlot } as unknown as Event);
			await baseInput.waitForChanges();

			expect(baseInput.rootInstance.hasActions).toBe(false);
		});

		it('should call syncIconSizes and syncIconColors when actions slotchange fires', () => {
			const syncSizesSpy = jest.spyOn(baseInput.rootInstance as any, 'syncIconSizes');
			const syncColorsSpy = jest.spyOn(baseInput.rootInstance as any, 'syncIconColors');

			const mockSlot = { assignedElements: jest.fn().mockReturnValue([]) };
			(baseInput.rootInstance as any).handleActionsSlotChange({ target: mockSlot } as unknown as Event);

			expect(syncSizesSpy).toHaveBeenCalled();
			expect(syncColorsSpy).toHaveBeenCalled();
			syncSizesSpy.mockRestore();
			syncColorsSpy.mockRestore();
		});

		it('should emit valueChange event with new value when user types', async () => {
			const valueChangeEvents: CustomEvent[] = [];
			baseInput.root.addEventListener('valueChange', (e: Event) => valueChangeEvents.push(e as CustomEvent));

			const input = baseInput.root.shadowRoot.querySelector('input');
			input.value = 'hello';
			input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
			await baseInput.waitForChanges();

			expect(valueChangeEvents).toHaveLength(1);
			expect(valueChangeEvents[0].detail).toEqual({ value: 'hello' });
		});

		it('should update value prop when native input event fires', async () => {
			const input = baseInput.root.shadowRoot.querySelector('input');
			input.value = 'typed value';
			input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
			await baseInput.waitForChanges();

			expect(baseInput.root.value).toBe('typed value');
		});

		it('should emit change event when native change fires', async () => {
			const changeEvents: Event[] = [];
			baseInput.root.addEventListener('change', (e: Event) => changeEvents.push(e));

			const input = baseInput.root.shadowRoot.querySelector('input');
			input.dispatchEvent(new Event('change', { bubbles: true }));
			await baseInput.waitForChanges();

			expect(changeEvents).toHaveLength(1);
		});
	});

	describe('Methods', () => {
		it('should call syncIconSizes when size prop changes via sizeChanged watcher', async () => {
			const syncIconSizesSpy = jest.spyOn(baseInput.rootInstance as any, 'syncIconSizes');

			baseInput.root.size = 'sm';
			await baseInput.waitForChanges();

			expect(syncIconSizesSpy).toHaveBeenCalled();
			syncIconSizesSpy.mockRestore();
		});

		it('should call syncIconColors when disabled prop changes via disabledChanged watcher', async () => {
			const syncIconColorsSpy = jest.spyOn(baseInput.rootInstance as any, 'syncIconColors');

			baseInput.root.disabled = true;
			await baseInput.waitForChanges();

			expect(syncIconColorsSpy).toHaveBeenCalled();
			syncIconColorsSpy.mockRestore();
		});

		it('should call syncIconColors when errorText prop changes via errorTextChanged watcher', async () => {
			const syncIconColorsSpy = jest.spyOn(baseInput.rootInstance as any, 'syncIconColors');

			baseInput.root.errorText = 'Some error';
			await baseInput.waitForChanges();

			expect(syncIconColorsSpy).toHaveBeenCalled();
			syncIconColorsSpy.mockRestore();
		});

		it('should propagate xs size to slotted icons when size is sm', async () => {
			const mockIcon = { size: undefined as any, color: undefined as any };
			const getSlottedIconsSpy = jest
				.spyOn(baseInput.rootInstance as any, 'getSlottedIcons')
				.mockReturnValue([mockIcon]);

			baseInput.root.size = 'sm';
			await baseInput.waitForChanges();

			expect(mockIcon.size).toBe('xs');
			getSlottedIconsSpy.mockRestore();
		});

		it('should propagate md size to slotted icons when size is md', async () => {
			const mockIcon = { size: undefined as any, color: undefined as any };
			const getSlottedIconsSpy = jest
				.spyOn(baseInput.rootInstance as any, 'getSlottedIcons')
				.mockReturnValue([mockIcon]);

			// Change to sm first so the watcher fires when switching back to md
			baseInput.root.size = 'sm';
			await baseInput.waitForChanges();
			baseInput.root.size = 'md';
			await baseInput.waitForChanges();

			expect(mockIcon.size).toBe('md');
			getSlottedIconsSpy.mockRestore();
		});

		it('should propagate xs size to slotted actions when size is sm', async () => {
			const mockAction = { size: undefined as any };
			const getSlottedActionsSpy = jest
				.spyOn(baseInput.rootInstance as any, 'getSlottedActions')
				.mockReturnValue([mockAction]);

			baseInput.root.size = 'sm';
			await baseInput.waitForChanges();

			expect(mockAction.size).toBe('xs');
			getSlottedActionsSpy.mockRestore();
		});

		it('should propagate md size to slotted actions when size is md', async () => {
			const mockAction = { size: undefined as any };
			const getSlottedActionsSpy = jest
				.spyOn(baseInput.rootInstance as any, 'getSlottedActions')
				.mockReturnValue([mockAction]);

			baseInput.root.size = 'sm';
			await baseInput.waitForChanges();
			baseInput.root.size = 'md';
			await baseInput.waitForChanges();

			expect(mockAction.size).toBe('md');
			getSlottedActionsSpy.mockRestore();
		});

		it('should return empty array from getSlottedActions when no elements are assigned to the actions slot', () => {
			const actions = (baseInput.rootInstance as any).getSlottedActions();
			expect(actions).toEqual([]);
		});

		it('should find dv-icon-button elements directly assigned to the actions slot in getSlottedActions', () => {
			const mockIconButton = {
				tagName: 'DV-ICON-BUTTON',
				querySelectorAll: jest.fn().mockReturnValue([])
			};
			const mockSlot = { assignedElements: jest.fn().mockReturnValue([mockIconButton]) };
			const querySelectorSpy = jest
				.spyOn(baseInput.rootInstance.host.shadowRoot, 'querySelector')
				.mockReturnValue(mockSlot as any);

			const actions = (baseInput.rootInstance as any).getSlottedActions();

			expect(actions).toContain(mockIconButton);
			querySelectorSpy.mockRestore();
		});

		it('should find dv-icon-button elements nested inside assigned action elements in getSlottedActions', () => {
			const nestedIconButton = {} as any;
			const mockContainer = {
				tagName: 'DIV',
				querySelectorAll: jest.fn().mockReturnValue([nestedIconButton])
			};
			const mockSlot = { assignedElements: jest.fn().mockReturnValue([mockContainer]) };
			const querySelectorSpy = jest
				.spyOn(baseInput.rootInstance.host.shadowRoot, 'querySelector')
				.mockReturnValue(mockSlot as any);

			const actions = (baseInput.rootInstance as any).getSlottedActions();

			expect(actions).toContain(nestedIconButton);
			querySelectorSpy.mockRestore();
		});

		it('should return empty array from getSlottedActions when shadowRoot is null', () => {
			Object.defineProperty(baseInput.rootInstance.host, 'shadowRoot', { get: () => null, configurable: true });

			const actions = (baseInput.rootInstance as any).getSlottedActions();
			expect(actions).toEqual([]);
		});

		it('should return empty array from getSlottedActions when the actions slot is missing', () => {
			const querySelectorSpy = jest
				.spyOn(baseInput.rootInstance.host.shadowRoot, 'querySelector')
				.mockReturnValue(null);

			const actions = (baseInput.rootInstance as any).getSlottedActions();

			expect(actions).toEqual([]);
			querySelectorSpy.mockRestore();
		});

		it('should handle elements with no tagName gracefully in getSlottedActions', () => {
			const mockElement = { tagName: undefined, querySelectorAll: jest.fn().mockReturnValue([]) };
			const mockSlot = { assignedElements: jest.fn().mockReturnValue([mockElement]) };
			const querySelectorSpy = jest
				.spyOn(baseInput.rootInstance.host.shadowRoot, 'querySelector')
				.mockReturnValue(mockSlot as any);

			const actions = (baseInput.rootInstance as any).getSlottedActions();

			expect(actions).toEqual([]);
			querySelectorSpy.mockRestore();
		});

		it('should propagate error color to slotted icons when errorText is set', async () => {
			const mockIcon = { size: undefined as any, color: undefined as any };
			const getSlottedIconsSpy = jest
				.spyOn(baseInput.rootInstance as any, 'getSlottedIcons')
				.mockReturnValue([mockIcon]);

			baseInput.root.errorText = 'Error message';
			await baseInput.waitForChanges();

			expect(mockIcon.color).toBe('error');
			getSlottedIconsSpy.mockRestore();
		});

		it('should propagate disabled color to slotted icons when disabled is true', async () => {
			const mockIcon = { size: undefined as any, color: undefined as any };
			const getSlottedIconsSpy = jest
				.spyOn(baseInput.rootInstance as any, 'getSlottedIcons')
				.mockReturnValue([mockIcon]);

			baseInput.root.disabled = true;
			await baseInput.waitForChanges();

			expect(mockIcon.color).toBe('disabled');
			getSlottedIconsSpy.mockRestore();
		});

		it('should clear icon color when no error and not disabled', () => {
			const mockIcon = { size: undefined as any, color: 'error' as any };
			const getSlottedIconsSpy = jest
				.spyOn(baseInput.rootInstance as any, 'getSlottedIcons')
				.mockReturnValue([mockIcon]);

			baseInput.rootInstance.errorText = '';
			baseInput.rootInstance.disabled = false;
			(baseInput.rootInstance as any).syncIconColors();

			expect(mockIcon.color).toBeUndefined();
			getSlottedIconsSpy.mockRestore();
		});

		it('should call syncIconSizes and syncIconColors in componentDidLoad', () => {
			const syncSizesSpy = jest.spyOn(baseInput.rootInstance as any, 'syncIconSizes');
			const syncColorsSpy = jest.spyOn(baseInput.rootInstance as any, 'syncIconColors');

			baseInput.rootInstance.componentDidLoad();

			expect(syncSizesSpy).toHaveBeenCalled();
			expect(syncColorsSpy).toHaveBeenCalled();
			syncSizesSpy.mockRestore();
			syncColorsSpy.mockRestore();
		});

		it('should return empty array from getSlottedIcons when no elements are assigned to slots', () => {
			const icons = (baseInput.rootInstance as any).getSlottedIcons();
			expect(icons).toEqual([]);
		});

		it('should return empty array from getSlottedIcons when shadowRoot is null', () => {
			Object.defineProperty(baseInput.rootInstance.host, 'shadowRoot', { get: () => null, configurable: true });

			const icons = (baseInput.rootInstance as any).getSlottedIcons();
			expect(icons).toEqual([]);
		});

		it('should handle componentDidLoad gracefully when shadowRoot is null', () => {
			Object.defineProperty(baseInput.rootInstance.host, 'shadowRoot', { get: () => null, configurable: true });

			expect(() => baseInput.rootInstance.componentDidLoad()).not.toThrow();
		});

		it('should find dv-icon elements directly assigned to slots in getSlottedIcons', () => {
			const mockOIcon = {
				tagName: 'DV-ICON',
				querySelectorAll: jest.fn().mockReturnValue([])
			};
			const mockSlot = { assignedElements: jest.fn().mockReturnValue([mockOIcon]) };
			const querySelectorAllSpy = jest
				.spyOn(baseInput.rootInstance.host.shadowRoot, 'querySelectorAll')
				.mockReturnValue([mockSlot] as any);

			const icons = (baseInput.rootInstance as any).getSlottedIcons();

			expect(icons).toContain(mockOIcon);
			querySelectorAllSpy.mockRestore();
		});

		it('should find dv-icon elements nested inside assigned slot elements in getSlottedIcons', () => {
			const nestedIcon = {} as any;
			const mockContainer = {
				tagName: 'DIV',
				querySelectorAll: jest.fn().mockReturnValue([nestedIcon])
			};
			const mockSlot = { assignedElements: jest.fn().mockReturnValue([mockContainer]) };
			const querySelectorAllSpy = jest
				.spyOn(baseInput.rootInstance.host.shadowRoot, 'querySelectorAll')
				.mockReturnValue([mockSlot] as any);

			const icons = (baseInput.rootInstance as any).getSlottedIcons();

			expect(icons).toContain(nestedIcon);
			querySelectorAllSpy.mockRestore();
		});

		it('should handle elements with no tagName gracefully in getSlottedIcons', () => {
			const mockElement = { tagName: undefined, querySelectorAll: jest.fn().mockReturnValue([]) };
			const mockSlot = { assignedElements: jest.fn().mockReturnValue([mockElement]) };
			const querySelectorAllSpy = jest
				.spyOn(baseInput.rootInstance.host.shadowRoot, 'querySelectorAll')
				.mockReturnValue([mockSlot] as any);

			const icons = (baseInput.rootInstance as any).getSlottedIcons();

			expect(icons).toEqual([]);
			querySelectorAllSpy.mockRestore();
		});
	});

	describe('Slots', () => {
		it('should always render startIcon slot in shadow DOM', async () => {
			await baseInput.waitForChanges();
			const startSlot = baseInput.root.shadowRoot.querySelector('slot[name="startIcon"]');
			expect(startSlot).not.toBeNull();
		});

		it('should always render endIcon slot in shadow DOM', async () => {
			await baseInput.waitForChanges();
			const endSlot = baseInput.root.shadowRoot.querySelector('slot[name="endIcon"]');
			expect(endSlot).not.toBeNull();
		});

		it('should always render actions slot in shadow DOM', async () => {
			await baseInput.waitForChanges();
			const actionsSlot = baseInput.root.shadowRoot.querySelector('slot[name="actions"]');
			expect(actionsSlot).not.toBeNull();
		});

		it('should hide startIcon container when hasStartIcon is false', async () => {
			baseInput.rootInstance.hasStartIcon = false;
			await baseInput.waitForChanges();

			const startIconWrapper = baseInput.root.shadowRoot.querySelector('.absolute.inset-y-0.left-4');
			expect(startIconWrapper.className).toContain('hidden');
		});

		it('should show startIcon container when hasStartIcon is true', async () => {
			baseInput.rootInstance.hasStartIcon = true;
			await baseInput.waitForChanges();

			const startIconWrapper = baseInput.root.shadowRoot.querySelector('.absolute.inset-y-0.left-4');
			expect(startIconWrapper.className).not.toContain('hidden');
		});

		it('should hide endIcon container when hasEndIcon is false', async () => {
			baseInput.rootInstance.hasEndIcon = false;
			await baseInput.waitForChanges();

			const endIconWrapper = baseInput.root.shadowRoot.querySelector(
				'.absolute.inset-y-0.right-3 .pointer-events-none'
			);
			expect(endIconWrapper.className).toContain('hidden');
		});

		it('should show endIcon container when hasEndIcon is true', async () => {
			baseInput.rootInstance.hasEndIcon = true;
			await baseInput.waitForChanges();

			const endIconWrapper = baseInput.root.shadowRoot.querySelector(
				'.absolute.inset-y-0.right-3 .pointer-events-none'
			);
			expect(endIconWrapper.className).not.toContain('hidden');
		});

		it('should hide actions container when hasActions is false', async () => {
			baseInput.rootInstance.hasActions = false;
			await baseInput.waitForChanges();

			const actionsWrapper = baseInput.root.shadowRoot.querySelector(
				'.absolute.inset-y-0.right-3 .pointer-events-auto'
			);
			expect(actionsWrapper.className).toContain('hidden');
		});

		it('should show actions container when hasActions is true', async () => {
			baseInput.rootInstance.hasActions = true;
			await baseInput.waitForChanges();

			const actionsWrapper = baseInput.root.shadowRoot.querySelector(
				'.absolute.inset-y-0.right-3 .pointer-events-auto'
			);
			expect(actionsWrapper.className).not.toContain('hidden');
		});

		it('should position actions before endIcon so actions render in front of the end icon', async () => {
			baseInput.rootInstance.hasActions = true;
			baseInput.rootInstance.hasEndIcon = true;
			await baseInput.waitForChanges();

			const endContainer = baseInput.root.shadowRoot.querySelector('.absolute.inset-y-0.right-3');
			const children = Array.from(endContainer.children) as HTMLElement[];
			const actionsIndex = children.findIndex((el) => el.className.includes('pointer-events-auto'));
			const endIconIndex = children.findIndex((el) => el.className.includes('pointer-events-none'));

			expect(actionsIndex).toBeGreaterThanOrEqual(0);
			expect(endIconIndex).toBeGreaterThan(actionsIndex);
		});

		it('should apply pl-9 padding to input when hasStartIcon is true and size is sm', async () => {
			baseInput.rootInstance.hasStartIcon = true;
			baseInput.root.size = 'sm';
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('pl-9');
		});

		it('should apply pl-11 padding to input when hasStartIcon is true and size is md', async () => {
			baseInput.rootInstance.hasStartIcon = true;
			baseInput.root.size = 'md';
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('pl-11');
		});

		it('should apply pr-9 padding to input when hasEndIcon is true and size is sm', async () => {
			baseInput.rootInstance.hasEndIcon = true;
			baseInput.root.size = 'sm';
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('pr-9');
		});

		it('should apply pr-10 padding to input when hasEndIcon is true and size is md', async () => {
			baseInput.rootInstance.hasEndIcon = true;
			baseInput.root.size = 'md';
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('pr-10');
		});

		it('should apply pr-9 padding to input when hasActions is true and size is sm', async () => {
			baseInput.rootInstance.hasActions = true;
			baseInput.root.size = 'sm';
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('pr-9');
		});

		it('should apply pr-10 padding to input when hasActions is true and size is md', async () => {
			baseInput.rootInstance.hasActions = true;
			baseInput.root.size = 'md';
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('pr-10');
		});

		it('should apply pr-16 combined padding to input when hasActions and hasEndIcon are both true and size is sm', async () => {
			baseInput.rootInstance.hasActions = true;
			baseInput.rootInstance.hasEndIcon = true;
			baseInput.root.size = 'sm';
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('pr-16');
			expect(input.className).not.toContain('pr-9');
		});

		it('should apply pr-20 combined padding to input when hasActions and hasEndIcon are both true and size is md', async () => {
			baseInput.rootInstance.hasActions = true;
			baseInput.rootInstance.hasEndIcon = true;
			baseInput.root.size = 'md';
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('pr-20');
			expect(input.className).not.toContain('pr-10');
		});

		it('should not apply icon padding when hasStartIcon, hasEndIcon, and hasActions are all false', async () => {
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.className).not.toContain('pl-9');
			expect(input.className).not.toContain('pl-11');
			expect(input.className).not.toContain('pr-9');
			expect(input.className).not.toContain('pr-10');
			expect(input.className).not.toContain('pr-16');
			expect(input.className).not.toContain('pr-20');
		});

		it('should apply text-disabled class to startIcon wrapper when disabled', async () => {
			baseInput.rootInstance.hasStartIcon = true;
			baseInput.root.disabled = true;
			await baseInput.waitForChanges();

			const startIconWrapper = baseInput.root.shadowRoot.querySelector('.absolute.inset-y-0.left-4');
			expect(startIconWrapper.className).toContain('text-disabled');
		});

		it('should apply text-subtle class to startIcon wrapper when not disabled', async () => {
			baseInput.rootInstance.hasStartIcon = true;
			baseInput.root.disabled = false;
			await baseInput.waitForChanges();

			const startIconWrapper = baseInput.root.shadowRoot.querySelector('.absolute.inset-y-0.left-4');
			expect(startIconWrapper.className).toContain('text-subtle');
		});

		it('should apply text-disabled class to endIcon wrapper when disabled', async () => {
			baseInput.rootInstance.hasEndIcon = true;
			baseInput.root.disabled = true;
			await baseInput.waitForChanges();

			const endIconWrapper = baseInput.root.shadowRoot.querySelector(
				'.absolute.inset-y-0.right-3 .pointer-events-none'
			);
			expect(endIconWrapper.className).toContain('text-disabled');
		});

		it('should apply text-subtle class to endIcon wrapper when not disabled', async () => {
			baseInput.rootInstance.hasEndIcon = true;
			baseInput.root.disabled = false;
			await baseInput.waitForChanges();

			const endIconWrapper = baseInput.root.shadowRoot.querySelector(
				'.absolute.inset-y-0.right-3 .pointer-events-none'
			);
			expect(endIconWrapper.className).toContain('text-subtle');
		});

		it('should apply text-disabled class to actions wrapper when disabled', async () => {
			baseInput.rootInstance.hasActions = true;
			baseInput.root.disabled = true;
			await baseInput.waitForChanges();

			const actionsWrapper = baseInput.root.shadowRoot.querySelector(
				'.absolute.inset-y-0.right-3 .pointer-events-auto'
			);
			expect(actionsWrapper.className).toContain('text-disabled');
		});

		it('should apply text-subtle class to actions wrapper when not disabled', async () => {
			baseInput.rootInstance.hasActions = true;
			baseInput.root.disabled = false;
			await baseInput.waitForChanges();

			const actionsWrapper = baseInput.root.shadowRoot.querySelector(
				'.absolute.inset-y-0.right-3 .pointer-events-auto'
			);
			expect(actionsWrapper.className).toContain('text-subtle');
		});
	});

	describe('Accessibility', () => {
		it('should associate dv-label with native input via matching htmlFor and id', async () => {
			baseInput.root.label = 'Test Label';
			baseInput.root.nameValue = 'test-name-value';
			await baseInput.waitForChanges();

			const label = baseInput.root.shadowRoot.querySelector('dv-label');
			const input = baseInput.root.shadowRoot.querySelector('input');

			// Stencil's test renderer sets non-native JSX props as attributes using the
			// raw camelCase name; HTML lowercases it to 'htmlfor' in the DOM.
			expect(label.getAttribute('htmlfor')).toBe('test-name-value');
			expect(input.id).toBe('test-name-value');
		});

		it('should reflect required attribute on native input for assistive technology', async () => {
			baseInput.root.required = true;
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.required).toBe(true);
		});

		it('should not set required attribute on native input when required is false', async () => {
			baseInput.root.required = false;
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.required).toBe(false);
		});

		it('should reflect disabled attribute on native input for assistive technology', async () => {
			baseInput.root.disabled = true;
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.disabled).toBe(true);
		});

		it('should not set disabled attribute on native input when disabled is false', async () => {
			baseInput.root.disabled = false;
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.disabled).toBe(false);
		});

		it('should expose native input via CSS part for external accessibility styling', async () => {
			await baseInput.waitForChanges();

			const input = baseInput.root.shadowRoot.querySelector('input');
			expect(input.getAttribute('part')).toBe('input');
		});

		it('should forward required prop to dv-label for required indicator rendering', async () => {
			baseInput.root.label = 'Required Field';
			baseInput.root.required = true;
			await baseInput.waitForChanges();

			const label = baseInput.root.shadowRoot.querySelector('dv-label');
			expect(label.getAttribute('required')).not.toBeNull();
		});

		it('should not render dv-label when label prop is empty, leaving input without a visible label', async () => {
			await baseInput.waitForChanges();

			const label = baseInput.root.shadowRoot.querySelector('dv-label');
			expect(label).toBeNull();
		});
	});
});


