export const groupBy = <T extends Record<string, any>, K extends keyof T>(
    array: T[],
    key: K | ((obj: T) => string),
): Record<string, T[]> => {
    const keyFn = key instanceof Function ? key : (obj: T) => obj[key] as string;
    return array.reduce((grouped, current) => {
        const value = keyFn(current);
        grouped[value] = (grouped[value] || []).concat(current);
        return grouped;
    }, {} as Record<string, T[]>);
};
