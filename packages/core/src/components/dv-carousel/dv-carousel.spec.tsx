import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvCarousel } from './dv-carousel';
import { DvCarouselItem } from '../dv-carousel-item/dv-carousel-item';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-carousel', () => {
	let carouselSpec: TypedSpecPage<DvCarousel>;

	// Initialize a new instance for DvCarousel
	beforeEach(async () => {
		carouselSpec = (await newSpecPage({
			components: [DvCarousel, DvCarouselItem],
			html: `
				<dv-carousel>
					<dv-carousel-item>item one</dv-carousel-item>
					<dv-carousel-item>item two</dv-carousel-item>
					<dv-carousel-item>item three</dv-carousel-item>
					<dv-carousel-item>item four</dv-carousel-item>
				</dv-carousel>
			`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvCarousel>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		carouselSpec = null;
	});

	describe('Initialization with default state', () => {
		it('should render the component', async () => {
			// Check that the component is rendered
			expect(carouselSpec.root).toBeTruthy();
		});
	});

	describe('Props', () => {
		it('should render navigation buttons when navigation prop is enabled', async () => {
			carouselSpec.root.navigation = true;
			await carouselSpec.waitForChanges();

			// Query navigation buttons
			const navButtons = carouselSpec.root.shadowRoot?.querySelectorAll('dv-icon-button');
			// Check that the navigation buttons are rendered
			expect(navButtons.length).toBe(2);
		});

		it('should not render navigation buttons when navigation prop is disabled', async () => {
			carouselSpec.root.navigation = false;
			await carouselSpec.waitForChanges();

			// Query navigation buttons
			const navButtons = carouselSpec.root.shadowRoot?.querySelectorAll('dv-icon-button');
			// Check that the navigation buttons are not rendered
			expect(navButtons.length).toBe(0);
		});

		it('should render correct number of pagination buttons when pagination prop is enabled', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.root.pagination = true;
			await carouselSpec.waitForChanges();

			// Query pagination buttons
			const paginationButtons = carouselSpec.root.shadowRoot?.querySelectorAll('div.pagination button');
			// Check that the pagination buttons are rendered
			expect(paginationButtons.length).toBe(4);
		});

		it('should not render pagination buttons when pagination prop is disabled', async () => {
			carouselSpec.root.pagination = false;
			await carouselSpec.waitForChanges();

			// Query pagination container
			const paginationContainer = carouselSpec.root.shadowRoot?.querySelector('div.pagination');
			// Check that the pagination container is not rendered
			expect(paginationContainer).toBeNull();
		});
	});

	describe('Events', () => {
		it('should emit slideChange event when carouselNext method is called', async () => {
			await carouselSpec.rootInstance.handleSlotChange();

			const slideChangeSpy = jest.spyOn(carouselSpec.rootInstance.slideChange, 'emit');
			await carouselSpec.rootInstance.carouselNext();
			// Check that the event was emitted with the correct index and with a slide
			expect(slideChangeSpy).toHaveBeenCalledWith({ index: 1, slide: expect.anything() });
			slideChangeSpy.mockRestore();
		});

		it('should emit slideChange event when carouselPrevious method is called', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.rootInstance.activeSlide = 3;
			await carouselSpec.waitForChanges();

			const slideChangeSpy = jest.spyOn(carouselSpec.rootInstance.slideChange, 'emit');
			await carouselSpec.rootInstance.carouselPrevious();
			// Check that the event was emitted with the correct index and with a slide
			expect(slideChangeSpy).toHaveBeenCalledWith({ index: 2, slide: expect.anything() });
			slideChangeSpy.mockRestore();
		});

		it('should not emit slideChange event when carouselNext is called while at last slide', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.rootInstance.activeSlide = 3;
			await carouselSpec.waitForChanges();

			const slideChangeSpy = jest.spyOn(carouselSpec.rootInstance.slideChange, 'emit');
			await carouselSpec.rootInstance.carouselNext();
			// Check that the event was not emitted
			expect(slideChangeSpy).not.toHaveBeenCalled();
			slideChangeSpy.mockRestore();
		});

		it('should not emit slideChange event when carouselPrevious is called while at first slide', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.rootInstance.activeSlide = 0;
			await carouselSpec.waitForChanges();

			const slideChangeSpy = jest.spyOn(carouselSpec.rootInstance.slideChange, 'emit');
			await carouselSpec.rootInstance.carouselPrevious();
			// Check that the event was not emitted
			expect(slideChangeSpy).not.toHaveBeenCalled();
			slideChangeSpy.mockRestore();
		});

		it('should not emit slideChange event when carouselGoToSlide is called on empty carousel', async () => {
			carouselSpec.root.innerHTML = `<dv-carousel></dv-carousel>`;
			await carouselSpec.waitForChanges();

			const slideChangeSpy = jest.spyOn(carouselSpec.rootInstance.slideChange, 'emit');
			await carouselSpec.rootInstance.carouselGoToSlide(2);
			// Check that the event was not emitted
			expect(slideChangeSpy).not.toHaveBeenCalled();
			slideChangeSpy.mockRestore();
		});
	});

	describe('Methods', () => {
		it('should set active slide to specified index when carouselGoToSlide is called with valid index', async () => {
			await carouselSpec.rootInstance.handleSlotChange();

			await carouselSpec.rootInstance.carouselGoToSlide(2);
			// Check that the event was emitted with the correct index and with a slide
			expect(carouselSpec.rootInstance.activeSlide).toBe(2);
		});

		it('should clamp active slide to 0 when carouselGoToSlide is called with negative index', async () => {
			await carouselSpec.rootInstance.handleSlotChange();

			await carouselSpec.rootInstance.carouselGoToSlide(-1);
			// Check that the event was emitted with the correct index and with a slide
			expect(carouselSpec.rootInstance.activeSlide).toBe(0);
		});

		it('should clamp active slide to highest index when carouselGoToSlide is called with too high index', async () => {
			await carouselSpec.rootInstance.handleSlotChange();

			await carouselSpec.rootInstance.carouselGoToSlide(5);
			// Check that the event was emitted with the correct index and with a slide
			expect(carouselSpec.rootInstance.activeSlide).toBe(3);
		});

		it('should navigate to previous slide when previous navigation button is clicked', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.root.navigation = true;
			carouselSpec.rootInstance.activeSlide = 3;
			await carouselSpec.waitForChanges();

			const navButtons = carouselSpec.root.shadowRoot.querySelectorAll('dv-icon-button');
			const nextButton = navButtons[0];

			expect(nextButton).not.toBeNull();
			expect(carouselSpec.rootInstance.activeSlide).toBe(3);

			nextButton.click();
			await carouselSpec.waitForChanges();

			expect(carouselSpec.rootInstance.activeSlide).toBe(2);
		});

		it('should navigate to previous slide when ArrowLeft key is pressed', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.rootInstance.activeSlide = 1;
			await carouselSpec.waitForChanges();
			expect(carouselSpec.rootInstance.activeSlide).toBe(1);

			// Create a new keyboard event
			const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
			const scrollContainer = carouselSpec.root.shadowRoot.querySelector('#scroll-container');
			scrollContainer.dispatchEvent(event);
			await carouselSpec.waitForChanges();

			// Check if the active slide is first index
			expect(carouselSpec.rootInstance.activeSlide).toBe(0);
		});

		it('should navigate to previous slide when ArrowDown key is pressed', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.rootInstance.activeSlide = 1;
			await carouselSpec.waitForChanges();
			expect(carouselSpec.rootInstance.activeSlide).toBe(1);

			// Create a new keyboard event
			const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
			const scrollContainer = carouselSpec.root.shadowRoot.querySelector('#scroll-container');
			scrollContainer.dispatchEvent(event);
			await carouselSpec.waitForChanges();

			// Check if the active slide is first index
			expect(carouselSpec.rootInstance.activeSlide).toBe(0);
		});

		it('should navigate to next slide when next navigation button is clicked', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.root.navigation = true;
			await carouselSpec.waitForChanges();

			// Query navigation buttons
			const navButtons = carouselSpec.root.shadowRoot.querySelectorAll('dv-icon-button');
			const nextButton = navButtons[1];

			// Check that the navigation button is rendered and active slide is 0
			expect(nextButton).not.toBeNull();
			expect(carouselSpec.rootInstance.activeSlide).toBe(0);

			// Simulate click
			nextButton.click();
			await carouselSpec.waitForChanges();

			expect(carouselSpec.rootInstance.activeSlide).toBe(1);
		});

		it('should navigate to next slide when ArrowRight key is pressed', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			await carouselSpec.waitForChanges();
			expect(carouselSpec.rootInstance.activeSlide).toBe(0);

			// Create a new keyboard event
			const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
			const scrollContainer = carouselSpec.root.shadowRoot.querySelector('#scroll-container');
			scrollContainer.dispatchEvent(event);
			await carouselSpec.waitForChanges();

			// Check if the active slide is first index
			expect(carouselSpec.rootInstance.activeSlide).toBe(1);
		});

		it('should navigate to next slide when ArrowUp key is pressed', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			await carouselSpec.waitForChanges();
			expect(carouselSpec.rootInstance.activeSlide).toBe(0);

			// Create a new keyboard event
			const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
			const scrollContainer = carouselSpec.root.shadowRoot.querySelector('#scroll-container');
			scrollContainer.dispatchEvent(event);
			await carouselSpec.waitForChanges();

			// Check if the active slide is first index
			expect(carouselSpec.rootInstance.activeSlide).toBe(1);
		});

		it('should navigate to first slide when Home key is pressed', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.rootInstance.activeSlide = 2;
			await carouselSpec.waitForChanges();
			expect(carouselSpec.rootInstance.activeSlide).toBe(2);

			// Create a new keyboard event
			const event = new KeyboardEvent('keydown', { key: 'Home' });
			const scrollContainer = carouselSpec.root.shadowRoot.querySelector('#scroll-container');
			scrollContainer.dispatchEvent(event);
			await carouselSpec.waitForChanges();

			// Check if the active slide is first index
			expect(carouselSpec.rootInstance.activeSlide).toBe(0);
		});

		it('should navigate to last slide when End key is pressed', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			await carouselSpec.waitForChanges();
			expect(carouselSpec.rootInstance.activeSlide).toBe(0);

			// Create a new keyboard event
			const event = new KeyboardEvent('keydown', { key: 'End' });
			const scrollContainer = carouselSpec.root.shadowRoot.querySelector('#scroll-container');
			scrollContainer.dispatchEvent(event);
			await carouselSpec.waitForChanges();

			// Check if the active slide is first index
			expect(carouselSpec.rootInstance.activeSlide).toBe(3);
		});

		it('should navigate to selected slide when pagination button is clicked', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.root.pagination = true;
			await carouselSpec.waitForChanges();

			// Query pagination buttons
			const paginationContainer = carouselSpec.root.shadowRoot?.querySelector('div.pagination');
			const paginationButtons = paginationContainer.querySelectorAll('button');
			// Query third button
			const pagButton3 = paginationButtons[2];

			// Check that the pagination button is rendered and active slide is 0
			expect(pagButton3).not.toBeNull();
			expect(carouselSpec.rootInstance.activeSlide).toBe(0);

			// Simulate click
			pagButton3.click();
			await carouselSpec.waitForChanges();

			expect(carouselSpec.rootInstance.activeSlide).toBe(2);
		});

		it('should correctly identify button elements with isButton method', async () => {
			await carouselSpec.waitForChanges();

			const buttonElement = document.createElement('button');
			const divElement = document.createElement('div');

			expect(carouselSpec.rootInstance.isButton(buttonElement)).toBe(true);
			expect(carouselSpec.rootInstance.isButton(divElement)).toBe(false);
		});

		it('should handle scrolling state correctly', async () => {
			await carouselSpec.waitForChanges();

			// Set scrolling state
			carouselSpec.rootInstance.scrolling = true;
			await carouselSpec.waitForChanges();

			const scrollContainer = carouselSpec.root.shadowRoot.querySelector('#scroll-container');
			expect(scrollContainer.getAttribute('aria-busy')).toBe('true');

			// Reset scrolling state
			carouselSpec.rootInstance.scrolling = false;
			await carouselSpec.waitForChanges();

			expect(scrollContainer.getAttribute('aria-busy')).toBe('false');
		});

		it('should handle keyboard events from non-button elements', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.root.pagination = true;
			await carouselSpec.waitForChanges();

			// Create keyboard event from a non-button element (like a div)
			const divElement = document.createElement('div');
			const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
			Object.defineProperty(event, 'target', { value: divElement, enumerable: true });

			// Spy on closest to return null (not in a button)
			const closestSpy = jest.spyOn(divElement, 'closest').mockReturnValue(null);

			const initialSlide = carouselSpec.rootInstance.activeSlide;
			await carouselSpec.rootInstance.handleKeyDown(event);
			await carouselSpec.waitForChanges();

			// Should still navigate normally but without focus management
			expect(carouselSpec.rootInstance.activeSlide).toBe(initialSlide + 1);

			closestSpy.mockRestore();
		});

		it('should handle keyboard events on pagination buttons themselves', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.root.pagination = true;
			await carouselSpec.waitForChanges();

			const paginationContainer = carouselSpec.root.shadowRoot?.querySelector('div.pagination');
			const paginationButtons = paginationContainer.querySelectorAll('button');
			const thirdButton = paginationButtons[2] as HTMLElement;

			thirdButton.focus = jest.fn();

			const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
			thirdButton.dispatchEvent(event);
			await carouselSpec.waitForChanges();

			// Should navigate to next slide and focus management should work
			expect(carouselSpec.rootInstance.activeSlide).toBe(1);
		});
	});

	describe('Slots', () => {
		it('should call handleSlotChange when slot content changes', async () => {
			const handleSlotChangeSpy = jest.spyOn(carouselSpec.rootInstance, 'handleSlotChange');
			const slotElement = carouselSpec.root.shadowRoot.querySelector('slot');
			const slotChangeEvent = new Event('slotchange');

			// Dispatch the slotchange event on the slot element
			slotElement.dispatchEvent(slotChangeEvent);
			await carouselSpec.waitForChanges();

			// Verify that handleSlotChange was called
			expect(handleSlotChangeSpy).toHaveBeenCalled();
			handleSlotChangeSpy.mockRestore();
		});

		it('should filter out inert and non-carousel-item elements from getSlides', async () => {
			const mixedContentSpec = (await newSpecPage({
				components: [DvCarousel, DvCarouselItem],
				html: `
					<dv-carousel>
						<dv-carousel-item>Valid item 1</dv-carousel-item>
						<div>Invalid div element</div>
						<dv-carousel-item>Valid item 2</dv-carousel-item>
						<span>Invalid span element</span>
					</dv-carousel>
				`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvCarousel>;

			// Manually set inert property on the second carousel item to test the inert filtering
			const carouselItems = mixedContentSpec.root.querySelectorAll('dv-carousel-item');
			(carouselItems[1] as any).inert = true;
			await mixedContentSpec.rootInstance.handleSlotChange();
			const slides = mixedContentSpec.rootInstance.getSlides();

			// Should filter out div, span, and inert carousel item
			expect(slides.length).toBe(1);
			expect(slides[0].textContent).toBe('Valid item 1');

			slides.forEach((slide) => {
				expect(slide.tagName.toLowerCase()).toBe('dv-carousel-item');
				expect(slide.inert).toBeFalsy();
			});
		});

		it('should handle null carousel slot in getSlides', async () => {
			// Set carousel to null to test the fallback case
			carouselSpec.rootInstance['carousel'] = null;

			const slides = carouselSpec.rootInstance.getSlides();
			expect(slides.length).toBe(0);
		});
	});

	describe('Accessibility', () => {
		it('should render component with correct accessibility attributes', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			const item = carouselSpec.root.querySelector('dv-carousel-item');

			expect(carouselSpec.rootInstance.host.getAttribute('role')).toBe('region');
			expect(carouselSpec.rootInstance.host.getAttribute('aria-label')).toBe('Carousel');
			expect(item.getAttribute('role')).toBe('group');
			expect(item.getAttribute('aria-label')).toBe('Slide number 1');
		});

		it('should render component with correct accessibility attributes when pagination is enabled', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.root.pagination = true;
			await carouselSpec.waitForChanges();
			await carouselSpec.rootInstance.handleSlotChange();

			// Query carousel item
			const item = carouselSpec.root.querySelector('dv-carousel-item');

			expect(item.getAttribute('role')).not.toBe('group');
			expect(item.id).toBe(`slide-${carouselSpec.rootInstance.activeSlide + 1}`);
			expect(item.getAttribute('role')).toBe('tabpanel');
			expect(item.getAttribute('aria-label')).toBeNull();
			expect(item.getAttribute('aria-labelledby')).toBe(`tab-${carouselSpec.rootInstance.activeSlide + 1}`);

			// Query pagination buttons
			const paginationButtons = carouselSpec.root.shadowRoot?.querySelectorAll('div.pagination button');
			const activePagButton = paginationButtons[carouselSpec.rootInstance.activeSlide];
			const inactivePagButton = paginationButtons[carouselSpec.rootInstance.activeSlide + 1];

			expect(activePagButton.getAttribute('aria-controls')).toBe(`slide-${carouselSpec.rootInstance.activeSlide + 1}`);
			expect(activePagButton.getAttribute('aria-label')).toBe(
				`Slide number ${carouselSpec.rootInstance.activeSlide + 1}`
			);

			expect(inactivePagButton.getAttribute('aria-label')).toBe(
				`Go to Slide ${carouselSpec.rootInstance.activeSlide + 2}`
			);
		});

		it('should render pagination buttons with correct tabIndex when slide changes', async () => {
			await carouselSpec.rootInstance.handleSlotChange();
			carouselSpec.root.pagination = true;
			await carouselSpec.waitForChanges();

			const paginationContainer = carouselSpec.root.shadowRoot?.querySelector('div.pagination');
			let paginationButtons = paginationContainer.querySelectorAll('button');

			expect(paginationButtons[0].getAttribute('tabIndex')).toBe('0');
			expect(paginationButtons[1].getAttribute('tabIndex')).toBe('-1');
			expect(paginationButtons[2].getAttribute('tabIndex')).toBe('-1');
			expect(paginationButtons[3].getAttribute('tabIndex')).toBe('-1');

			await carouselSpec.rootInstance.carouselGoToSlide(2);
			await carouselSpec.waitForChanges();

			paginationButtons = paginationContainer.querySelectorAll('button');
			expect(paginationButtons[0].getAttribute('tabIndex')).toBe('-1');
			expect(paginationButtons[1].getAttribute('tabIndex')).toBe('-1');
			expect(paginationButtons[2].getAttribute('tabIndex')).toBe('0');
			expect(paginationButtons[3].getAttribute('tabIndex')).toBe('-1');
		});
	});
});

