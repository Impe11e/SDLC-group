CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255)   NOT NULL,
    description TEXT           NOT NULL DEFAULT '',
    category    VARCHAR(100)   NOT NULL,
    price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock       INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
    user_id    INTEGER     NOT NULL,
    product_id INTEGER     NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    quantity   INTEGER     NOT NULL CHECK (quantity > 0),
    added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER        NOT NULL,
    full_name        VARCHAR(255)   NOT NULL,
    delivery_address VARCHAR(500)   NOT NULL,
    payment_method   VARCHAR(50)    NOT NULL
        CHECK (payment_method IN ('CASH_ON_DELIVERY', 'CARD_ON_DELIVERY')),
    total_amount     NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status           VARCHAR(30)    NOT NULL DEFAULT 'NEW',
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);

CREATE TABLE IF NOT EXISTS order_items (
    id           SERIAL PRIMARY KEY,
    order_id     INTEGER        NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id   INTEGER        NOT NULL REFERENCES products (id),
    product_name VARCHAR(255)   NOT NULL,
    price        NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    quantity     INTEGER        NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
