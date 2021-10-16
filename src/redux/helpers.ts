export const insertArrayItem = (
    array: unknown[],
    index: number,
    item: unknown
): unknown[] => [...array.slice(0, index), item, ...array.slice(index)]

export const removeArrayItem = (array: unknown[], index: number): unknown[] => [
    ...array.slice(0, index),
    ...array.slice(index + 1),
]

interface UnknownObject {
    [key: string]: unknown
}
export const updateObjectInArray = (
    array: UnknownObject[],
    index: number,
    newItem: UnknownObject
): UnknownObject[] =>
    array.map((arrayItem, i) => {
        if (i !== index) {
            return arrayItem
        }
        return {
            ...arrayItem,
            ...newItem,
        }
    })

export const deleteObjectProperty = (
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { [key]: _, ...newObj }: { [key: string]: unknown }
): unknown => newObj
