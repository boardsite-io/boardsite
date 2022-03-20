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
import { online } from "state/online"
import { notification } from "state/notification"
import * as Yup from "yup"
import { ROUTE } from "App/routes"
import { joinOnlineSession } from "../OnlineSession/helpers"
import { Selection } from "../OnlineSession/index.styled"
import { CreateFormValues } from "../OnlineSession"

const OnlineSessionJoinOnly: React.FC = () => {
    const navigate = useNavigate()
    const { formatMessage: f } = useIntl()
    const { sessionId } = useParams()
    const { alias, color } = online.getState().userSelection

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="DialogMenu.Online.JoinOnly.Title" />
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{ userAlias: alias, userColor: color }}
                    onSubmit={async ({
                        userAlias,
                        userColor,
                    }: CreateFormValues) => {
                        online.updateUser({
                            alias: userAlias,
                            color: userColor,
                        })
                        if (sessionId) {
                            await joinOnlineSession(sessionId, navigate)
                        } else {
                            notification.create(
                                "Notification.Session.JoinFailed"
                            )
                            navigate(ROUTE.HOME)
                        }
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
                    {({ isSubmitting }) => (
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
                                <FormattedMessage id="DialogMenu.FormSubmit.JoinSession" />
                            </Button>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </>
    )
}

export default OnlineSessionJoinOnly
