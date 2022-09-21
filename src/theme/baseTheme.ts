import { DefaultTheme } from "styled-components"

export const baseTheme: Omit<DefaultTheme, "palette"> = {
    breakpoint: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        xxl: "1400px",
    },
    borderRadius: "4px",
    boxShadow: "0 1px 6px #00000033, 0 1px 4px #00000033",
    iconButton: {
        size: "2rem",
        margin: "0.25rem 0.5rem",
        padding: "0",
        strokeWidth: "5",
    },
    menuButton: {
        gap: "10px",
        padding: "7px 10px",
        margin: "3px",
        hoverFilter: "brightness(80%)",
    },
    toolbar: {
        gap: "0",
        padding: "0",
        margin: "0.2rem",
        boxShadow: "0px 0px 2px 0px #00000088",
    },
    colorPicker: {
        hue: {
            width: "1.2rem",
            height: "2rem",
        },
    },
    dialog: {
        background: "#000000aa",
    },
    zIndex: {
        notifications: "9999",
        dialog: "1000",
        dialogBG: "999",
        toolTip: "888",
        toolRing: "777",
        drawer: "81",
        drawerBG: "80",
        mainMenu: "70",
        favoriteTools: "60",
        popupBG: "10",
    },
}
