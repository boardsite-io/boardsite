import { parseFontSize } from "."

test("parseFontSize parses a style value correctly", () => {
    expect(parseFontSize("12px")).toEqual(12)
})
