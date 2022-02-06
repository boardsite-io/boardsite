import { getRandomColor } from "."

describe("getRandomColor", () => {
    it("should generate a valid hex color", () => {
        const randomHex = getRandomColor()

        expect(randomHex.length).toEqual(7)
        expect(/^#[0-9A-F]{6}$/i.test(randomHex)).toEqual(true)
    })
})
