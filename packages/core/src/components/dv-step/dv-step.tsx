import type { EventEmitter } from '@stencil/core';
import { Component, Host, h, Prop, Event, Element } from '@stencil/core';
import { SELECTED_CHANGED_EVENT } from '../../events';
import type { SelectedChangedEventDetail } from '../../events';

/**
 * ## Overview
 * The Step component represents an individual step within an `dv-stepper` component sequence. It must be used
 * as a child of the `<dv-stepper>` component and cannot function independently.
 *
 * The component manages its own state and visual representation while receiving direction from its parent
 * stepper component for progression and interaction handling.
 *
 * Steps maintain proper ARIA roles and states to ensure accessibility while providing clear visual indication
 * of their current status in the sequence.
 *
 * The `<dv-step>` component supports these display patterns:
 * - **Number Display**: Shows step position in sequence
 * - **Label Content**: Descriptive text via slot
 * - **Status States**: Visual indication of progress
 * - **Interactive**: Click handling when enabled
 * - **Progress**: Completion indication
 *
 * ## Accessibility
 * - Uses proper ARIA roles for step indication.
 * - Maintains keyboard navigation when enabled.
 * - Shows clear visual progression.
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [dv-stepper](/docs/components-stepper--docs)
 * - [WAI-ARIA Progress Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/progress/)
 *
 * ## Dependencies
 * | Component | Purpose |
 * |---|---|
 * | `<dv-icon>` | Required parent component that manages the step |
 *
 * @summary An individual step item within an dv-stepper sequence.
 *
 * @tag dv-step
 *
 * @slot - Content for the step label.
 */
@Component({
	tag: 'dv-step',
	styleUrl: 'dv-step.scss',
	shadow: true
})
export class DvStep {
	@Element() hostElement!: HTMLDvStepElement;

	/** Visual variant of the step */
	@Prop() variant: 'completed' | 'active' | 'default' | 'error' = 'default';

	/** Indicates whether the step is currently selected */
	/** @internal Controlled by the parent stepper. */
	@Prop() selected: boolean = false;

	/** Enables click interaction for the step */
	/** @internal Controlled by the parent stepper. */
	@Prop() clickable: boolean = false;

	/** Position of the step within the stepper (internal) */
	/** @internal Computed by the parent stepper. */
	@Prop() position: 'first' | 'last' | 'single' | 'inner' = 'inner';

	/** (Circle Number) Index of the step (starting from 1) */
	/** @internal Assigned by the parent stepper. */
	@Prop() index: number = 1;

	/** Emitted when the step is clicked. Contains the step element in `event.detail`. */
	@Event({ eventName: SELECTED_CHANGED_EVENT }) selectedChanged: EventEmitter<SelectedChangedEventDetail>;

	private get baseIconClasses() {
		return 'w-10 h-10 flex items-center justify-center rounded-radius-full body-default m-1';
	}

	private handleClick() {
		if (this.clickable) {
			this[SELECTED_CHANGED_EVENT].emit(this.hostElement);
		}
	}

	/** @private */
	render() {
		// Label Class
		let labelClass = 'text-subtle';
		switch (this.variant) {
			case 'error':
				labelClass = 'text-status-error';
				break;
			case 'completed':
				labelClass = 'text-default';
				break;
			case 'active':
				labelClass = 'text-brand';
				break;
		}

		// Icon Element
		let iconElement;
		switch (this.variant) {
			case 'error':
				iconElement = (
					<div class={`${this.baseIconClasses} border-width-md border-status-error bg-default text-status-error`}>
						<dv-icon name="triangle-exclamation" color="error" size="xs" class="scale-[1.4]" />
					</div>
				);
				break;
			case 'completed':
				iconElement = (
					<div
						class={`${this.baseIconClasses} border-width-md border-status-success bg-status-success-knockout text-status-success-knockout`}
					>
						<dv-icon name="check" size="xs" class="scale-150" />
					</div>
				);
				break;
			case 'active':
				iconElement = (
					<div class="rounded-radius-full border-width-md border-brand inline-block m-1 bg-default">
						<div class="size-8 flex items-center justify-center rounded-radius-full border border-knockout bg-brand-knockout text-brand-knockout body-default m-0.5">
							{this.index}
						</div>
					</div>
				);
				break;
			default:
				iconElement = (
					<div class={`${this.baseIconClasses} border-width-md border-default bg-default text-subtle`}>
						{this.index}
					</div>
				);
		}

		return (
			<Host
				tabIndex={this.clickable ? 0 : -1}
				onClick={() => this.handleClick()}
				class={{
					step: true,
					'step-selected': this.selected,
					'step-clickable': this.clickable,
					[`step-position-${this.position}`]: true,
					[`step-variant-${this.variant}`]: true
				}}
			>
				<div class="flex flex-row items-start space-x-4 space-y-3">
					{/* Icon & connector wrapper */}
					<div class="relative flex flex-col items-center min-h-20">
						{' '}
						{/* adjust min-h for spacing */}
						{/* Top line */}
						{(this.position === 'inner' || this.position === 'last') && (
							<div class="absolute top-0 h-1/2 w-0.5 bg-strong z-0" />
						)}
						{/* Circle */}
						<div class="z-10">{iconElement}</div>
						{/* Bottom line */}
						{(this.position === 'first' || this.position === 'inner') && (
							<div class="absolute bottom-0 h-1/2 w-0.5 bg-strong z-0" />
						)}
					</div>

					{/* Label */}
					<div class={`body-default ${labelClass}`}>
						<slot></slot>
					</div>
				</div>
			</Host>
		);
	}
}

