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

export interface CreateFormValues {
    password: string
}

const OnlineChangePassword: React.FC = () => {
    // const navigate = useNavigate()
    const { formatMessage: f } = useIntl()
    // const { sessionId } = useParams()

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="Dialog.OnlineChangePassword.Title" />
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{ password: "" }}
                    onSubmit={async ({ password }: CreateFormValues) => {
                        console.log(password) // TODO: Change password
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
