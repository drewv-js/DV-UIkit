import type { EventEmitter } from '@stencil/core';
import { Component, Event, h, Host, Prop, Watch } from '@stencil/core';

/**
 * Binary on/off control rendered as a switch.
 *
 * @slot - Optional label text; falls back to the `label` prop.
 */
@Component({
	tag: 'dv-toggle',
	styleUrl: 'toggle.scss',
	shadow: true
})
export class DvToggle {
	/** Visible label text used when no slotted content is provided. */
	@Prop({ reflect: true }) label: string = 'DvToggle';

	/** Whether the toggle is currently on. */
	@Prop({ mutable: true, reflect: true }) checked: boolean = false;

	/** Disables interaction when true. */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** Name attribute forwarded to the internal checkbox input. */
	@Prop() name: string = 'dv-toggle';

	/** Value submitted when used in a native form and checked. */
	@Prop() value: string = 'on';

	/** Emits when the checked state changes due to user interaction. */
	@Event() dvChange!: EventEmitter<boolean>;

	private inputEl?: HTMLInputElement;

	@Watch('checked')
	watchChecked(newValue: boolean) {
		if (this.inputEl) {
			this.inputEl.checked = newValue;
		}
	}

	private handleInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		this.checked = target.checked;
		this.dvChange.emit(this.checked);
	};

	render() {
		const wrapperClasses = `inline-flex items-center gap-2 select-none ${
			this.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
		}`;

		const trackColorClasses = this.checked
			? 'border-blue-600 bg-blue-600'
			: 'border-neutral-300 bg-neutral-300';

		const thumbPositionClasses = this.checked ? 'translate-x-4' : 'translate-x-0';

		return (
			<Host>
				<label class={wrapperClasses}>
					<input
						ref={(el) => {
							this.inputEl = el as HTMLInputElement;
						}}
						type="checkbox"
						class="peer sr-only"
						name={this.name}
						value={this.value}
						checked={this.checked}
						disabled={this.disabled}
						onInput={this.handleInput}
					/>
					<span
						class={`relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 ${trackColorClasses}`}
						aria-hidden="true"
					>
						<span
							class={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-150 ${thumbPositionClasses}`}
						></span>
					</span>
					<span class="text-sm text-neutral-700 peer-disabled:text-neutral-400">
						<slot>{this.label}</slot>
					</span>
				</label>
			</Host>
		);
	}
}
