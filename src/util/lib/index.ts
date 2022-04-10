export const reduceRecord = <T, U>(
    record: Record<string, T>,
    fn: (a: T) => U
): Record<string, U> =>
    Object.keys(record).reduce<Record<string, U>>(
        (col, key) => ({
            ...col,
            [key]: fn(record[key]),
        }),
        {}
    )
