import React from "react"
import { formatMessage, renderWithProviders } from "util/testing"
import OnlineSession from "."

const setup = () => renderWithProviders({ ui: <OnlineSession /> })

describe("OnlineSession Dialog", () => {
    it("creates a new session", async () => {
        const { debug, getByRole } = setup()

        const title = getByRole("heading", {
            name: formatMessage("DialogMenu.Online.Title"),
        })

        expect(title).toBeInTheDocument()

        debug()
    })
})
