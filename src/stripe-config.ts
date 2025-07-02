export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SPJHRcL4Osk5JW',
    priceId: 'price_1RUUfMJHfrNln9fJu0LG0ppp',
    name: 'Pro Plan',
    description: 'Ideal for growing businesses',
    mode: 'subscription',
    price: 49.95,
    currency: 'EUR'
  },
  {
    id: 'prod_SPJHdwoHjInfVo',
    priceId: 'price_1RUUeiJHfrNln9fJCJGuIdl9',
    name: 'Starter Plan',
    description: 'Perfect for freelancers and small businesses',
    mode: 'subscription',
    price: 29.95,
    currency: 'EUR'
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export function getProductById(id: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.id === id);
}