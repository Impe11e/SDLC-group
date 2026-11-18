import type { CartItem } from '../../src/types/cart.js';
import type {
    CreateOrderDTO,
    IOrderRepository,
    IOrderTransaction,
    Order,
} from '../../src/types/order.js';

interface State {
    carts: Record<number, CartItem[]>;
    stock: Record<number, number>;
    orders: Order[];
}

const clone = (state: State): State => structuredClone(state);

export class InMemoryOrderRepository implements IOrderRepository {
    state: State;
    transactionsStarted = 0;
    failOn: keyof IOrderTransaction | null = null;

    constructor(initial: Partial<State> = {}) {
        this.state = { carts: {}, stock: {}, orders: [], ...initial };
    }

    async withTransaction<T>(work: (tx: IOrderTransaction) => Promise<T>): Promise<T> {
        this.transactionsStarted++;
        const draft = clone(this.state);
        const result = await work(this.createTransaction(draft));
        this.state = draft;
        return result;
    }

    async findByUserId(userId: number): Promise<Order[]> {
        return this.state.orders.filter((o) => o.userId === userId).reverse();
    }

    async findById(userId: number, orderId: number): Promise<Order | null> {
        return this.state.orders.find((o) => o.userId === userId && o.id === orderId) ?? null;
    }

    private createTransaction(draft: State): IOrderTransaction {
        const guard = (step: keyof IOrderTransaction) => {
            if (this.failOn === step) throw new Error(`Simulated DB failure in ${step}`);
        };

        return {
            lockCartItems: async (userId) => {
                guard('lockCartItems');
                return (draft.carts[userId] ?? []).map((item) => ({
                    ...item,
                    stock: draft.stock[item.productId] ?? 0,
                }));
            },
            createOrder: async (userId: number, dto: CreateOrderDTO, totalAmount: number) => {
                guard('createOrder');
                const id = draft.orders.length + 1;
                draft.orders.push({
                    id,
                    userId,
                    ...dto,
                    totalAmount,
                    status: 'NEW',
                    createdAt: new Date(),
                    items: [],
                });
                return id;
            },
            addOrderItems: async (orderId, items) => {
                guard('addOrderItems');
                const order = draft.orders.find((o) => o.id === orderId)!;
                order.items = items.map(({ productId, productName, price, quantity }) => ({
                    productId,
                    productName,
                    price,
                    quantity,
                }));
            },
            decreaseStock: async (items) => {
                guard('decreaseStock');
                for (const item of items) {
                    draft.stock[item.productId] -= item.quantity;
                }
            },
            clearCart: async (userId) => {
                guard('clearCart');
                draft.carts[userId] = [];
            },
        };
    }
}
