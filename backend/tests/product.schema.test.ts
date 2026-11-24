import { describe, expect, it } from 'vitest';
import { parseProductFilters } from '../src/modules/product/product.schema.js';

describe('parseProductFilters', () => {
    it('без параметрів повертає порожні фільтри', () => {
        expect(parseProductFilters({})).toEqual({ search: undefined, category: undefined });
    });

    it('обрізає пробіли в пошуку і категорії', () => {
        expect(parseProductFilters({ search: '  whey ', category: ' Креатин ' })).toEqual({
            search: 'whey',
            category: 'Креатин',
        });
    });

    it('ігнорує порожні рядки', () => {
        expect(parseProductFilters({ search: '   ', category: '' })).toEqual({
            search: undefined,
            category: undefined,
        });
    });

    it('ігнорує нерядкові значення (наприклад, масив з ?search=a&search=b)', () => {
        expect(parseProductFilters({ search: ['a', 'b'] })).toEqual({
            search: undefined,
            category: undefined,
        });
    });

    it('обмежує довжину пошуку 100 символами', () => {
        const result = parseProductFilters({ search: 'a'.repeat(150) });
        expect(result.search).toHaveLength(100);
    });
});
