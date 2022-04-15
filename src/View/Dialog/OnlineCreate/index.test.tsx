import { fireEvent, RenderResult, waitFor } from "@testing-library/react"
import React from "react"
import { formatMessage, renderWithProviders } from "util/testing"
import OnlineCreate from "."

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
        formatMessage("Dialog.OnlineCreate.Input.Alias.Label")
    )
    const submitButton = getByRole("button", {
        name: formatMessage("Dialog.OnlineCreate.SubmitButton.CreateNew"),
    })

    await waitFor(() =>
        fireEvent.change(userAliasInput, {
            target: { value: userAlias },
        })
    )
    await waitFor(() => fireEvent.click(submitButton))
}

const setup = () => renderWithProviders({ ui: <OnlineCreate /> })

describe("OnlineCreate Dialog", () => {
    it("should show the correct title", async () => {
        const { getByRole } = setup()
        const title = getByRole("heading", {
            name: formatMessage("Dialog.OnlineCreate.Title"),
        })
        expect(title).toBeInTheDocument()
    })
})

describe("OnlineCreate Dialog Form", () => {
    it("should require an alias", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitCreate({ userAlias: "", getByLabelText, getByRole })
        const requiredError = getByText(
            formatMessage("Dialog.OnlineCreate.Input.Alias.Required")
        )
        expect(requiredError).toBeInTheDocument()
    })

    it("should reject a too short alias", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitCreate({ userAlias: "2sm", getByLabelText, getByRole })
        const lengthError = getByText(
            formatMessage("Dialog.OnlineCreate.Input.Alias.Length")
        )
        expect(lengthError).toBeInTheDocument()
    })

    it("should reject an alias which contains invalid characters", async () => {
        const { getByLabelText, getByRole, getByText } = setup()
        await submitCreate({
            userAlias: "Inv4l1dNam€",
            getByLabelText,
            getByRole,
        })
        const charactersError = getByText(
            formatMessage("Dialog.OnlineCreate.Input.Alias.Characters")
        )
        expect(charactersError).toBeInTheDocument()
    })
})
