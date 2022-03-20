import { StrokeStyle } from "View/Board/RenderNG/index.types"

export const getRandomColor = () => {
    const color = new Array(6)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")
    return "#".concat(color)
}

export const strokeStyleToRGBA = (style: StrokeStyle): string => {
    const r = parseInt(style.color.slice(1, 3), 16)
    const g = parseInt(style.color.slice(3, 5), 16)
    const b = parseInt(style.color.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${style.opacity})`
}
