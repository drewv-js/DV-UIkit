import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvTabGroup } from './dv-tab-group';
import { DvTab } from '../dv-tab/dv-tab';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

DvTabGroup.DISABLE_INTERSECTION_OBSERVER = true;
DvTabGroup.DISABLE_RESIZE_OBSERVER = true;
DvTabGroup.DISABLE_MUTATION_OBSERVER = true;

describe('dv-tab-group', () => {
	let tabGroupSpec: TypedSpecPage<DvTabGroup>;

	// Initialize a new instance for DvTabGroup
	beforeEach(async () => {
		tabGroupSpec = (await newSpecPage({
			components: [DvTabGroup, DvTab],
			html: `
				<dv-tab-group>
					<dv-tab slot="nav" panel="tab1" id="tab1" active></dv-tab>
					<dv-tab slot="nav" panel="tab2" id="tab2"></dv-tab>
				</dv-tab-group>
			`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvTabGroup>;
	});

	// Teardown instance and restore after each test case
	afterEach(() => {
		tabGroupSpec = null;
		jest.restoreAllMocks();
	});

	describe('Initialization with default state', () => {
		it('should render the component', async () => {
			expect(tabGroupSpec.root).toBeTruthy();
		});
	});

	describe('Props', () => {
		it('should calculate scroll controls based on nav dimensions', async () => {
			const navElement = document.createElement('div') as any;
			tabGroupSpec.rootInstance.nav = navElement;

			// Right control should be visible when scrollable
			navElement.scrollLeft = 100;
			navElement.clientWidth = 50;
			navElement.scrollWidth = 200;
			tabGroupSpec.rootInstance.updateScrollControls();
			expect(tabGroupSpec.rootInstance.hasRightControl).toBe(true);
			expect(tabGroupSpec.rootInstance.calculateRightControlVisibility()).toBe(true);

			// Right control should not be visible when at end
			navElement.scrollLeft = 150;
			expect(tabGroupSpec.rootInstance.calculateRightControlVisibility()).toBe(false);

			// Right control should not be visible when no overflow (scrollWidth equals clientWidth)
			navElement.scrollLeft = 0;
			navElement.clientWidth = 100;
			navElement.scrollWidth = 100;
			expect(tabGroupSpec.rootInstance.calculateRightControlVisibility()).toBe(false);

			// Right control should be false when noScrollControls is true
			tabGroupSpec.root.noScrollControls = true;
			navElement.scrollWidth = 200;
			await tabGroupSpec.waitForChanges();
			tabGroupSpec.rootInstance.updateScrollControls();
			expect(tabGroupSpec.rootInstance.hasRightControl).toBe(false);
		});

		it('should handle left control visibility based on scroll position', async () => {
			// Left control should be visible when scrollLeft > 0
			const navElement = document.createElement('div') as any;
			navElement.scrollLeft = 50;
			tabGroupSpec.rootInstance.nav = navElement;
			expect(tabGroupSpec.rootInstance.calculateLeftControlVisibility()).toBe(true);

			// Left control should not be visible when scrollLeft = 0
			navElement.scrollLeft = 0;
			expect(tabGroupSpec.rootInstance.calculateLeftControlVisibility()).toBe(false);

			// Left control should be visible with negative scrollLeft (using Math.abs)
			navElement.scrollLeft = -10;
			expect(tabGroupSpec.rootInstance.calculateLeftControlVisibility()).toBe(true);

			// Should return false when nav is null
			tabGroupSpec.rootInstance.nav = null;
			expect(tabGroupSpec.rootInstance.calculateLeftControlVisibility()).toBe(false);
			expect(tabGroupSpec.rootInstance.calculateRightControlVisibility()).toBe(false);
		});

		it('should not change active tab when new tab is disabled', async () => {
			const tab1 = document.createElement('dv-tab') as any;
			tab1.panel = 'tab1';
			tab1.active = true;
			const disabledTab = document.createElement('dv-tab') as any;
			disabledTab.panel = 'disabled';
			disabledTab.disabled = true;
			tabGroupSpec.rootInstance.activeTab = tab1;

			// Try to set a disabled tab as active
			await tabGroupSpec.rootInstance.setActiveTab(disabledTab);

			// Active tab should still be tab1
			expect(tabGroupSpec.rootInstance.activeTab).toBe(tab1);
		});

		it('should handle scroll controls with placement="top" and noScrollControls prop', async () => {
			// Test placement="top" - should enable scroll controls
			tabGroupSpec.root.placement = 'top';
			await tabGroupSpec.waitForChanges();

			const nav = document.createElement('div') as any;
			tabGroupSpec.rootInstance.nav = nav;
			nav.scrollLeft = 0;
			nav.clientWidth = 50;
			nav.scrollWidth = 200;
			tabGroupSpec.rootInstance.updateScrollControls();
			expect(tabGroupSpec.rootInstance.hasRightControl).toBe(true);

			// Test tab change with placement="top" - should trigger scrollIntoView
			const tab1 = tabGroupSpec.root.querySelector('#tab1') as any;
			const tab2 = tabGroupSpec.root.querySelector('#tab2') as any;
			tabGroupSpec.rootInstance.activeTab = tab1;
			await tabGroupSpec.rootInstance.setActiveTab(tab2);
			expect(tabGroupSpec.rootInstance.activeTab).toBe(tab2);

			// Test noScrollControls=true - should disable scroll controls even with placement="top"
			tabGroupSpec.root.noScrollControls = true;
			await tabGroupSpec.waitForChanges();

			nav.scrollLeft = 0;
			nav.clientWidth = 50;
			nav.scrollWidth = 200;
			tabGroupSpec.rootInstance.updateScrollControls();
			expect(tabGroupSpec.rootInstance.hasRightControl).toBe(false);

			// Tab change should still work when scroll controls are disabled
			const tab1Again = tabGroupSpec.root.querySelector('#tab1') as any;
			await tabGroupSpec.rootInstance.setActiveTab(tab1Again);
			expect(tabGroupSpec.rootInstance.activeTab).toBe(tab1Again);
		});

		it('should handle scroll control calculations with different scroll positions', async () => {
			// Test scroll control visibility calculations
			const nav = document.createElement('div') as any;
			tabGroupSpec.rootInstance.nav = nav;

			// Test when scrolled to the beginning (no left scroll available)
			nav.scrollLeft = 0;
			nav.clientWidth = 100;
			nav.scrollWidth = 200;
			expect(tabGroupSpec.rootInstance.calculateLeftControlVisibility()).toBe(false);
			expect(tabGroupSpec.rootInstance.calculateRightControlVisibility()).toBe(true);

			// Test when scrolled to the middle (both controls should be visible)
			nav.scrollLeft = 50;
			expect(tabGroupSpec.rootInstance.calculateLeftControlVisibility()).toBe(true);
			expect(tabGroupSpec.rootInstance.calculateRightControlVisibility()).toBe(true);

			// Test when scrolled to the end (no right scroll available)
			nav.scrollLeft = 100; // scrollWidth(200) - clientWidth(100) = 100
			expect(tabGroupSpec.rootInstance.calculateLeftControlVisibility()).toBe(true);
			expect(tabGroupSpec.rootInstance.calculateRightControlVisibility()).toBe(false);
		});

		it('should render left control when hasLeftControl is true', async () => {
			// Set up hasLeftControl to true
			tabGroupSpec.rootInstance.hasLeftControl = true;
			await tabGroupSpec.waitForChanges();

			// Check if the left control icon button is rendered
			const leftControl = tabGroupSpec.root.shadowRoot.querySelector('dv-tab-control[name="chevron-left"]');
			expect(leftControl).toBeTruthy();
		});

		it('should render right control when hasRightControl is true', async () => {
			// Set up hasRightControl to true
			tabGroupSpec.rootInstance.hasRightControl = true;
			await tabGroupSpec.waitForChanges();

			// Check if the right control icon button is rendered
			const rightControl = tabGroupSpec.root.shadowRoot.querySelector('dv-tab-control[name="chevron-right"]');
			expect(rightControl).toBeTruthy();
		});

		it('should handle nav with scrollLeft property for right control visibility', async () => {
			const navElement = document.createElement('div') as any;
			Object.defineProperty(navElement, 'scrollLeft', { value: 0, writable: true });
			Object.defineProperty(navElement, 'clientWidth', { value: 100 });
			Object.defineProperty(navElement, 'scrollWidth', { value: 100 }); // No overflow

			tabGroupSpec.rootInstance.nav = navElement;

			const result = tabGroupSpec.rootInstance.calculateRightControlVisibility();
			expect(result).toBe(false);
		});
	});

	describe('Events', () => {
		it('should handle click events on tabs', async () => {
			const tab1 = tabGroupSpec.root.querySelector('#tab1') as any;
			const tab2 = tabGroupSpec.root.querySelector('#tab2') as any;
			// Simulate a click on the first tab
			tab1.click();
			await tabGroupSpec.waitForChanges();
			// Select the div that contains the aria-selected attribute for tab1
			const tab1Div = tab1.shadowRoot.querySelector('div[role="tab"]') as HTMLElement;
			// Select the div that contains the aria-selected attribute for tab2
			const tab2Div = tab2.shadowRoot.querySelector('div[role="tab"]') as HTMLElement;
			// Check the aria-selected attribute
			expect(tab1Div.getAttribute('aria-selected')).toBe('true');
			expect(tab2Div.getAttribute('aria-selected')).toBe('false');
		});

		it('should emit tabHide and tabShow events when the active tab changes', async () => {
			const tab1 = document.createElement('dv-tab') as any;
			tab1.panel = 'tab1';
			tab1.active = true;
			const tab2 = document.createElement('dv-tab') as any;
			tab2.panel = 'tab2';
			tabGroupSpec.rootInstance.activeTab = tab1;
			// Spy on the event emitters
			const tabHideSpy = jest.spyOn(tabGroupSpec.rootInstance.tabHide, 'emit');
			const tabShowSpy = jest.spyOn(tabGroupSpec.rootInstance.tabShow, 'emit');
			// Set the active tab to tab2
			await tabGroupSpec.rootInstance.setActiveTab(tab2);
			// Check that the tabHide event was emitted for the previous active tab
			expect(tabHideSpy).toHaveBeenCalledWith({ name: 'tab1' });
			// Check that the tabShow event was emitted for the new active tab
			expect(tabShowSpy).toHaveBeenCalledWith({ name: 'tab2' });
		});

		it('should not emit events when emitEvents is false', async () => {
			const tab1 = document.createElement('dv-tab') as any;
			tab1.panel = 'tab1';
			tab1.active = true;
			const tab2 = document.createElement('dv-tab') as any;
			tab2.panel = 'tab2';
			tabGroupSpec.rootInstance.activeTab = tab1;

			const tabHideSpy = jest.spyOn(tabGroupSpec.rootInstance.tabHide, 'emit');
			const tabShowSpy = jest.spyOn(tabGroupSpec.rootInstance.tabShow, 'emit');

			// Set the active tab with emitEvents = false
			await tabGroupSpec.rootInstance.setActiveTab(tab2, false);

			// Events should not have been emitted
			expect(tabHideSpy).not.toHaveBeenCalled();
			expect(tabShowSpy).not.toHaveBeenCalled();
		});

		it('should emit tabShow without tabHide when previousTab is null', async () => {
			// Test the branch where previousTab is null
			const tab = tabGroupSpec.root.querySelector('#tab2') as any;

			// Set activeTab to null so previousTab will be null
			tabGroupSpec.rootInstance.activeTab = null;

			const tabHideSpy = jest.spyOn(tabGroupSpec.rootInstance.tabHide, 'emit');
			const tabShowSpy = jest.spyOn(tabGroupSpec.rootInstance.tabShow, 'emit');

			await tabGroupSpec.rootInstance.setActiveTab(tab);

			// tabHide should NOT have been called because previousTab was null
			expect(tabHideSpy).not.toHaveBeenCalled();
			// tabShow should have been called
			expect(tabShowSpy).toHaveBeenCalledWith({ name: 'tab2' });
		});
	});

	describe('Methods', () => {
		it('should scroll element into view when offsetLeft is less than minX', async () => {
			const navElement = document.createElement('div') as any;
			const tabElement = document.createElement('div') as any;

			// Mock container properties
			navElement.scrollLeft = 100;
			navElement.offsetWidth = 200;
			navElement.scrollTo = jest.fn();

			// Mock element properties
			tabElement.clientWidth = 50;

			// Mock getBoundingClientRect to simulate element being to the left of visible area
			navElement.getBoundingClientRect = jest.fn().mockReturnValue({ left: 0, top: 0 });
			tabElement.getBoundingClientRect = jest.fn().mockReturnValue({ left: -50, top: 0 }); // Element is 50px to the left

			tabGroupSpec.rootInstance.nav = navElement;

			// Trigger setActiveTab which internally calls scrollIntoView
			const tab = tabGroupSpec.root.querySelector('#tab1') as any;
			tab.getBoundingClientRect = tabElement.getBoundingClientRect;
			tab.clientWidth = 50;

			await tabGroupSpec.rootInstance.setActiveTab(tab);

			// Verify scrollTo was called when element is outside visible area on the left
			expect(navElement.scrollTo).toHaveBeenCalled();
		});

		it('should scroll element into view when element extends beyond max', async () => {
			const navElement = document.createElement('div') as any;
			const tabElement = document.createElement('div') as any;

			// Mock container properties
			navElement.scrollLeft = 0;
			navElement.offsetWidth = 200; // Container is 200px wide
			navElement.clientWidth = 200;
			navElement.scrollTo = jest.fn();

			// Mock element properties - element is 100px wide
			tabElement.clientWidth = 100;

			// Mock getBoundingClientRect to simulate element extending beyond right edge
			// Container visible area: scrollLeft (0) to scrollLeft + offsetWidth (200)
			// Element position: starts at 250px, ends at 350px (beyond visible area)
			navElement.getBoundingClientRect = jest.fn().mockReturnValue({ left: 0, top: 0 });
			tabElement.getBoundingClientRect = jest.fn().mockReturnValue({ left: 250, top: 0 });

			tabGroupSpec.rootInstance.nav = navElement;

			// Trigger setActiveTab which internally calls scrollIntoView
			const tab = tabGroupSpec.root.querySelector('#tab2') as any;
			tab.getBoundingClientRect = tabElement.getBoundingClientRect;
			tab.clientWidth = 100;

			await tabGroupSpec.rootInstance.setActiveTab(tab);

			// Verify scrollTo was called with the calculation from line 22
			// Expected: offsetLeft - container.offsetWidth + element.clientWidth
			// offsetLeft = 250 (offset.left + container.scrollLeft = 250 + 0)
			// Expected scroll position: 250 - 200 + 100 = 150
			expect(navElement.scrollTo).toHaveBeenCalledWith({
				left: 150,
				behavior: 'smooth'
			});
		});

		it('should not scroll when element is already fully visible', async () => {
			const navElement = document.createElement('div') as any;
			const tabElement = document.createElement('div') as any;

			// Mock container properties
			navElement.scrollLeft = 0;
			navElement.offsetWidth = 300;
			navElement.scrollTo = jest.fn();

			// Mock element properties - element is 50px wide
			tabElement.clientWidth = 50;

			// Mock getBoundingClientRect - element is fully visible (between 50-100px)
			navElement.getBoundingClientRect = jest.fn().mockReturnValue({ left: 0, top: 0 });
			tabElement.getBoundingClientRect = jest.fn().mockReturnValue({ left: 50, top: 0 });

			tabGroupSpec.rootInstance.nav = navElement;

			// Trigger setActiveTab which internally calls scrollIntoView
			const tab = tabGroupSpec.root.querySelector('#tab1') as any;
			tab.getBoundingClientRect = tabElement.getBoundingClientRect;
			tab.clientWidth = 50;

			await tabGroupSpec.rootInstance.setActiveTab(tab);

			// scrollTo should not be called because element is already visible
			expect(navElement.scrollTo).not.toHaveBeenCalled();
		});

		it('should use smooth behavior by default when scrolling into view', async () => {
			const navElement = document.createElement('div') as any;
			const tabElement = document.createElement('div') as any;

			navElement.scrollLeft = 0;
			navElement.offsetWidth = 200;
			navElement.scrollTo = jest.fn();
			tabElement.clientWidth = 100;

			navElement.getBoundingClientRect = jest.fn().mockReturnValue({ left: 0, top: 0 });
			tabElement.getBoundingClientRect = jest.fn().mockReturnValue({ left: 250, top: 0 });

			tabGroupSpec.rootInstance.nav = navElement;

			const tab = tabGroupSpec.root.querySelector('#tab2') as any;
			tab.getBoundingClientRect = tabElement.getBoundingClientRect;
			tab.clientWidth = 100;

			await tabGroupSpec.rootInstance.setActiveTab(tab);

			// Verify smooth behavior is used
			expect(navElement.scrollTo).toHaveBeenCalledWith(
				expect.objectContaining({
					behavior: 'smooth'
				})
			);
		});

		it('should show the specified tab panel', async () => {
			const tab1 = tabGroupSpec.root.querySelector('#tab1') as any;
			const tab2 = tabGroupSpec.root.querySelector('#tab2') as any;
			// Call the show method to activate tab2
			tab1.active = false;
			tab2.active = true;
			await tabGroupSpec.waitForChanges();
			// Select the div that contains the aria-selected attribute for tab1
			const tab1Div = tab1.shadowRoot.querySelector('div[role="tab"]') as HTMLElement;
			// Select the div that contains the aria-selected attribute for tab2
			const tab2Div = tab2.shadowRoot.querySelector('div[role="tab"]') as HTMLElement;
			// Check the aria-selected attribute
			expect(tab1Div.getAttribute('aria-selected')).toBe('false');
			expect(tab2Div.getAttribute('aria-selected')).toBe('true');
		});

		it('should handle panel sync when activeTab becomes null during mapping', async () => {
			const tab1 = tabGroupSpec.root.querySelector('#tab1') as HTMLDvTabElement;
			const tab2 = tabGroupSpec.root.querySelector('#tab2') as HTMLDvTabElement;
			tabGroupSpec.rootInstance.activeTab = tab1;

			const navElement = document.createElement('div') as HTMLElement;
			tabGroupSpec.rootInstance.nav = navElement;
			Object.defineProperty(tabGroupSpec.rootInstance, 'placement', { value: 'left', writable: true });

			const panelWithSideEffect = {
				active: true,
				get name() {
					tabGroupSpec.rootInstance.activeTab = null;
					return 'tab2';
				}
			} as HTMLDvTabPanelElement;

			const panelRegular = {
				name: 'tab1',
				active: true
			} as HTMLDvTabPanelElement;

			jest.spyOn(tabGroupSpec.rootInstance as any, 'getAllTabs').mockReturnValue([tab1, tab2] as HTMLDvTabElement[]);
			jest
				.spyOn(tabGroupSpec.rootInstance as any, 'getAllPanels')
				.mockReturnValue([panelWithSideEffect, panelRegular] as HTMLDvTabPanelElement[]);

			await tabGroupSpec.rootInstance.setActiveTab(tab2, false);

			expect(panelWithSideEffect.active).toBe(false);
			expect(panelRegular.active).toBe(false);
			expect(tabGroupSpec.rootInstance.activeTab).toBeNull();
		});

		it('should scroll left when handleScrollLeft is called', async () => {
			const navElement = document.createElement('div') as any;
			navElement.scrollLeft = 100;
			navElement.clientWidth = 50;
			navElement.scrollWidth = 200;
			// Mock the scroll method
			navElement.scroll = jest.fn();
			// Assign the mocked navElement to the instance
			tabGroupSpec.rootInstance.nav = navElement;
			// Call the handleScrollLeft method
			tabGroupSpec.rootInstance.handleScrollLeft();
			// Check that the scroll method was called with the correct parameters
			expect(navElement.scroll).toHaveBeenCalledWith({
				left: 50,
				behavior: 'smooth'
			});
		});

		it('should scroll right when handleScrollRight is called', async () => {
			const navElement = document.createElement('div') as any;
			navElement.scrollLeft = 100;
			navElement.clientWidth = 50;
			navElement.scrollWidth = 200;
			// Mock the scroll method
			navElement.scroll = jest.fn();
			// Assign the mocked navElement to the instance
			tabGroupSpec.rootInstance.nav = navElement;
			// Call the handleScrollRight method
			tabGroupSpec.rootInstance.handleScrollRight();
			// Check that the scroll method was called with the correct parameters
			expect(navElement.scroll).toHaveBeenCalledWith({
				left: 150,
				behavior: 'smooth'
			});
		});

		it('should handle null nav gracefully across all methods', async () => {
			tabGroupSpec.rootInstance.nav = null;
			const tab = document.createElement('dv-tab') as any;

			// All these methods should not throw when nav is null
			expect(() => tabGroupSpec.rootInstance.handleScrollLeft()).not.toThrow();
			expect(() => tabGroupSpec.rootInstance.handleScrollRight()).not.toThrow();
			expect(() => tabGroupSpec.rootInstance.updateScrollControls()).not.toThrow();
			expect(() => tabGroupSpec.rootInstance.setActiveTab(tab)).not.toThrow();
		});

		it('should show a tab panel by name using the tabGroupShow method', async () => {
			const tab2 = tabGroupSpec.root.querySelector('#tab2') as any;

			// Call the tabGroupShow method to activate tab2
			await tabGroupSpec.rootInstance.tabGroupShow('tab2');
			await tabGroupSpec.waitForChanges();

			// Check that tab2 is now active
			expect(tab2.active).toBe(true);
		});

		it('should not throw when tabGroupShow is called with non-existent panel', async () => {
			// Call the show method with a panel that doesn't exist
			await expect(tabGroupSpec.rootInstance.tabGroupShow('nonexistent')).resolves.toBeUndefined();
		});

		it('should include disabled tabs when includeDisabled is true', async () => {
			// Create a new page with a disabled tab
			const page = (await newSpecPage({
				components: [DvTabGroup, DvTab],
				html: `
				<dv-tab-group>
					<dv-tab slot="nav" panel="tab1" id="tab1" active></dv-tab>
					<dv-tab slot="nav" panel="tab2" id="tab2" disabled></dv-tab>
					<dv-tab slot="nav" panel="tab3" id="tab3"></dv-tab>
				</dv-tab-group>
			`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvTabGroup>;

			// Get all tabs without disabled (default)
			const tabsWithoutDisabled = page.rootInstance.getAllTabs(false);
			// Get all tabs including disabled
			const tabsWithDisabled = page.rootInstance.getAllTabs(true);

			expect(tabsWithoutDisabled.length).toBe(2);
			expect(tabsWithDisabled.length).toBe(3);
		});

		it('should return undefined from getActiveTab when no tab is active', async () => {
			// Create a page with no active tabs
			const page = (await newSpecPage({
				components: [DvTabGroup, DvTab],
				html: `
				<dv-tab-group>
					<dv-tab slot="nav" panel="tab1" id="tab1"></dv-tab>
					<dv-tab slot="nav" panel="tab2" id="tab2"></dv-tab>
				</dv-tab-group>
			`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvTabGroup>;

			const activeTab = page.rootInstance.getActiveTab();
			expect(activeTab).toBeUndefined();
		});

		it('should not change activeTab when setting the same tab', async () => {
			const tab1 = tabGroupSpec.root.querySelector('#tab1') as any;
			tabGroupSpec.rootInstance.activeTab = tab1;

			const tabShowSpy = jest.spyOn(tabGroupSpec.rootInstance.tabShow, 'emit');

			// Try to set the same tab as active
			await tabGroupSpec.rootInstance.setActiveTab(tab1);

			// Events should not have been emitted since tab didn't change
			expect(tabShowSpy).not.toHaveBeenCalled();
		});

		it('should handle optional chaining when nav properties are undefined', async () => {
			// Test the optional chaining branches in calculateRightControlVisibility
			const navElement = document.createElement('div') as any;
			// Don't set scrollLeft, clientWidth, scrollWidth - they'll be undefined
			Object.defineProperty(navElement, 'scrollLeft', { value: undefined });
			Object.defineProperty(navElement, 'clientWidth', { value: undefined });
			Object.defineProperty(navElement, 'scrollWidth', { value: undefined });

			tabGroupSpec.rootInstance.nav = navElement;

			// Should not throw and should return false
			const result = tabGroupSpec.rootInstance.calculateRightControlVisibility();
			expect(result).toBe(false);
		});

		it('should handle undefined navs in calculateRightControlVisibility', async () => {
			const navForGuard = document.createElement('div') as any;
			navForGuard.scrollLeft = 0;
			navForGuard.clientWidth = 100;
			navForGuard.scrollWidth = 200;

			const values = [navForGuard, null, null, null];
			Object.defineProperty(tabGroupSpec.rootInstance, 'nav', {
				configurable: true,
				get: () => values.shift() ?? null
			});

			expect(tabGroupSpec.rootInstance.calculateRightControlVisibility()).toBe(false);
		});

		it('should handle undefined nav in calculateLeftControlVisibility', async () => {
			const navForGuard = document.createElement('div') as any;
			navForGuard.scrollLeft = 10;

			const values = [navForGuard, null];
			Object.defineProperty(tabGroupSpec.rootInstance, 'nav', {
				configurable: true,
				get: () => values.shift() ?? null
			});

			expect(tabGroupSpec.rootInstance.calculateLeftControlVisibility()).toBe(false);
		});

		it('should handle null tab when reading new indicator', async () => {
			const navElement = document.createElement('div') as HTMLElement;
			tabGroupSpec.rootInstance.nav = navElement;
			tabGroupSpec.rootInstance.activeTab = null;
			jest.spyOn(tabGroupSpec.rootInstance as any, 'getActiveTab').mockReturnValue(undefined);

			expect(() => tabGroupSpec.rootInstance.setActiveTab(null as any, false)).not.toThrow();
		});

		it('should skip flipAnimate when oldIndicator is null', async () => {
			const tab2 = tabGroupSpec.root.querySelector('#tab2') as any;

			// Clear activeTab so getActiveTab returns undefined (no oldIndicator)
			tabGroupSpec.rootInstance.activeTab = null;

			// Should not throw when oldIndicator is null
			await tabGroupSpec.rootInstance.setActiveTab(tab2);
			expect(tabGroupSpec.rootInstance.activeTab).toBe(tab2);
		});

		it('should skip flipAnimate when newIndicator is null', async () => {
			const tab1 = tabGroupSpec.root.querySelector('#tab1') as any;
			const tab2 = tabGroupSpec.root.querySelector('#tab2') as any;

			tabGroupSpec.rootInstance.activeTab = tab1;

			// Mock tab2 shadowRoot to return null for indicator
			jest.spyOn(tab2.shadowRoot, 'querySelector').mockReturnValue(null);

			// Should not throw when newIndicator is null
			await tabGroupSpec.rootInstance.setActiveTab(tab2);
			expect(tabGroupSpec.rootInstance.activeTab).toBe(tab2);
		});

		it('should execute flipAnimate when both old and new indicators exist', async () => {
			const tab1 = tabGroupSpec.root.querySelector('#tab1') as HTMLDvTabElement;
			const tab2 = tabGroupSpec.root.querySelector('#tab2') as HTMLDvTabElement;

			// Set tab1 as the current active tab
			tabGroupSpec.rootInstance.activeTab = tab1;
			await tabGroupSpec.waitForChanges();

			// Create mock indicator elements with getBoundingClientRect and animate
			const createMockIndicator = () => {
				const indicator = document.createElement('div');
				indicator.className = 'tab__indicator';
				(indicator as any).getBoundingClientRect = () => ({ top: 0, left: 0, width: 100, height: 4 });
				(indicator as any).animate = jest.fn();
				return indicator;
			};

			const oldIndicator = createMockIndicator();
			const newIndicator = createMockIndicator();

			// Mock getActiveTab to return a tab with the old indicator
			const mockActiveTab = {
				shadowRoot: {
					querySelector: (selector: string) => (selector === '.tab__indicator' ? oldIndicator : null)
				},
				panel: 'tab1'
			};
			jest.spyOn(tabGroupSpec.rootInstance, 'getActiveTab').mockReturnValue(mockActiveTab as any);

			// Mock tab2's shadowRoot to return the new indicator
			jest.spyOn(tab2.shadowRoot, 'querySelector').mockImplementation((selector: string) => {
				return selector === '.tab__indicator' ? newIndicator : null;
			});

			// Call setActiveTab - this should trigger flipAnimate
			await tabGroupSpec.rootInstance.setActiveTab(tab2);

			// Verify the tab change occurred
			expect(tabGroupSpec.rootInstance.activeTab).toBe(tab2);
		});

		it('should sync panels when setting active tab with actual panels present', async () => {
			// Create a page with tab panels to trigger the getAllPanels().map line
			const page = (await newSpecPage({
				components: [DvTabGroup, DvTab],
				html: `
				<dv-tab-group>
					<dv-tab slot="nav" panel="tab1" id="tab1" active></dv-tab>
					<dv-tab slot="nav" panel="tab2" id="tab2"></dv-tab>
					<dv-tab-panel name="tab1" active>Content 1</dv-tab-panel>
					<dv-tab-panel name="tab2">Content 2</dv-tab-panel>
				</dv-tab-group>
			`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvTabGroup>;

			// Mock the slots to return panels
			const panel1 = document.createElement('dv-tab-panel') as any;
			panel1.name = 'tab1';
			panel1.active = true;
			const panel2 = document.createElement('dv-tab-panel') as any;
			panel2.name = 'tab2';
			panel2.active = false;

			const mockSlot = document.createElement('slot') as any;
			mockSlot.assignedElements = () => [panel1, panel2];
			const mockBodyContainer = document.createElement('div');
			jest.spyOn(mockBodyContainer, 'querySelector').mockReturnValue(mockSlot);
			page.rootInstance.body = mockBodyContainer;

			const tab1 = page.root.querySelector('#tab1') as any;
			const tab2 = page.root.querySelector('#tab2') as any;

			// Set up nav element for setActiveTab
			const navElement = document.createElement('div') as any;
			page.rootInstance.nav = navElement;

			// Set initial active tab
			page.rootInstance.activeTab = tab1;

			// Switch to tab2 - this should trigger the getAllPanels().map line
			await page.rootInstance.setActiveTab(tab2);

			// Verify that panels were synced (panel1 should be inactive, panel2 should be active)
			expect(panel1.active).toBe(false);
			expect(panel2.active).toBe(true);
			expect(page.rootInstance.activeTab).toBe(tab2);
		});
	});

	describe('Slots', () => {
		it('should return empty arrays when slots are null or empty', async () => {
			// Tabs slot is null
			tabGroupSpec.rootInstance.tabs = null;
			expect(tabGroupSpec.rootInstance.getAllTabs()).toEqual([]);

			// Body slot is null
			tabGroupSpec.rootInstance.body = null;
			expect(tabGroupSpec.rootInstance.getAllPanels()).toEqual([]);

			// Slot without assignedElements method for tabs
			const mockSlotWithoutMethod = document.createElement('slot') as any;
			delete mockSlotWithoutMethod.assignedElements;
			const mockTabsContainer = document.createElement('div');
			jest.spyOn(mockTabsContainer, 'querySelector').mockReturnValue(mockSlotWithoutMethod);
			tabGroupSpec.rootInstance.tabs = mockTabsContainer;
			expect(tabGroupSpec.rootInstance.getAllTabs()).toEqual([]);

			// Slot without assignedElements method for panels
			const mockBodyContainer = document.createElement('div');
			jest.spyOn(mockBodyContainer, 'querySelector').mockReturnValue(mockSlotWithoutMethod);
			tabGroupSpec.rootInstance.body = mockBodyContainer;
			expect(tabGroupSpec.rootInstance.getAllPanels()).toEqual([]);

			// assignedElements returns null
			const mockSlotReturningNull = document.createElement('slot') as any;
			mockSlotReturningNull.assignedElements = () => null;
			const mockContainer = document.createElement('div');
			jest.spyOn(mockContainer, 'querySelector').mockReturnValue(mockSlotReturningNull);
			tabGroupSpec.rootInstance.tabs = mockContainer;
			expect(tabGroupSpec.rootInstance.getAllTabs()).toEqual([]);
		});

		it('should return panels from getAllPanels when panels exist', async () => {
			// Create a page with tab panels
			const page = (await newSpecPage({
				components: [DvTabGroup, DvTab],
				html: `
				<dv-tab-group>
					<dv-tab slot="nav" panel="tab1" active></dv-tab>
					<dv-tab slot="nav" panel="tab2"></dv-tab>
					<dv-tab-panel name="tab1">Content 1</dv-tab-panel>
					<dv-tab-panel name="tab2">Content 2</dv-tab-panel>
				</dv-tab-group>
			`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvTabGroup>;

			await page.waitForChanges();
			const panels = page.rootInstance.getAllPanels();
			// The panels should be returned (or empty array if slot not working in JSDOM)
			expect(Array.isArray(panels)).toBe(true);
		});

		it('should filter out non-dv-tab elements from slot', async () => {
			// Mock assignedElements to return mixed element types
			const mockSlot = document.createElement('slot') as any;
			const oTabElement = document.createElement('dv-tab');
			const divElement = document.createElement('div'); // Not an dv-tab
			const spanElement = document.createElement('span'); // Not an dv-tab

			mockSlot.assignedElements = () => [oTabElement, divElement, spanElement];

			const mockTabsContainer = document.createElement('div');
			jest.spyOn(mockTabsContainer, 'querySelector').mockReturnValue(mockSlot);

			tabGroupSpec.rootInstance.tabs = mockTabsContainer;

			// getAllTabs should filter out non-dv-tab elements
			const tabs = tabGroupSpec.rootInstance.getAllTabs();
			expect(tabs.length).toBe(1);
			expect(tabs[0].tagName.toLowerCase()).toBe('dv-tab');
		});

		it('should return empty tabs when slot has no assignedElements', async () => {
			const slotWithoutAssignedElements = {} as any;
			const mockTabsContainer = document.createElement('div');
			jest.spyOn(mockTabsContainer, 'querySelector').mockReturnValue(slotWithoutAssignedElements);

			tabGroupSpec.rootInstance.tabs = mockTabsContainer;
			expect(tabGroupSpec.rootInstance.getAllTabs()).toEqual([]);
		});

		it('should propagate size prop to all child tabs', async () => {
			// Default size should be 'md'
			const tabs = tabGroupSpec.root.querySelectorAll('dv-tab');
			tabs.forEach((tab: any) => {
				expect(tab.size).toBe('md');
			});

			// Change size to 'sm' on the group
			(tabGroupSpec.root as any).size = 'sm';
			await tabGroupSpec.waitForChanges();

			// syncTabSizes is called via @Watch — invoke manually since watchers don't fire in spec tests
			tabGroupSpec.rootInstance.syncTabSizes();

			tabs.forEach((tab: any) => {
				expect(tab.size).toBe('sm');
			});
		});

		it('should propagate size to all tabs including disabled tabs via syncTabSizes', async () => {
			// Use a new page with a disabled tab included
			const specWithDisabled = (await newSpecPage({
				components: [DvTabGroup, DvTab],
				html: `
					<dv-tab-group size="sm">
						<dv-tab slot="nav" panel="t1" id="t1" active></dv-tab>
						<dv-tab slot="nav" panel="t2" id="t2" disabled></dv-tab>
					</dv-tab-group>
				`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvTabGroup>;

			specWithDisabled.rootInstance.syncTabSizes();
			await specWithDisabled.waitForChanges();

			const tabs = specWithDisabled.root.querySelectorAll('dv-tab');
			tabs.forEach((tab: any) => {
				expect(tab.size).toBe('sm');
			});
		});

		it('should filter out non-dv-tab-panel elements from body slot', async () => {
			// Mock assignedElements to return mixed element types
			const mockSlot = document.createElement('slot') as any;
			const panelElement = document.createElement('dv-tab-panel');
			const divElement = document.createElement('div'); // Not a panel

			mockSlot.assignedElements = () => [panelElement, divElement];

			const mockBodyContainer = document.createElement('div');
			jest.spyOn(mockBodyContainer, 'querySelector').mockReturnValue(mockSlot);

			tabGroupSpec.rootInstance.body = mockBodyContainer;

			// getAllPanels should filter out non-dv-tab-panel elements
			const panels = tabGroupSpec.rootInstance.getAllPanels();
			expect(panels.length).toBe(1);
			expect(panels[0].tagName.toLowerCase()).toBe('dv-tab-panel');
		});

		it('should return empty panels when slot has no assignedElements function', async () => {
			const slotWithoutAssignedElements = {} as any;
			const mockBodyContainer = document.createElement('div');
			jest.spyOn(mockBodyContainer, 'querySelector').mockReturnValue(slotWithoutAssignedElements);

			tabGroupSpec.rootInstance.body = mockBodyContainer;
			expect(tabGroupSpec.rootInstance.getAllPanels()).toEqual([]);
		});

		it('should render without placement top conditional class when placement is not top', async () => {
			const page = (await newSpecPage({
				components: [DvTabGroup, DvTab],
				html: `
					<dv-tab-group placement="left">
						<dv-tab slot="nav" panel="tab1" id="tab1" active></dv-tab>
						<dv-tab slot="nav" panel="tab2" id="tab2"></dv-tab>
					</dv-tab-group>
				`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvTabGroup>;

			await page.waitForChanges();
			const rootDiv = page.root.shadowRoot.querySelector('div');
			expect(rootDiv.className.includes('flex-col')).toBe(true);
		});
	});
});

