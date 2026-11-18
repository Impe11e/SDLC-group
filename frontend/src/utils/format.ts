const priceFormatter = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

export const formatPrice = (value: number): string => priceFormatter.format(value);
