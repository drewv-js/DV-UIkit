/**
 * Unit tests for DvUI tokens Color Utilities
 */

import { getColorGroups } from './color';

describe('color utilities', () => {
	describe('getColorGroups function', () => {
		describe('Initialization with default state', () => {
			it('should return status color groups with all variants', () => {
				const result = getColorGroups(['status']);

				expect(result).toBeDefined();
				expect(Object.keys(result).length).toBeGreaterThan(0);
			});

			it('should include common status colors (success, error, warning, info, neutral)', () => {
				const result = getColorGroups(['status']);

				expect(result['success']).toBeDefined();
				expect(result['error']).toBeDefined();
				expect(result['warning']).toBeDefined();
				expect(result['info']).toBeDefined();
				expect(result['neutral']).toBeDefined();
			});

			it('should return color variants with correct structure', () => {
				const result = getColorGroups(['status']);
				const successColor = result['success'];

				expect(successColor).toBeDefined();
				expect(successColor).toHaveProperty('bg');
				expect(successColor).toHaveProperty('bg-knockout');
				expect(successColor).toHaveProperty('text');
				expect(successColor).toHaveProperty('text-knockout');
				expect(successColor).toHaveProperty('border');
			});

			it('should return Tailwind classes for status colors', () => {
				const result = getColorGroups(['status']);
				const successColor = result['success'];

				expect(successColor.bg).toContain('bg-');
				expect(successColor.text).toContain('text-');
				expect(successColor.border).toContain('border-');
			});

			it('should handle knockout variants correctly', () => {
				const result = getColorGroups(['status']);
				const successColor = result['success'];

				expect(successColor['bg-knockout']).toBeDefined();
				expect(successColor['bg-knockout']).toContain('knockout');

				expect(successColor['text-knockout']).toBeDefined();
				expect(successColor['text-knockout']).toContain('knockout');
			});
		});

		describe('Error handling', () => {
			it('should warn when unknown color group is provided', () => {
				const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

				getColorGroups(['unknown-group' as any]);

				expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown color group: "unknown-group"'));

				consoleWarnSpy.mockRestore();
			});

			it('should return empty object for unknown color group', () => {
				const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

				const result = getColorGroups(['unknown-group' as any]);

				expect(result).toEqual({});

				consoleWarnSpy.mockRestore();
			});

			it('should process valid groups and warn about invalid groups', () => {
				const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

				const result = getColorGroups(['status', 'invalid-group' as any]);

				expect(Object.keys(result).length).toBeGreaterThan(0);
				expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown color group: "invalid-group"'));

				consoleWarnSpy.mockRestore();
			});
		});

		describe('Edge cases', () => {
			it('should return empty object when no groups are provided', () => {
				const result = getColorGroups([]);

				expect(result).toEqual({});
			});

			it('should handle multiple status group requests', () => {
				const result = getColorGroups(['status', 'status']);

				expect(result).toBeDefined();
				expect(Object.keys(result).length).toBeGreaterThan(0);
			});
		});
	});

	describe('Status colors integration', () => {
		it('should process all status colors from real data', () => {
			const result = getColorGroups(['status']);
			const colorKeys = Object.keys(result);

			expect(colorKeys).toContain('success');
			expect(colorKeys).toContain('error');
			expect(colorKeys).toContain('warning');
			expect(colorKeys).toContain('info');
			expect(colorKeys).toContain('neutral');
		});

		it('should create complete variant sets for each color', () => {
			const result = getColorGroups(['status']);

			Object.keys(result).forEach((colorName) => {
				const color = result[colorName];
				expect(color.bg).toBeTruthy();
				expect(color['bg-knockout']).toBeTruthy();
				expect(color.text).toBeTruthy();
				expect(color['text-knockout']).toBeTruthy();
				expect(color.border).toBeTruthy();
			});
		});

		it('should map background tokens correctly', () => {
			const result = getColorGroups(['status']);
			const successBg = result['success']?.bg;
			const successBgKnockout = result['success']?.['bg-knockout'];

			expect(successBg).toBe('bg-status-success');
			expect(successBgKnockout).toBe('bg-status-success-knockout');
		});

		it('should map content tokens correctly', () => {
			const result = getColorGroups(['status']);
			const errorText = result['error']?.text;
			const errorTextKnockout = result['error']?.['text-knockout'];

			expect(errorText).toBe('text-status-error');
			expect(errorTextKnockout).toBe('text-status-error-knockout');
		});

		it('should map border tokens correctly', () => {
			const result = getColorGroups(['status']);
			const warningBorder = result['warning']?.border;

			expect(warningBorder).toBe('border-status-warning');
		});

		it('should handle all status colors consistently', () => {
			const result = getColorGroups(['status']);
			const statusColors = ['success', 'error', 'warning', 'info', 'neutral'];

			statusColors.forEach((colorName) => {
				expect(result[colorName]).toBeDefined();
				expect(result[colorName].bg).toBe(`bg-status-${colorName}`);
				expect(result[colorName]['bg-knockout']).toBe(`bg-status-${colorName}-knockout`);
				expect(result[colorName].text).toBe(`text-status-${colorName}`);
				expect(result[colorName]['text-knockout']).toBe(`text-status-${colorName}-knockout`);
				expect(result[colorName].border).toBe(`border-status-${colorName}`);
			});
		});

		describe('TypeScript type safety', () => {
			it('should accept ColorGroup type correctly', () => {
				const validGroup = 'status' as const;
				const result = getColorGroups([validGroup]);

				expect(result).toBeDefined();
			});

			it('should return ColorGroups type with correct structure', () => {
				const result = getColorGroups(['status']);

				Object.values(result).forEach((colorVariants) => {
					expect(colorVariants).toHaveProperty('bg');
					expect(colorVariants).toHaveProperty('bg-knockout');
					expect(colorVariants).toHaveProperty('text');
					expect(colorVariants).toHaveProperty('text-knockout');
					expect(colorVariants).toHaveProperty('border');

					expect(typeof colorVariants.bg).toBe('string');
					expect(typeof colorVariants['bg-knockout']).toBe('string');
					expect(typeof colorVariants.text).toBe('string');
					expect(typeof colorVariants['text-knockout']).toBe('string');
					expect(typeof colorVariants.border).toBe('string');
				});
			});
		});
	});
});

