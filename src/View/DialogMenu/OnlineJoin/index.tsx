import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FormattedMessage, useIntl } from "language"
import {
    Button,
    DialogContent,
    DialogTitle,
    FormikColorInput,
    FormikInput,
    FormikLabel,
} from "components"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { online } from "state/online"
import { Selection } from "../OnlineChangeAlias/index.styled"

export interface JoinFormValues {
    alias: string
    color: string
    sessionId: string
}

const OnlineJoin: React.FC = () => {
    const navigate = useNavigate()
    const { formatMessage: f } = useIntl()
    const { sessionId = "" } = useParams()

    const { alias, color } = online.getState().user

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="Dialog.OnlineJoin.Title" />
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{ alias, color, sessionId }}
                    onSubmit={async ({
                        alias,
                        color,
                        sessionId,
                    }: JoinFormValues) => {
                        online.setUser({
                            alias,
                            color,
                        })
                        await online.joinOnlineSession({
                            sessionId,
                            navigate,
                        })
                    }}
                    validationSchema={Yup.object().shape({
                        color: Yup.string()
                            .required()
                            .matches(/^#[a-fA-F0-9]{6}$/),
                        alias: Yup.string()
                            .required(
                                f({
                                    id: "Dialog.OnlineJoin.Input.Alias.Required",
                                })
                            )
                            .matches(
                                /^.{4,32}$/,
                                f({
                                    id: "Dialog.OnlineJoin.Input.Alias.Length",
                                })
                            )
                            .matches(
                                /^[a-zA-Z0-9-_]{4,32}$/,
                                f({
                                    id: "Dialog.OnlineJoin.Input.Alias.Characters",
                                })
                            ),
                        sessionId: Yup.string()
                            .required(
                                f({
                                    id: "Dialog.OnlineJoin.Input.SessionId.Required",
                                })
                            )
                            .matches(
                                /^[a-zA-Z0-9]{8,20}$/,
                                f({
                                    id: "Dialog.OnlineJoin.Input.SessionId.Characters",
                                })
                            ),
                    })}
                >
                    {({ isSubmitting }) => (
                        <Form spellCheck="false">
                            <Selection>
                                <FormikLabel htmlFor="color" textAlign="left">
                                    <Field
                                        id="color"
                                        name="color"
                                        component={FormikColorInput}
                                    />
                                </FormikLabel>
                                <FormikLabel
                                    htmlFor="alias"
                                    textAlign="left"
                                    fullWidth
                                >
                                    <FormattedMessage id="Dialog.OnlineJoin.Input.Alias.Label" />
                                    <Field
                                        id="alias"
                                        name="alias"
                                        component={FormikInput}
                                    />
                                </FormikLabel>
                            </Selection>
                            <FormikLabel htmlFor="sessionId" textAlign="left">
                                <FormattedMessage id="Dialog.OnlineJoin.Input.SessionId.Label" />
                                <Field
                                    id="sessionId"
                                    name="sessionId"
                                    placeholder={f({
                                        id: "Dialog.OnlineJoin.Input.SessionId.Placeholder",
                                    })}
                                    component={FormikInput}
                                />
                            </FormikLabel>
                            <Button type="submit" disabled={isSubmitting}>
                                <FormattedMessage id="Dialog.OnlineJoin.SubmitButton.JoinSession" />
                            </Button>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </>
    )
}

export default OnlineJoin
