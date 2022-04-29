import React from "react"
import { FormattedMessage, useIntl } from "language"
import {
    Button,
    DialogContent,
    DialogTitle,
    FormikInput,
    FormikLabel,
} from "components"
import { Field, Form, Formik, FormikHelpers } from "formik"
import { useNavigate, useParams } from "react-router-dom"
import * as Yup from "yup"
import { joinOnlineSession } from "../helpers"

export interface CreateFormValues {
    password: string
}

const OnlineEnterPassword: React.FC = () => {
    const navigate = useNavigate()
    const { formatMessage: f } = useIntl()
    const { sessionId = "" } = useParams()

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="Dialog.OnlineEnterPassword.Title" />
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{ password: "" }}
                    onSubmit={async (
                        { password }: CreateFormValues,
                        actions: FormikHelpers<CreateFormValues>
                    ) => {
                        await joinOnlineSession({
                            sessionId,
                            password,
                            onWrongPassword: () =>
                                actions.setFieldError(
                                    "password",
                                    f({
                                        id: "Dialog.OnlineEnterPassword.Input.Password.Invalid",
                                    })
                                ),
                            navigate,
                        })
                    }}
                    validationSchema={Yup.object().shape({
                        password: Yup.string().required(
                            f({
                                id: "Dialog.OnlineEnterPassword.Input.Password.Required",
                            })
                        ),
                    })}
                >
                    {({ isSubmitting }) => (
                        <Form spellCheck="false">
                            <FormikLabel
                                htmlFor="password"
                                textAlign="left"
                                fullWidth
                            >
                                <FormattedMessage id="Dialog.OnlineEnterPassword.Input.Password.Label" />
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={f({
                                        id: "Dialog.OnlineEnterPassword.Input.Password.Placeholder",
                                    })}
                                    component={FormikInput}
                                />
                            </FormikLabel>
                            <Button type="submit" disabled={isSubmitting}>
                                <FormattedMessage id="Dialog.OnlineEnterPassword.SubmitButton" />
                            </Button>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </>
    )
}

export default OnlineEnterPassword
