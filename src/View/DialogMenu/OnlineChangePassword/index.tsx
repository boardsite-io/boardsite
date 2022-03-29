import React from "react"
import { FormattedMessage, useIntl } from "language"
import {
    Button,
    DialogContent,
    DialogTitle,
    FormikInput,
    FormikLabel,
} from "components"
import { Field, Form, Formik } from "formik"
import { online } from "state/online"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"

export interface CreateFormValues {
    password: string
}

const OnlineChangePassword: React.FC = () => {
    const { formatMessage: f } = useIntl()

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="Dialog.OnlineChangePassword.Title" />
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{ password: "" }}
                    onSubmit={async ({ password }: CreateFormValues) => {
                        try {
                            await online.updateConfig({ password })
                            menu.setDialogState(DialogState.Closed)
                        } catch (error) {
                            // Notification
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form spellCheck="false">
                            <FormikLabel
                                htmlFor="password"
                                textAlign="left"
                                fullWidth
                            >
                                <FormattedMessage id="Dialog.OnlineChangePassword.Input.Password.Label" />
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={f({
                                        id: "Dialog.OnlineChangePassword.Input.Password.Placeholder",
                                    })}
                                    component={FormikInput}
                                />
                            </FormikLabel>
                            <Button type="submit" disabled={isSubmitting}>
                                <FormattedMessage id="Dialog.OnlineChangePassword.SubmitButton.ChangePassword" />
                            </Button>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </>
    )
}

export default OnlineChangePassword
