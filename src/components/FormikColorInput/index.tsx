import React, { useCallback, useState } from "react"
import { FieldProps } from "formik"
import { getRandomColor } from "helpers"
import { ColorButton } from "./index.styled"

const FormikColorInput: React.FC<FieldProps> = ({ form, field }) => {
    const [color, setColor] = useState<string>(getRandomColor())

    const newColor = useCallback(() => {
        const newColor = getRandomColor()
        setColor(newColor)
        form.setFieldValue(field.name, newColor)
    }, [field, form])

    return (
        <ColorButton
            type="button"
            $color={color}
            onChange={newColor}
            onClick={newColor}
        />
    )
}
export default FormikColorInput
