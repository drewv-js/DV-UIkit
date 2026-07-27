import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { SHOW_EVENT, HIDE_EVENT } from '../../events';

/**
 * ## Overview
 * The detail component consists of two slots, the first of which expands to show the second. It is intended as a
 * summary before expanding to show more content when the user interacts with the summary.
 *
 * At this time, the detail component **does not** support interactive elements (such as buttons or links) within the summary.
 *
 * ## Accessibility
 * - Uses native `<details>` and `<summary>` elements
 * - `aria-expanded` reflects open/closed state
 * - Keyboard navigation: Space/Enter to toggle, Arrow keys to open/close
 * - Focus management via `setFocus()` method
 *
 * ## Resources
 * - [dv-icon](/docs/components-icon--docs)
 *
 * ## Dependencies
 * | Component    | Purpose                              |
 * |--------------|--------------------------------------|
 * | `<dv-icon>`   | Used for start and end chevron icons |
 *
 * @summary An expandable detail/summary component that reveals hidden content on user interaction.
 *
 * @tag dv-detail
 *
 * @slot - Content displayed under the summary, hidden until the user interacts with the summary.
 * @slot summary - Content displayed within the summary of the Detail component.
 */
@Component({
	tag: 'dv-detail',
	styleUrl: 'dv-detail.scss',
	shadow: { delegatesFocus: true }
})
export class DvDetail {
	private summary: HTMLElement;
	private details: HTMLDetailsElement;

	@Element() host: HTMLDvDetailElement;

	/** Controls whether the detail content is expanded. */
	@Prop({ reflect: true, mutable: true }) open: boolean = false;

	/** Position of the expand/collapse chevron icon. Accepts `'start'` or `'end'`. Defaults to `'end'`. */
	@Prop({ mutable: true }) iconPlacement: 'start' | 'end' = 'end';

	@State() isOpen: boolean = false;

	/** Emitted when the detail content is shown. */
	@Event({ eventName: SHOW_EVENT }) show!: EventEmitter<void>;

	/** Emitted when the detail content is hidden. */
	@Event({ eventName: HIDE_EVENT }) hide!: EventEmitter<void>;

	componentDidLoad() {
		this.isOpen = this.open;
		if (!this.isOpen) {
			this.details.open = false;
		}
	}

	/** @private */
	@Watch('open')
	handleOpenChange() {
		if (this.open) {
			this.isOpen = true;
			this.details.open = true;
			const showEvent = this[SHOW_EVENT].emit();
			if (showEvent.defaultPrevented) {
				this.open = false;
				this.details.open = false;
				return;
			}
		} else {
			const hideEvent = this[HIDE_EVENT].emit();
			if (hideEvent.defaultPrevented) {
				this.details.open = true;
				this.open = true;
				return;
			}
			this.isOpen = false;
			this.details.open = false;
		}
	}

	/** Programmatically shows the detail content. */
	@Method()
	async detailShow(): Promise<void> {
		this.open = true;
	}

	/** Programmatically hides the detail content. */
	@Method()
	async detailHide(): Promise<void> {
		this.open = false;
	}

	/** Programmatically focuses the summary element. */
	@Method()
	async setFocus(): Promise<void> {
		this.summary?.focus();
	}

	handleSummaryClick = async (event: MouseEvent) => {
		event.preventDefault();
		if (this.open) await this.detailHide();
		else await this.detailShow();
	};

	handleSummaryKeyDown = async (event: KeyboardEvent) => {
		if ([' ', 'Enter'].includes(event.key)) {
			event.preventDefault();
			if (this.open) await this.detailHide();
			else await this.detailShow();
		}

		if (['ArrowUp', 'ArrowLeft'].includes(event.key)) {
			event.preventDefault();
			await this.detailHide();
		}

		if (['ArrowDown', 'ArrowRight'].includes(event.key)) {
			event.preventDefault();
			await this.detailShow();
		}
	};

	/** @private */
	render() {
		const iconRotateClass = this.isOpen ? 'rotate-180' : 'rotate-0';
		const iconPaddingClass =
			(this.isOpen && this.iconPlacement === 'end') || (!this.isOpen && this.iconPlacement === 'start')
				? 'pr-4'
				: 'pl-4';

		return (
			<Host>
				<details ref={(el) => (this.details = el as HTMLDetailsElement)}>
					<summary
						ref={(el) => (this.summary = el)}
						id="summary"
						role="button"
						aria-expanded={this.isOpen ? 'true' : 'false'}
						aria-controls="content"
						onClick={(event) => void this.handleSummaryClick(event)}
						onKeyDown={(event) => void this.handleSummaryKeyDown(event)}
						class={`flex items-center select-none cursor-pointer p-4 focus:outline-width-lg focus:-outline-offset-2 focus-visible:outline focus-visible:outline-width-lg focus:outline-focus-ring-default focus-visible:ring-focus-ring-default ${this.iconPlacement === 'start' ? 'flex-row-reverse' : ''}`}
					>
						<div class="flex flex-auto items-center">
							<slot name="summary"></slot>
						</div>
						<dv-icon
							size="xs"
							name="chevron-down"
							class={`${iconRotateClass} ${iconPaddingClass} text-default`}
						></dv-icon>
					</summary>
					<div
						id="content"
						aria-hidden={this.isOpen ? 'false' : 'true'}
						aria-labelledby="summary"
						role="region"
						class={'overflow-hidden block'}
					>
						<slot></slot>
					</div>
				</details>
			</Host>
		);
	}
}

