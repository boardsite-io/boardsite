import React from "react"
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
import * as Yup from "yup"
import { Selection } from "./index.styled"

export interface ChangeAliasFormValues {
    alias: string
    color: string
}

const OnlineChangeAlias: React.FC = () => {
    const { formatMessage: f } = useIntl()
    const { alias, color } = online.getState().user

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="Dialog.OnlineChangeAlias.Title" />
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{ alias, color }}
                    onSubmit={async ({
                        alias,
                        color,
                    }: ChangeAliasFormValues) => {
                        online.setUser({
                            alias,
                            color,
                        })
                        // TODO: Change alias
                    }}
                    validationSchema={Yup.object().shape({
                        color: Yup.string()
                            .required()
                            .matches(/^#[a-fA-F0-9]{6}$/),
                        alias: Yup.string()
                            .required(
                                f({
                                    id: "Dialog.OnlineChangeAlias.Input.Alias.Required",
                                })
                            )
                            .matches(
                                /^.{4,32}$/,
                                f({
                                    id: "Dialog.OnlineChangeAlias.Input.Alias.Length",
                                })
                            )
                            .matches(
                                /^[a-zA-Z0-9-_]{4,32}$/,
                                f({
                                    id: "Dialog.OnlineChangeAlias.Input.Alias.Characters",
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
                                    <FormattedMessage id="Dialog.OnlineChangeAlias.Input.Alias.Label" />
                                    <Field
                                        id="alias"
                                        name="alias"
                                        component={FormikInput}
                                    />
                                </FormikLabel>
                            </Selection>
                            <Button type="submit" disabled={isSubmitting}>
                                <FormattedMessage id="Dialog.OnlineChangeAlias.SubmitButton.ChangeAlias" />
                            </Button>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </>
    )
}

export default OnlineChangeAlias
