import React from "react"
import { FormattedMessage, useIntl } from "language"
import {
    DialogContent,
    DialogTitle,
    Button,
    FormikInput,
    FormikLabel,
    FormikColorInput,
} from "components"
import { Field, Form, Formik } from "formik"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import { online } from "state/online"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"
import { Selection } from "../OnlineChangeAlias/index.styled"
import { createOnlineSession } from "../helpers"
import { CreateButtons } from "./index.styled"

export interface CreateFormValues {
    alias: string
    color: string
    password: string
}

const OnlineCreate: React.FC = () => {
    const navigate = useNavigate()
    const { formatMessage: f } = useIntl()
    const { alias, color } = online.getState().user

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="Dialog.OnlineCreate.Title" />
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{ alias, color, password: "" }}
                    onSubmit={async ({
                        alias,
                        color,
                        password,
                    }: CreateFormValues) => {
                        online.setUser({
                            alias,
                            color,
                        })
                        await createOnlineSession({
                            fromCurrent: false,
                            password,
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
                                    id: "Dialog.OnlineCreate.Input.Alias.Required",
                                })
                            )
                            .min(
                                4,
                                f({
                                    id: "Dialog.OnlineCreate.Input.Alias.Length",
                                })
                            )
                            .max(
                                32,
                                f({
                                    id: "Dialog.OnlineCreate.Input.Alias.Length",
                                })
                            )
                            .matches(
                                /^[a-zA-Z0-9-_]{4,32}$/,
                                f({
                                    id: "Dialog.OnlineCreate.Input.Alias.Characters",
                                })
                            ),
                    })}
                >
                    {({ isSubmitting, values, setSubmitting }) => (
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
                                    <FormattedMessage id="Dialog.OnlineCreate.Input.Alias.Label" />
                                    <Field
                                        id="alias"
                                        name="alias"
                                        component={FormikInput}
                                    />
                                </FormikLabel>
                            </Selection>
                            <FormikLabel
                                htmlFor="password"
                                textAlign="left"
                                fullWidth
                            >
                                <FormattedMessage id="Dialog.OnlineCreate.Input.Password.Label" />
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={f({
                                        id: "Dialog.OnlineCreate.Input.Password.Placeholder",
                                    })}
                                    component={FormikInput}
                                />
                            </FormikLabel>
                            <p>
                                <FormattedMessage id="Dialog.OnlineCreate.Description.Create" />
                            </p>
                            <CreateButtons>
                                <Button
                                    type="submit"
                                    onClick={async () => {
                                        setSubmitting(true)
                                        online.setUser({
                                            alias: values.alias,
                                            color: values.color,
                                        })
                                        await createOnlineSession({
                                            fromCurrent: true,
                                            password: values.password,
                                            navigate,
                                        })
                                        setSubmitting(false)
                                    }}
                                    disabled={isSubmitting}
                                >
                                    <FormattedMessage id="Dialog.OnlineCreate.Button.Create" />
                                </Button>
                                <Button
                                    onClick={() => {
                                        menu.setDialogState(
                                            DialogState.OnlineJoin
                                        )
                                    }}
                                >
                                    <FormattedMessage id="Dialog.OnlineCreate.Button.Join" />
                                </Button>
                            </CreateButtons>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </>
    )
}

export default OnlineCreate
