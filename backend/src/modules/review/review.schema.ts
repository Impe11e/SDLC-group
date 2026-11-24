import type { ReviewInput } from '../../types/review.js';

export function validateReview(data: Record<string, unknown> | undefined): string | null {
    const rating = data?.rating;
    if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        return 'Оцінка має бути цілим числом від 1 до 5';
    }
    const text = typeof data?.text === 'string' ? data.text.trim() : '';
    if (text.length < 3) return 'Текст відгуку має містити щонайменше 3 символи';
    if (text.length > 1000) return 'Текст відгуку занадто довгий (максимум 1000 символів)';
    return null;
}

export function toReviewInput(data: Record<string, unknown>): ReviewInput {
    return { rating: data.rating as number, text: (data.text as string).trim() };
}
