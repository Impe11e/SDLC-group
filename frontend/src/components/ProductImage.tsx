import { useState } from 'react';
import type { Product } from '../types/product';

interface ProductImageProps {
    product: Pick<Product, 'name' | 'imageUrl'>;
    className?: string;
}

export function ProductImage({ product, className }: ProductImageProps) {
    const [failed, setFailed] = useState(false);

    if (!product.imageUrl || failed) {
        return (
            <div className={`${className ?? ''} product-image-placeholder`} aria-hidden="true">
                Немає фото
            </div>
        );
    }

    return (
        <img
            src={product.imageUrl}
            alt={product.name}
            className={className}
            loading="lazy"
            onError={() => setFailed(true)}
        />
    );
}
