import type { EventEmitter } from '@stencil/core';
import { Component, Host, h, Prop, Element, Event, Listen, Method, Watch } from '@stencil/core';
import { STEP_SELECTED_EVENT } from '../../events';
import type { StepSelectedEventDetail } from '../../events';

/**
 * ## Overview
 * The Stepper component manages a sequence of [dv-step](/docs/components-step--docs), controlling their state and
 * progression. It requires `dv-step` components as children to function properly.
 *
 * The component orchestrates step navigation and state management while providing both linear and
 * non-linear progression options.
 *
 * Steppers maintain the current selection state and handle all step interactions, ensuring proper progression
 * through the sequence while managing accessibility requirements.
 *
 * The `<dv-stepper>` component supports these interaction patterns:
 * - **Linear Flow**: Sequential step progression
 * - **Non-linear Flow**: Free navigation between steps
 * - **Step Selection**: Click or keyboard navigation
 * - **Progress Tracking**: Visual step completion
 * - **Dynamic Updates**: Handles step addition/removal
 *
 * ## Accessibility
 * - Maintains sequential navigation.
 * - Proper step labeling and numbering.
 * - Keyboard navigation support when clickable.
 * - Clear visual progression.
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [dv-step](/docs/components-step--docs)
 * - [WAI-ARIA Progress Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/progress/)
 *
 * ## Dependencies
 * | Component | Purpose |
 * |---|---|
 * | `<dv-step>` | Child components used to render each step in the sequence. |
 *
 * @summary A multi-step sequence manager that orchestrates dv-step components.
 *
 * @tag dv-stepper
 *
 * @slot - Container for `dv-step` components.
 */
@Component({
	tag: 'dv-stepper',
	shadow: true,
	styleUrl: 'dv-stepper.scss'
})
export class DvStepper {
	@Element() hostElement!: HTMLDvStepperElement;

	/** @internal */
	/** The index of the currently selected step. */
	@Prop({ mutable: true }) selectedIndex: number = 0;

	/** @internal */
	/** When true, enables click navigation between steps. */
	@Prop({ mutable: true }) clickable: boolean = false;

	/** Emitted when the selected step changes. */
	@Event({ eventName: STEP_SELECTED_EVENT }) stepSelected: EventEmitter<StepSelectedEventDetail>;

	private observer?: MutationObserver;

	/** Flags to disable the MutationObserver for unit tests. */
	static DISABLE_MUTATION_OBSERVER = false;

	/** Returns all child dv-step elements within the stepper. */
	private getSteps(): HTMLDvStepElement[] {
		return Array.from(this.hostElement.querySelectorAll('dv-step'));
	}

	/** @private */
	/** Sets the selected step to the specified index. */
	@Method()
	async stepperSetSelectedIndex(index: number) {
		if (index !== this.selectedIndex) {
			const steps = this.getSteps();
			if (index >= 0 && index < steps.length) {
				this.selectedIndex = index;
				this.updateSteps();
				this[STEP_SELECTED_EVENT].emit(index);
			}
		}
	}

	/** Handles selectedIndex changes by updating steps and emitting the step selected event. */
	/** @private */
	@Watch('selectedIndex')
	selectedIndexHandler() {
		this.updateSteps();
		this[STEP_SELECTED_EVENT].emit(this.selectedIndex);
	}

	/** Handles selectedChanged events bubbled up from child dv-step components. */
	/** @private */
	@Listen('selectedChanged')
	onStepSelectionChanged(event: CustomEvent<HTMLDvStepElement>) {
		const eventTarget = event.detail;
		const steps = this.getSteps();
		const clickIndex = steps.findIndex((step) => step === eventTarget);

		if (clickIndex >= 0) {
			const clientEvent = this[STEP_SELECTED_EVENT].emit(clickIndex);

			if (!clientEvent.defaultPrevented) {
				this.selectedIndex = clickIndex;
				this.updateSteps();
			}
		}
	}

	/** Syncs clickable, selected, position, and index properties across all child dv-step elements. */
	private updateSteps() {
		const steps = this.getSteps();

		steps.forEach((step, index) => {
			step.clickable = this.clickable;
			step.selected = this.selectedIndex === index;

			// Set position property for each step
			if (steps.length === 1) {
				step.position = 'single';
			} else if (index === 0) {
				step.position = 'first';
			} else if (index === steps.length - 1) {
				step.position = 'last';
			} else {
				step.position = 'inner';
			}
			// Pass the index (starting from 1) to dv-step
			step.index = index + 1;
		});
	}

	/** @private */
	componentWillLoad() {
		this.updateSteps();
	}

	/** @private */
	componentDidLoad() {
		// Set the initial selected index after the component has loaded
		void this.stepperSetSelectedIndex(this.selectedIndex);
		// Create mutation observer to handle dynamic changes to steps
		/* istanbul ignore next */
		if (!DvStepper.DISABLE_MUTATION_OBSERVER) {
			this.observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (mutation.type === 'childList') {
						this.updateSteps();
					}
				}
			});

			this.observer.observe(this.hostElement, { childList: true, subtree: true });
		}
	}

	/** @private */
	disconnectedCallback() {
		if (this.observer) {
			this.observer.disconnect();
		}
	}

	/** @private */
	componentDidRender() {
		this.updateSteps();
	}

	/** @private */
	render() {
		return (
			<Host>
				<div>
					<slot></slot>
				</div>
			</Host>
		);
	}
}

