export const parseMoney = (value: string) => {
    if (value === null || value === undefined) { return ''; }
    let v = value.toString().replace(/[^\d.]/g, '');
    console.log(v);
    if (v.length === 0) v = '0';
    if (v.length > 1) v = v.replace(/^0+/, '');
    v = v.replace(/^\./, '0.');
    v = v.slice(0, v.indexOf('.') >= 0 ? v.indexOf('.') + 3 : undefined);
    return v;
};

export const balancesToTransactions = (balances: Balances) => {
    // Still Empty
};