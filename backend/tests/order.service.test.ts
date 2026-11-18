import { beforeEach, describe, expect, it } from 'vitest';
import { HttpError } from '../src/errors/http-error.js';
import { OrderService } from '../src/modules/order/order.service.js';
import type { CartItem } from '../src/types/cart.js';
import { InMemoryOrderRepository } from './fakes/in-memory-order.repository.js';

const USER_ID = 1;

const VALID_ORDER = {
    fullName: 'Іваненко Марія',
    deliveryAddress: 'Київ, вул. Хрещатик 1',
    paymentMethod: 'CASH_ON_DELIVERY',
};

const whey: CartItem = {
    productId: 1,
    productName: 'Whey Protein 1 кг',
    price: 1250,
    quantity: 2,
    stock: 25,
};

const creatine: CartItem = {
    productId: 3,
    productName: 'Creatine Monohydrate 300 г',
    price: 650,
    quantity: 3,
    stock: 40,
};

async function expectHttpError(promise: Promise<unknown>, status: number, message?: string) {
    const error = await promise.then(
        () => null,
        (err: unknown) => err
    );
    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(status);
    if (message) expect((error as HttpError).message).toContain(message);
}

describe('OrderService.placeOrder', () => {
    let repo: InMemoryOrderRepository;
    let service: OrderService;

    beforeEach(() => {
        repo = new InMemoryOrderRepository({
            carts: { [USER_ID]: [whey, creatine] },
            stock: { 1: 25, 3: 40 },
        });
        service = new OrderService(repo);
    });

    describe('успішне оформлення', () => {
        it('створює замовлення з позиціями кошика та правильною сумою', async () => {
            const order = await service.placeOrder(USER_ID, VALID_ORDER);

            expect(order.id).toBe(1);
            expect(order.userId).toBe(USER_ID);
            expect(order.totalAmount).toBe(2 * 1250 + 3 * 650);
            expect(order.paymentMethod).toBe('CASH_ON_DELIVERY');
            expect(order.items).toEqual([
                { productId: 1, productName: 'Whey Protein 1 кг', price: 1250, quantity: 2 },
                {
                    productId: 3,
                    productName: 'Creatine Monohydrate 300 г',
                    price: 650,
                    quantity: 3,
                },
            ]);
        });

        it('списує залишки товарів на складі', async () => {
            await service.placeOrder(USER_ID, VALID_ORDER);

            expect(repo.state.stock).toEqual({ 1: 23, 3: 37 });
        });

        it('очищає кошик після оформлення', async () => {
            await service.placeOrder(USER_ID, VALID_ORDER);

            expect(repo.state.carts[USER_ID]).toEqual([]);
        });

        it('ігнорує суму, передану клієнтом, і рахує її на сервері', async () => {
            const order = await service.placeOrder(USER_ID, {
                ...VALID_ORDER,
                totalAmount: 1,
            } as typeof VALID_ORDER);

            expect(order.totalAmount).toBe(4450);
        });

        it('коректно рахує суму з копійками без похибок float', async () => {
            repo.state.carts[USER_ID] = [
                { ...whey, price: 0.1, quantity: 1 },
                { ...creatine, price: 0.2, quantity: 1 },
            ];

            const order = await service.placeOrder(USER_ID, VALID_ORDER);

            expect(order.totalAmount).toBe(0.3);
        });

        it('обрізає зайві пробіли в ПІБ та адресі', async () => {
            const order = await service.placeOrder(USER_ID, {
                ...VALID_ORDER,
                fullName: '  Іваненко    Марія  ',
                deliveryAddress: '  Київ, вул. Хрещатик 1  ',
            });

            expect(order.fullName).toBe('Іваненко Марія');
            expect(order.deliveryAddress).toBe('Київ, вул. Хрещатик 1');
        });

        it('показує замовлення лише його власнику', async () => {
            const order = await service.placeOrder(USER_ID, VALID_ORDER);

            await expect(service.getUserOrders(USER_ID)).resolves.toHaveLength(1);
            await expect(service.getUserOrders(2)).resolves.toHaveLength(0);
            await expectHttpError(service.getOrder(2, order.id), 404);
        });
    });

    describe('валідація даних форми', () => {
        it.each([
            ['порожнє ПІБ', { fullName: '' }, 'Вкажіть ПІБ'],
            ['ПІБ з одного слова', { fullName: 'Марія' }, 'прізвище та імʼя'],
            ['порожня адреса', { deliveryAddress: '   ' }, 'адресу доставки'],
            ['закоротка адреса', { deliveryAddress: 'Київ' }, 'занадто коротка'],
            ['невідомий спосіб оплати', { paymentMethod: 'BITCOIN' }, 'спосіб оплати'],
            ['ПІБ не рядок', { fullName: 123 }, 'Вкажіть ПІБ'],
        ])('відхиляє: %s (400)', async (_case, override, message) => {
            await expectHttpError(
                service.placeOrder(USER_ID, { ...VALID_ORDER, ...override }),
                400,
                message
            );
            expect(repo.transactionsStarted).toBe(0);
        });
    });

    describe('бізнес-обмеження', () => {
        it('не дозволяє оформити замовлення з порожнім кошиком (400)', async () => {
            repo.state.carts[USER_ID] = [];

            await expectHttpError(service.placeOrder(USER_ID, VALID_ORDER), 400, 'порожній');
            expect(repo.state.orders).toHaveLength(0);
        });

        it('відхиляє замовлення, якщо товару недостатньо на складі (409)', async () => {
            repo.state.stock[3] = 2;

            await expectHttpError(
                service.placeOrder(USER_ID, VALID_ORDER),
                409,
                'Creatine Monohydrate 300 г'
            );
        });

        it('при нестачі товару нічого не змінює: ні замовлень, ні залишків, ні кошика', async () => {
            repo.state.stock[3] = 2;
            const before = structuredClone(repo.state);

            await expect(service.placeOrder(USER_ID, VALID_ORDER)).rejects.toThrow();

            expect(repo.state).toEqual(before);
        });

        it('дозволяє купити рівно весь залишок товару', async () => {
            repo.state.stock[1] = 2;

            await service.placeOrder(USER_ID, VALID_ORDER);

            expect(repo.state.stock[1]).toBe(0);
        });
    });

    describe('атомарність транзакції', () => {
        it.each(['addOrderItems', 'decreaseStock', 'clearCart'] as const)(
            'збій БД на кроці %s відкочує всі зміни',
            async (step) => {
                const before = structuredClone(repo.state);
                repo.failOn = step;

                await expect(service.placeOrder(USER_ID, VALID_ORDER)).rejects.toThrow(
                    'Simulated DB failure'
                );

                expect(repo.state).toEqual(before);
            }
        );
    });
});

describe('OrderService.getOrder', () => {
    it('повертає 404 для неіснуючого замовлення', async () => {
        const service = new OrderService(new InMemoryOrderRepository());

        await expectHttpError(service.getOrder(1, 999), 404, 'не знайдено');
    });
});
