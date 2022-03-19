import React, { FC } from "react"
import { FieldProps } from "formik"
import { Input, ValidationError } from "./index.styled"

const FormikInput: FC<FieldProps> = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors, isValid, submitCount },
    ...props
}) => {
    return (
        <>
            <Input type="text" isValid={isValid} {...field} {...props} />
            {submitCount > 0 && touched[field.name] && errors[field.name] && (
                <ValidationError>{errors[field.name]}</ValidationError>
            )}
        </>
    )
}

export default FormikInput
