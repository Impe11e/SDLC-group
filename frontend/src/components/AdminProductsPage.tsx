import { type SubmitEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../services/api';
import { productService } from '../services/productService';
import type { Product, ProductInput } from '../types/product';
import { formatPrice } from '../utils/format';

const EMPTY_FORM = {
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    manufacturer: '',
    composition: '',
    imageUrl: '',
};

type FormState = typeof EMPTY_FORM;

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        productService
            .getAll()
            .then(setProducts)
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    }, []);

    const setField = (key: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
    };

    const startEdit = (product: Product) => {
        setEditingId(product.id);
        setForm({
            name: product.name,
            description: product.description,
            category: product.category,
            price: String(product.price),
            stock: String(product.stock),
            manufacturer: product.manufacturer,
            composition: product.composition,
            imageUrl: product.imageUrl,
        });
        setError(null);
        setMessage(null);
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setMessage(null);
        const input: ProductInput = {
            name: form.name,
            description: form.description,
            category: form.category,
            price: Number(form.price),
            stock: Number(form.stock),
            manufacturer: form.manufacturer,
            composition: form.composition,
            imageUrl: form.imageUrl,
        };
        try {
            if (editingId) {
                await productService.update(editingId, input);
            } else {
                await productService.create(input);
            }
            setProducts(await productService.getAll());
            setMessage(editingId ? 'Товар оновлено' : 'Товар додано');
            resetForm();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        setError(null);
        setMessage(null);
        try {
            await productService.remove(id);
            setProducts(await productService.getAll());
            setMessage('Товар видалено');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setConfirmId(null);
        }
    };

    return (
        <div className="app">
            <Link to="/">← До каталогу</Link>
            <h1>Керування товарами</h1>

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

            <form onSubmit={handleSubmit}>
                <h2>{editingId ? 'Редагування товару' : 'Новий товар'}</h2>
                <input
                    placeholder="Назва"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    required
                />
                <input
                    placeholder="Категорія"
                    value={form.category}
                    onChange={(e) => setField('category', e.target.value)}
                    required
                />
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ціна, грн"
                    value={form.price}
                    onChange={(e) => setField('price', e.target.value)}
                    required
                />
                <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Кількість на складі"
                    value={form.stock}
                    onChange={(e) => setField('stock', e.target.value)}
                    required
                />
                <input
                    placeholder="Виробник"
                    value={form.manufacturer}
                    onChange={(e) => setField('manufacturer', e.target.value)}
                />
                <input
                    placeholder="Склад"
                    value={form.composition}
                    onChange={(e) => setField('composition', e.target.value)}
                />
                <input
                    placeholder="Шлях до фото (наприклад, /images/products/protein.jpeg)"
                    value={form.imageUrl}
                    onChange={(e) => setField('imageUrl', e.target.value)}
                />
                <input
                    placeholder="Опис"
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                />
                <button type="submit" disabled={saving}>
                    {saving ? 'Зберігаємо…' : editingId ? 'Зберегти зміни' : 'Додати товар'}
                </button>
                {editingId && (
                    <button type="button" onClick={resetForm}>
                        Скасувати
                    </button>
                )}
            </form>

            {loading && <p className="muted">Завантаження…</p>}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Назва</th>
                        <th>Категорія</th>
                        <th>Ціна</th>
                        <th>Склад</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.category}</td>
                            <td>{formatPrice(p.price)}</td>
                            <td>{p.stock}</td>
                            <td>
                                <button type="button" onClick={() => startEdit(p)}>
                                    Редагувати
                                </button>
                                {confirmId === p.id ? (
                                    <>
                                        <button type="button" onClick={() => handleDelete(p.id)}>
                                            Так, видалити
                                        </button>
                                        <button type="button" onClick={() => setConfirmId(null)}>
                                            Ні
                                        </button>
                                    </>
                                ) : (
                                    <button type="button" onClick={() => setConfirmId(p.id)}>
                                        Видалити
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
