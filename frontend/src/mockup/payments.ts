import { IPaymentProvider, IPaymentWallet } from 'utils/types/Payments';

export const mockup_providers: IPaymentProvider[] = Array.from({ length: 4 }).map((_, id) => ({
    id: id.toString(),
    address: '0x....',
    icon: '/img/providers/gnosis.svg',
    name: `Gnosis ${id + 1}`,
}));

export const mockup_wallets: IPaymentWallet[] = Array.from({ length: 4 }).map((_, id) => ({
    id: id.toString(),
    address: '0x....',
    icon: '/img/tokens/eth.svg',
    name: `Ethereum ${id + 1}`,
}));

// export const mockup_currencies: IPaymentCurrency[] = Array.from({ length: 4 }).map(
//   (_, id) => ({
//     id: id.toString(),
//     currency: 'USDT',
//   })
// );

// export const mockup_payments: IPayment[] = getRandomArrayLength(15, 25).map((_, id) => ({
//   id: id.toString(),
//   amount: 25 + Math.random() * 2000,
//   currency: getRandomArrayElement(mockup_currencies),
//   provider: getRandomArrayElement(mockup_providers),
//   status: getRandomArrayElement(['delivered', 'pending']),
//   user: {
//     id: '@alenawilliams01',
//     name: 'Alena Williams',
//   },
//   updated_at: getRandomDate(),
//   created_at: getRandomDate(),
// }));
