import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.router.js';
import { cartRouter } from '../modules/cart/cart.router.js';
import orderRouter from '../modules/order/order.router.js';
import { userRouter } from '../modules/user/user.router.js';

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'API is working!' });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);

export default router;
