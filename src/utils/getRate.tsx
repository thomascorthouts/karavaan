export const getRate = (from: string, to: string, currencies: Currencies) => {
    const rateFrom = currencies[from].rate as number;
    const rateTo = currencies[to].rate as number;
    return rateTo / rateFrom;
};