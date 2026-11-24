export interface Review {
    id: number;
    productId: number;
    userId: number;
    nickname: string;
    rating: number;
    text: string;
    createdAt: Date;
}

export interface ReviewInput {
    rating: number;
    text: string;
}

export interface IReviewRepository {
    findByProduct(productId: number): Promise<Review[]>;
    exists(productId: number, userId: number): Promise<boolean>;
    create(productId: number, userId: number, input: ReviewInput): Promise<Review>;
}
