import { fireEvent, RenderResult, waitFor } from "@testing-library/react"
import React from "react"
import { formatMessage, renderWithProviders } from "util/testing"
import OnlineJoin from "."

type SubmitCreateProps = {
    alias: string
    sessionId: string
    getByLabelText: RenderResult["getByLabelText"]
    getByRole: RenderResult["getByRole"]
}

// Util for changing alias input and submitting create form
const submitJoin = async ({
    alias,
    sessionId,
    getByLabelText,
    getByRole,
}: SubmitCreateProps) => {
    const aliasInput = getByLabelText(
        formatMessage("Dialog.OnlineJoin.Input.Alias.Label")
    )
    const sessionIdInput = getByLabelText(
        formatMessage("Dialog.OnlineJoin.Input.SessionId.Label")
    )
    const submitButton = getByRole("button", {
        name: formatMessage("Dialog.OnlineJoin.SubmitButton.JoinSession"),
    })
    await waitFor(() =>
        fireEvent.change(aliasInput, {
            target: { value: alias },
        })
    )
    await waitFor(() =>
        fireEvent.change(sessionIdInput, {
            target: { value: sessionId },
        })
    )
    await waitFor(() => fireEvent.click(submitButton))
}

const setup = () => renderWithProviders({ ui: <OnlineJoin /> })

describe("OnlineJoin Dialog", () => {
    it("shows the correct title", async () => {
        const { getByRole } = setup()
        const title = getByRole("heading", {
            name: formatMessage("Dialog.OnlineJoin.Title"),
        })
        expect(title).toBeInTheDocument()
    })
})

describe("OnlineJoin Dialog Form", () => {
    const VALID_ALIAS = "Andyomat"
    const VALID_SESSION_ID = "v4l1dID1337"

    it("should require an alias and sessionId", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitJoin({
            alias: "",
            sessionId: "",
            getByLabelText,
            getByRole,
        })
        const aliasRequired = getByText(
            formatMessage("Dialog.OnlineJoin.Input.Alias.Required")
        )
        const sessionIdRequired = getByText(
            formatMessage("Dialog.OnlineJoin.Input.SessionId.Required")
        )
        expect(aliasRequired).toBeInTheDocument()
        expect(sessionIdRequired).toBeInTheDocument()
    })

    it("should reject a too short alias", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitJoin({
            alias: "2sh",
            sessionId: VALID_SESSION_ID,
            getByLabelText,
            getByRole,
        })
        const aliasLength = getByText(
            formatMessage("Dialog.OnlineJoin.Input.Alias.Length")
        )
        expect(aliasLength).toBeInTheDocument()
    })

    it("should reject an alias with invalid characters", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitJoin({
            alias: "InvalidU$€rN@me",
            sessionId: VALID_SESSION_ID,
            getByLabelText,
            getByRole,
        })
        const aliasLength = getByText(
            formatMessage("Dialog.OnlineJoin.Input.Alias.Characters")
        )
        expect(aliasLength).toBeInTheDocument()
    })

    it("should reject a session id which is too short", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitJoin({
            alias: VALID_ALIAS,
            sessionId: "2sh0rt",
            getByLabelText,
            getByRole,
        })
        const sessionIdcharacters = getByText(
            formatMessage("Dialog.OnlineJoin.Input.SessionId.Characters")
        )
        expect(sessionIdcharacters).toBeInTheDocument()
    })

    it("should reject a session id which contains invalid characters", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitJoin({
            alias: VALID_ALIAS,
            sessionId: "b4d$ym∫ol§",
            getByLabelText,
            getByRole,
        })
        const sessionIdcharacters = getByText(
            formatMessage("Dialog.OnlineJoin.Input.SessionId.Characters")
        )
        expect(sessionIdcharacters).toBeInTheDocument()
    })
})
