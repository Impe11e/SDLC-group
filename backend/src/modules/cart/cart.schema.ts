import type { AddToCartDTO, UpdateCartItemDTO } from '../../types/cart.js';

const MAX_QUANTITY = 99;

const isPositiveInt = (value: unknown): value is number =>
    typeof value === 'number' && Number.isInteger(value) && value > 0;

export function validateAddToCart(data: Partial<AddToCartDTO> | undefined): string | null {
    if (!isPositiveInt(data?.productId)) return 'productId має бути додатним цілим числом';
    if (!isPositiveInt(data?.quantity)) return 'Кількість має бути цілим числом більше нуля';
    if (data.quantity > MAX_QUANTITY) return `Кількість не може перевищувати ${MAX_QUANTITY}`;
    return null;
}

export function validateUpdateCartItem(
    data: Partial<UpdateCartItemDTO> | undefined
): string | null {
    const quantity = data?.quantity;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0) {
        return 'Кількість має бути цілим числом не менше нуля';
    }
    if (quantity > MAX_QUANTITY) return `Кількість не може перевищувати ${MAX_QUANTITY}`;
    return null;
}
