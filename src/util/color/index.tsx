import { StrokeStyle } from "View/Board/RenderNG/index.types"

export const getRandomColor = () => {
    const letters = "0123456789ABCDEF"
    let color = "#"

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }

    return color
}

export const strokeStyleToRGBA = (style: StrokeStyle): string => {
    const r = parseInt(style.color.slice(1, 3), 16)
    const g = parseInt(style.color.slice(3, 5), 16)
    const b = parseInt(style.color.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${style.opacity})`
}
