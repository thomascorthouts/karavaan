export const getRate = (from: string, to: string, currencies: any) => {
    // Should become this after testing:
    // const rateFrom = currencies[from] as number;
    // const rateTo = currencies[to] as number;

    const rateFrom = currencies[from] as number;
    const rateTo = currencies[to] as number;

    return rateTo / rateFrom;
};