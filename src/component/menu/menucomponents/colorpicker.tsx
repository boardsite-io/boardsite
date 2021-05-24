import React from "react"
import { CustomPicker } from "react-color"

// const { Alpha } = require("react-color/lib/components/common")
import {
    EditableInput,
    Hue,
    Saturation,
} from "react-color/lib/components/common"
// color, hex, hsl oldHue, onChange, rgb, source

interface ColorPickerProps {
    color: any
    hex?: any
    hsl?: any
    hsv?: any
    oldHue?: any
    onChange?: any
    rgb?: any
    source?: any
}

const ColorPicker: React.FC<ColorPickerProps> = ({
    color,
    hex,
    hsl,
    hsv,
    oldHue,
    onChange,
    rgb,
    source,
}) => (
    <div className="color-picker">
        <div className="saturation">
            <Saturation
                color={color}
                // hex={hex}
                // hsl={hsl}
                // hsv={hsv}
                // oldHue={oldHue}
                onChange={onChange}
                // rgb={rgb}
                // source={source}
            />
        </div>
        <div className="hue">
            <Hue
                color={color}
                // hex={hex}
                // hsl={hsl}
                // hsv={hsv}
                // oldHue={oldHue}
                onChange={onChange}
                // rgb={rgb}
                // source={source}
                direction="horizontal"
                pointer={() => <div className="hue-pointer" />} // leave css empty for no pointer
            />
        </div>
        {/* <div className="alpha">
                <Alpha
                    color={color}
                    hex={hex}
                    hsl={hsl}
                    hsv={hsv}
                    oldHue={oldHue}
                    onChange={onChange}
                    rgb={rgb}
                    source={source}
                />
            </div> */}
        <div className="editableinput">
            <EditableInput
                value={color}
                onChange={onChange}
                style={{
                    input: {
                        border: "none",
                        outline: "none",
                        width: "190px",
                        height: "20px",
                        padding: "0px",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                    },
                }}
            />
        </div>
    </div>
)

export default CustomPicker(ColorPicker)
