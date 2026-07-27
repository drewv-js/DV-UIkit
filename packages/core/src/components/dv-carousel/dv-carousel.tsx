import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { SLIDE_CHANGE_EVENT } from '../../events';
import type { SlideChangeEventDetail } from '../../events';

/**
 * ## Overview
 * The Carousel component displays custom content within a series of navigable slides using CarouselItems.
 *
 * ## Accessibility
 * - Uses `role="group"`
 *
 * ## Resources
 * - [WAI-ARIA Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
 *
 * ## Dependencies
 * | Component          | Purpose                                        |
 * |--------------------|------------------------------------------------|
 * | `<dv-icon-button>`  | Used for the navigation buttons when displayed |
 *
 * @summary A navigable carousel that displays a series of `<dv-carousel-item>` slides with optional navigation and pagination controls.
 *
 * @tag dv-carousel
 *
 * @slot - Content displayed within the Carousel, in the form of one or more `<dv-carousel-item>` elements.
 */
@Component({
	tag: 'dv-carousel',
	styleUrl: 'dv-carousel.scss',
	shadow: true
})
export class DvCarousel {
	private carousel: HTMLSlotElement;
	private scrollContainer: HTMLElement;
	private paginationContainer: HTMLElement;
	private prevEnabled = false;
	private nextEnabled = false;

	/** @internal */
	@Element() host!: HTMLDvCarouselElement;

	/** Shows previous/next navigation arrow buttons. */
	@Prop() navigation: boolean = false;

	/** Shows pagination dot indicators below the carousel. */
	@Prop() pagination: boolean = false;

	/** @internal */
	@State() activeSlide = 0;

	/** @internal */
	@State() slides: HTMLDvCarouselItemElement[] = [];

	/** @internal */
	@State() scrolling = false;

	/** Emitted when the active slide changes. */
	@Event({ eventName: SLIDE_CHANGE_EVENT }) slideChange!: EventEmitter<SlideChangeEventDetail>;

	/** Navigates to the previous slide. */
	@Method()
	async carouselPrevious(): Promise<void> {
		if (!this.prevEnabled) return;
		await this.carouselGoToSlide(this.activeSlide - 1);
	}

	/** Navigates to the next slide. */
	@Method()
	async carouselNext(): Promise<void> {
		if (!this.nextEnabled) return;
		await this.carouselGoToSlide(this.activeSlide + 1);
	}

	/** Navigates to the slide specified by the given index. */
	@Method()
	async carouselGoToSlide(index) {
		const slides = this.getSlides();

		if (!slides.length) {
			return;
		}

		const newActiveSlide = this.getClampedValue(index, 0, slides.length - 1);
		this.activeSlide = newActiveSlide;

		const nextSlide = slides[newActiveSlide];
		this.scrollToSlide(nextSlide as unknown as HTMLElement);
	}

	/** @private */
	@Watch('activeSlide')
	handleActiveSlideChange() {
		this.setNavigation();

		this[SLIDE_CHANGE_EVENT].emit({ index: this.activeSlide, slide: this.slides[this.activeSlide] });
	}

	/** @private */
	componentDidLoad() {
		this.scrollToSlide(this.slides[this.activeSlide]);
		this.host.setAttribute('role', 'region');
		this.host.setAttribute('aria-label', 'Carousel');
	}

	/** @private */
	handleSlotChange() {
		this.setNavigation();
		this.slides = this.getSlides();
		this.slides.forEach((slide, index) => {
			slide.setAttribute('role', 'group');
			slide.setAttribute('aria-label', `Slide number ${index + 1}`);
			if (this.pagination) {
				slide.setAttribute('id', `slide-${index + 1}`);
				slide.setAttribute('role', 'tabpanel');
				slide.removeAttribute('aria-label');
				slide.setAttribute('aria-labelledby', `tab-${index + 1}`);
			}
		});
	}

	/** @private */
	handleKeyDown = async (event: KeyboardEvent) => {
		if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
			const target = event.target as HTMLElement;
			const focusInPagination = target.closest('button') != null;
			const isNext = event.key === 'ArrowUp' || event.key === 'ArrowRight';
			const isPrevious = event.key === 'ArrowDown' || event.key === 'ArrowLeft';

			event.preventDefault();

			if (isNext) await this.carouselNext();

			if (isPrevious) await this.carouselPrevious();

			if (event.key === 'Home') await this.carouselGoToSlide(0);

			if (event.key === 'End') await this.carouselGoToSlide(this.getSlides().length - 1);

			if (focusInPagination) {
				const paginationItems = this.paginationContainer.querySelectorAll('button');
				const activePaginationItem = paginationItems[this.activeSlide];

				if (activePaginationItem) {
					activePaginationItem.focus();
				}
			}
		}
	};

	/** @private */
	isButton(item: HTMLElement) {
		return item.tagName.toLowerCase() === 'button';
	}

	/** @private */
	setNavigation() {
		this.prevEnabled = this.canScrollPrev();
		this.nextEnabled = this.canScrollNext();
	}

	/** @private */
	canScrollPrev() {
		return this.activeSlide > 0;
	}

	/** @private */
	canScrollNext() {
		return this.activeSlide < this.getSlides().length - 1;
	}

	/** @private */
	isCarouselItem(item: HTMLElement) {
		return item.tagName.toLowerCase() === 'dv-carousel-item';
	}

	/** @private */
	getSlides() {
		const assignedElements = this.carousel?.assignedElements?.({ flatten: true }) ?? [];
		return [...assignedElements].filter((el: HTMLElement) => {
			if (el.inert || !this.isCarouselItem(el)) {
				return false;
			}
			return true;
		}) as unknown as HTMLDvCarouselElement[];
	}

	/* istanbul ignore next */
	/** @private */
	scrollToSlide(slide: HTMLElement, behavior: ScrollBehavior = 'smooth') {
		window.requestAnimationFrame(() => {
			if (!this.scrollContainer) {
				return;
			}

			const scrollContainer = this.scrollContainer;
			const scrollContainerRect = scrollContainer.getBoundingClientRect();
			const nextSlideRect = slide.getBoundingClientRect();

			const nextLeft = nextSlideRect.left - scrollContainerRect.left;
			const nextTop = nextSlideRect.top - scrollContainerRect.top;

			if (nextLeft || nextTop) {
				scrollContainer.scrollTo({
					left: nextLeft + scrollContainer.scrollLeft,
					top: nextTop + scrollContainer.scrollTop,
					behavior
				});
			}
		});
	}

	/** @private */
	getClampedValue(value, min, max) {
		if (value < min) {
			return min;
		}
		if (value > max) {
			return max;
		}
		return value;
	}

	/** @private */
	render() {
		return (
			<Host>
				<div
					class={`carousel grid grid-cols-[min-content_1fr_min-content] grid-rows-[1fr_min-content] items-center min-h-full min-w-full relative py-4 ${this.navigation ? 'gap-x-4' : ''} ${this.pagination ? 'gap-y-4' : ''}`}
				>
					<div
						id="scroll-container"
						ref={(el) => (this.scrollContainer = el as HTMLElement)}
						class={
							'slides scrollbar-hidden grid grid-flow-col auto-cols-[100%] auto-rows-[100%] size-full overflow-auto overflow-y-hidden overscroll-x-contain snap-mandatory snap-x relative rounded-radius-lg focus:outline-width-lg focus:-outline-offset-2 focus-visible:outline-width-lg focus:outline-focus-ring-default focus-visible:ring-focus-ring-default'
						}
						aria-busy={this.scrolling ? 'true' : 'false'}
						aria-atomic="true"
						onKeyDown={(event) => void this.handleKeyDown(event)}
					>
						<slot
							ref={(el) => (this.carousel = el as HTMLSlotElement)}
							onSlotchange={() => this.handleSlotChange()}
						></slot>
					</div>
					{this.navigation && (
						<div class={'contents'}>
							<dv-icon-button
								class={
									'col-start-1 col-end-auto row-start-1 row-end-auto auto-cols-min flex flex-none items-center ml-2 text-default'
								}
								name="chevron-left"
								size="md"
								disabled={!this.prevEnabled}
								onClick={() => void this.carouselPrevious()}
								aria-label="Previous slide"
								aria-controls="scroll-container"
								aria-disabled={this.prevEnabled ? 'false' : 'true'}
							></dv-icon-button>
							<dv-icon-button
								class={
									'col-start-3 col-end-auto row-start-1 row-end-auto flex flex-none items-center mr-2 text-default'
								}
								name="chevron-right"
								size="md"
								disabled={!this.nextEnabled}
								onClick={() => void this.carouselNext()}
								aria-label="Next slide"
								aria-controls="scroll-container"
								aria-disabled={this.nextEnabled ? 'false' : 'true'}
							></dv-icon-button>
						</div>
					)}
					{this.pagination && (
						<div
							class={'pagination flex flex-wrap row-start-2 col-span-3 gap-2 justify-center'}
							ref={(el) => (this.paginationContainer = el as HTMLElement)}
						>
							{this.slides.map((_, index) => (
								<button
									class={`block cursor-pointer bg-none rounded-full p-0 m-0 ${index === this.activeSlide ? 'bg-brand-knockout size-4' : 'bg-brand border-width-sm border-default size-3.5'} focus:outline-width-lg focus:-outline-offset-0 focus-visible:outline-width-lg focus:outline-focus-ring-default focus-visible:ring-focus-ring-default`}
									onClick={() => void this.carouselGoToSlide(index)}
									aria-controls={`slide-${index + 1}`}
									aria-label={`${index === this.activeSlide ? 'Slide number ' + (index + 1) : 'Go to Slide ' + (index + 1)}`}
									tabIndex={index === this.activeSlide ? 0 : -1}
									onKeyDown={(event) => void this.handleKeyDown(event)}
								></button>
							))}
						</div>
					)}
				</div>
			</Host>
		);
	}
}

