import type { ProductInput } from '../../types/product.js';

export function parseId(value: unknown): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export function validateProductInput(data: Record<string, unknown> | undefined): string | null {
    if (!text(data?.name)) return 'Вкажіть назву товару';
    if (text(data?.name).length > 255) return 'Назва занадто довга (максимум 255 символів)';
    if (!text(data?.category)) return 'Вкажіть категорію';
    if (text(data?.category).length > 100) return 'Категорія занадто довга (максимум 100 символів)';
    if (typeof data?.price !== 'number' || !Number.isFinite(data.price) || data.price < 0) {
        return 'Ціна має бути числом не менше 0';
    }
    if (typeof data?.stock !== 'number' || !Number.isInteger(data.stock) || data.stock < 0) {
        return 'Кількість на складі має бути цілим числом не менше 0';
    }
    return null;
}

export function toProductInput(data: Record<string, unknown>): ProductInput {
    return {
        name: text(data.name),
        description: text(data.description),
        category: text(data.category),
        price: data.price as number,
        stock: data.stock as number,
        manufacturer: text(data.manufacturer),
        composition: text(data.composition),
        imageUrl: text(data.imageUrl),
    };
}
