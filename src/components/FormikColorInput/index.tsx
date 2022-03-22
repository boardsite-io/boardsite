import React, { useCallback } from "react"
import { FieldProps } from "formik"
import { getRandomColor } from "util/color"
import { ColorButton } from "./index.styled"

const FormikColorInput: React.FC<FieldProps> = ({ form, field }) => {
    const onNewColor = useCallback(() => {
        form.setFieldValue(field.name, getRandomColor())
    }, [field, form])

    return (
        <ColorButton
            type="button"
            $color={field.value}
            onChange={onNewColor}
            onClick={onNewColor}
        />
    )
}
export default FormikColorInput
