import React, { useCallback } from "react"
import { FieldProps } from "formik"
import { getRandomColor } from "util/color"
import { FormattedMessage } from "language"
import ToolTip from "../ToolTip"
import { Position } from "../ToolTip/index.types"
import { ColorButton } from "./index.styled"

const FormikColorInput: React.FC<FieldProps> = ({ form, field }) => {
    const onNewColor = useCallback(() => {
        form.setFieldValue(field.name, getRandomColor())
    }, [field, form])

    return (
        <ToolTip
            position={Position.TopRight}
            text={<FormattedMessage id="ToolTip.UserColor" />}
        >
            <ColorButton
                type="button"
                $color={field.value}
                onChange={onNewColor}
                onClick={onNewColor}
            />
        </ToolTip>
    )
}
export default FormikColorInput
