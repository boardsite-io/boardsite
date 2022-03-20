import React, { useRef } from "react"
import { FormattedMessage, useIntl } from "language"
import {
    DialogContent,
    DialogTitle,
    Button,
    FormikInput,
    FormikLabel,
    FormikColorInput,
} from "components"
import { Field, Form, Formik, FormikProps } from "formik"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import { online } from "state/online"
import { createOnlineSession, joinOnlineSession } from "./helpers"
import { Selection } from "./index.styled"

export interface CreateFormValues {
    userAlias: string
    userColor: string
}

interface JoinFormValues {
    sessionId: string
}

const OnlineSession: React.FC = () => {
    const navigate = useNavigate()
    const { formatMessage: f } = useIntl()
    const userFormikRef = useRef<FormikProps<CreateFormValues>>(null)
    const { alias, color } = online.getState().userSelection

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="DialogMenu.Online.Title" />
            </DialogTitle>
            <DialogContent>
                <Formik
                    innerRef={userFormikRef}
                    initialValues={{ userAlias: alias, userColor: color }}
                    onSubmit={async ({
                        userAlias,
                        userColor,
                    }: CreateFormValues) => {
                        online.updateUser({
                            alias: userAlias,
                            color: userColor,
                        })
                        await createOnlineSession(false, navigate)
                    }}
                    validationSchema={Yup.object().shape({
                        userColor: Yup.string()
                            .required()
                            .matches(/^#[a-fA-F0-9]{6}$/),
                        userAlias: Yup.string()
                            .required(
                                f({
                                    id: "DialogMenu.FormInput.UserAlias.Required",
                                })
                            )
                            .matches(
                                /^.{4,32}$/,
                                f({
                                    id: "DialogMenu.FormInput.UserAlias.Length",
                                })
                            )
                            .matches(
                                /^[a-zA-Z0-9-_]{4,32}$/,
                                f({
                                    id: "DialogMenu.FormInput.UserAlias.Characters",
                                })
                            ),
                    })}
                >
                    {({ isSubmitting, values, setSubmitting }) => (
                        <Form spellCheck="false">
                            <Selection>
                                <FormikLabel
                                    htmlFor="userColor"
                                    textAlign="left"
                                >
                                    <Field
                                        id="userColor"
                                        name="userColor"
                                        component={FormikColorInput}
                                    />
                                </FormikLabel>
                                <FormikLabel
                                    htmlFor="userAlias"
                                    textAlign="left"
                                    fullWidth
                                >
                                    <FormattedMessage id="DialogMenu.FormInput.UserAlias.Label" />
                                    <Field
                                        id="userAlias"
                                        name="userAlias"
                                        component={FormikInput}
                                    />
                                </FormikLabel>
                            </Selection>
                            <Button type="submit" disabled={isSubmitting}>
                                <FormattedMessage id="DialogMenu.FormSubmit.CreateSessionNew" />
                            </Button>
                            <Button
                                onClick={async () => {
                                    setSubmitting(true)
                                    online.updateUser({
                                        alias: values.userAlias,
                                        color: values.userColor,
                                    })
                                    await createOnlineSession(true, navigate)
                                    setSubmitting(false)
                                }}
                                disabled={isSubmitting}
                            >
                                <FormattedMessage id="DialogMenu.FormSubmit.CreateSessionContinue" />
                            </Button>
                        </Form>
                    )}
                </Formik>
                <Formik
                    initialValues={{ sessionId: "" }}
                    onSubmit={async ({ sessionId }: JoinFormValues) => {
                        const userFormik = userFormikRef.current
                        if (!userFormik) return
                        const { values, isValid } = userFormik

                        if (!isValid) {
                            // Submit form to display errors. The setError function would
                            // be nicer but doesn't seem to work for some reason
                            await userFormik.submitForm()
                            return
                        }

                        online.updateUser({
                            alias: values.userAlias,
                            color: values.userColor,
                        })
                        await joinOnlineSession(sessionId, navigate)
                    }}
                    validationSchema={Yup.object().shape({
                        sessionId: Yup.string()
                            .required(
                                f({
                                    id: "DialogMenu.FormInput.SessionId.Required",
                                })
                            )
                            .matches(
                                /^[a-zA-Z0-9]{8,20}$/,
                                f({
                                    id: "DialogMenu.FormInput.SessionId.Characters",
                                })
                            ),
                    })}
                >
                    {({ isSubmitting }) => (
                        <Form spellCheck="false">
                            <FormikLabel htmlFor="sessionId" textAlign="center">
                                <FormattedMessage id="DialogMenu.FormInput.SessionId.Label" />
                                <Field
                                    id="sessionId"
                                    name="sessionId"
                                    placeholder={f({
                                        id: "DialogMenu.FormInput.SessionId.Placeholder",
                                    })}
                                    component={FormikInput}
                                />
                            </FormikLabel>
                            <Button type="submit" disabled={isSubmitting}>
                                <FormattedMessage id="DialogMenu.FormSubmit.JoinSession" />
                            </Button>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </>
    )
}

export default OnlineSession
