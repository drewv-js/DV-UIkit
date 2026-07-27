import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvStepper } from './dv-stepper';
import { DvStep } from '../dv-step/dv-step';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

// Disable the mutation observer for unit tests
DvStepper.DISABLE_MUTATION_OBSERVER = true;

describe('dv-stepper', () => {
	let stepperSpec: TypedSpecPage<DvStepper>;

	// Initialize a new instance for DvStepper
	beforeEach(async () => {
		stepperSpec = (await newSpecPage({
			components: [DvStepper, DvStep],
			html: `
        <dv-stepper clickable>
          <dv-step variant="active">Step 1</dv-step>
          <dv-step variant="completed">Step 2</dv-step>
          <dv-step variant="default">Step 3</dv-step>
          <dv-step variant="error">Step 4</dv-step>
        </dv-stepper>
      `,
			supportsShadowDom: true
		})) as TypedSpecPage<DvStepper>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		stepperSpec = null;
	});

	describe('Initialization with default state', () => {
		it('should render the component', async () => {
			// Check that the component is rendered
			expect(stepperSpec.root).toBeTruthy();
		});
	});

	describe('Events', () => {
		it('should set the selected index when a step is clicked', async () => {
			const step1 = stepperSpec.root.querySelector('dv-step') as any;
			// Simulate a click on the first step
			step1.click();
			await stepperSpec.waitForChanges();
			// Check that the selected index is updated
			expect(stepperSpec.rootInstance.selectedIndex).toBe(0);
		});

		it('should emit stepSelected event when selectedIndex is updated', async () => {
			const stepSelectedSpy = jest.spyOn(stepperSpec.rootInstance.stepSelected, 'emit');
			await stepperSpec.rootInstance.stepperSetSelectedIndex(1);
			// Check that the event was emitted with the correct index
			expect(stepSelectedSpy).toHaveBeenCalledWith(1);
		});
	});

	describe('Methods', () => {
		it('should update selectedIndex when a valid index is provided', async () => {
			await stepperSpec.rootInstance.stepperSetSelectedIndex(1);
			// Check that selectedIndex is updated
			expect(stepperSpec.rootInstance.selectedIndex).toBe(1);
		});

		it('should not update selectedIndex if the same index is provided', async () => {
			await stepperSpec.rootInstance.stepperSetSelectedIndex(0);
			// Check it is still 0
			expect(stepperSpec.rootInstance.selectedIndex).toBe(0);
			await stepperSpec.rootInstance.stepperSetSelectedIndex(0);
			// Check it hasn't changed
			expect(stepperSpec.rootInstance.selectedIndex).toBe(0);
		});

		it('should not update selectedIndex if the index is out of bounds', async () => {
			await stepperSpec.rootInstance.stepperSetSelectedIndex(-1);
			// Check it hasn't changed
			expect(stepperSpec.rootInstance.selectedIndex).toBe(0);
			await stepperSpec.rootInstance.stepperSetSelectedIndex(4);
			// Check it hasn't changed
			expect(stepperSpec.rootInstance.selectedIndex).toBe(0);
		});

		it('should disconnect observer on disconnectedCallback when observer exists', async () => {
			// Mock MutationObserver
			const disconnectMock = jest.fn();
			const observeMock = jest.fn();
			const MockMutationObserver = jest.fn().mockImplementation(() => ({
				disconnect: disconnectMock,
				observe: observeMock
			}));
			(global as any).MutationObserver = MockMutationObserver;

			// Re-enable mutation observer for this test
			DvStepper.DISABLE_MUTATION_OBSERVER = false;

			const page = await newSpecPage({
				components: [DvStepper, DvStep],
				html: `
								<dv-stepper>
									<dv-step></dv-step>
								</dv-stepper>
							`,
				supportsShadowDom: true
			});

			const component = page.rootInstance as DvStepper;
			await page.waitForChanges();

			// Verify observer was created
			expect((component as any).observer).toBeDefined();

			// Trigger disconnectedCallback
			component.disconnectedCallback();

			expect(disconnectMock).toHaveBeenCalled();

			// Re-disable mutation observer for other tests
			DvStepper.DISABLE_MUTATION_OBSERVER = true;
		});
	});

	describe('Slots', () => {
		it('should have the correct number of steps', async () => {
			const steps = stepperSpec.root.querySelectorAll('dv-step');
			// Check that there are 4 steps
			expect(steps.length).toBe(4);
		});
	});
});

