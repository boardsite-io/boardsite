import { fireEvent, RenderResult, waitFor } from "@testing-library/react"
import React from "react"
import { formatMessage, renderWithProviders } from "util/testing"
import OnlineSession from "."

type SubmitCreateProps = {
    userAlias: string
    getByLabelText: RenderResult["getByLabelText"]
    getByRole: RenderResult["getByRole"]
}

// Util for changing alias input and submitting create form
const submitCreate = async ({
    userAlias,
    getByLabelText,
    getByRole,
}: SubmitCreateProps) => {
    const userAliasInput = getByLabelText(
        formatMessage("DialogMenu.FormInput.UserAlias.Label")
    )
    const submitButton = getByRole("button", {
        name: formatMessage("DialogMenu.FormSubmit.CreateSessionNew"),
    })

    await waitFor(() =>
        fireEvent.change(userAliasInput, {
            target: { value: userAlias },
        })
    )
    await waitFor(() => fireEvent.click(submitButton))
}

type SubmitJoinProps = {
    sessionId: string
    getByLabelText: RenderResult["getByLabelText"]
    getByRole: RenderResult["getByRole"]
}

// Util for changing sessionId input and submitting join form
const submitJoin = async ({
    sessionId,
    getByLabelText,
    getByRole,
}: SubmitJoinProps) => {
    const sessionIdInput = getByLabelText(
        formatMessage("DialogMenu.FormInput.SessionId.Label")
    )
    const submitButton = getByRole("button", {
        name: formatMessage("DialogMenu.FormSubmit.JoinSession"),
    })

    await waitFor(() =>
        fireEvent.change(sessionIdInput, {
            target: { value: sessionId },
        })
    )
    await waitFor(() => fireEvent.click(submitButton))
}

const setup = () => renderWithProviders({ ui: <OnlineSession /> })

describe("OnlineSession dialog general", () => {
    it("shows the correct title", async () => {
        const { getByRole } = setup()
        const title = getByRole("heading", {
            name: formatMessage("DialogMenu.Online.Title"),
        })
        expect(title).toBeInTheDocument()
    })
})

describe("OnlineSession dialog alias validators", () => {
    it("should show the required message with an empty alias", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitCreate({ userAlias: "", getByLabelText, getByRole })
        const requiredError = getByText(
            formatMessage("DialogMenu.FormInput.UserAlias.Required")
        )
        expect(requiredError).toBeInTheDocument()
    })

    it("should show the length message with a too short alias", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitCreate({ userAlias: "2sm", getByLabelText, getByRole })
        const lengthError = getByText(
            formatMessage("DialogMenu.FormInput.UserAlias.Length")
        )
        expect(lengthError).toBeInTheDocument()
    })

    it("should show the characters message with a wrong char in the alias", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitCreate({
            userAlias: "Inv4l1dNam€",
            getByLabelText,
            getByRole,
        })
        const charactersError = getByText(
            formatMessage("DialogMenu.FormInput.UserAlias.Characters")
        )
        expect(charactersError).toBeInTheDocument()
    })
})

describe("OnlineSession dialog sessionId validators", () => {
    it("should show the required message with an empty sessionId", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitJoin({ sessionId: "", getByLabelText, getByRole })
        const requiredError = getByText(
            formatMessage("DialogMenu.FormInput.SessionId.Required")
        )
        expect(requiredError).toBeInTheDocument()
    })

    it("should show the length message with a too short alias", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitJoin({ sessionId: "2sh0rt", getByLabelText, getByRole })
        const charactersError = getByText(
            formatMessage("DialogMenu.FormInput.SessionId.Characters")
        )
        expect(charactersError).toBeInTheDocument()
    })

    it("should show the characters message with an invalid character in the id", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitJoin({ sessionId: "2sh0rt", getByLabelText, getByRole })
        const charactersError = getByText(
            formatMessage("DialogMenu.FormInput.SessionId.Characters")
        )
        expect(charactersError).toBeInTheDocument()
    })
})
