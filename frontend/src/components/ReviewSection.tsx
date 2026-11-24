import { type SubmitEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../services/api';
import { authService } from '../services/authService';
import { reviewService } from '../services/reviewService';
import type { Review } from '../types/review';

const stars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

export function ReviewSection({ productId }: { productId: number }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        reviewService
            .getForProduct(productId)
            .then(setReviews)
            .catch((err) => setError(getErrorMessage(err)));
    }, [productId]);

    const average =
        reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setSubmitting(true);
        try {
            await reviewService.add(productId, rating, text);
            setReviews(await reviewService.getForProduct(productId));
            setText('');
            setMessage('Дякуємо за відгук!');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="reviews">
            <h2>Відгуки</h2>
            {reviews.length > 0 ? (
                <p className="muted">
                    Середня оцінка: {average.toFixed(1)} з 5 ({reviews.length})
                </p>
            ) : (
                <p className="muted">Відгуків поки немає</p>
            )}

            <ul>
                {reviews.map((r) => (
                    <li key={r.id}>
                        <strong>{r.nickname}</strong> {stars(r.rating)}{' '}
                        <span className="muted">
                            {new Date(r.createdAt).toLocaleDateString('uk-UA')}
                        </span>
                        <p>{r.text}</p>
                    </li>
                ))}
            </ul>

            {error && (
                <p className="alert" role="alert">
                    {error}
                </p>
            )}
            {message && (
                <p className="alert success" role="status">
                    {message}
                </p>
            )}

            {authService.isLoggedIn() ? (
                <form onSubmit={handleSubmit}>
                    <h3>Залишити відгук</h3>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                                {stars(n)}
                            </option>
                        ))}
                    </select>
                    <textarea
                        placeholder="Ваш відгук"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Надсилаємо…' : 'Надіслати'}
                    </button>
                </form>
            ) : (
                <p>
                    <Link to="/login">Увійдіть</Link>, щоб залишити відгук.
                </p>
            )}
        </section>
    );
}
