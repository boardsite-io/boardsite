// const onMouseMove = require("./page")

// const e = {}
// test("onMouseMove", () => {
//     expect(onMouseMove(e)).toBe()
// })
import onMouseMove from "./page"

describe("onMouseMove", () => {
    test("test123", () => {
        expect(onMouseMove({})).toBe()
    })

    test("false is falsy", () => {
        expect(false).toBe(false)
    })
})
