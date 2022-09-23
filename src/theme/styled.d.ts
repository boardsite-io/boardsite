import "styled-components"

interface IPalette {
    main: string
    contrastText: string
}

declare module "styled-components" {
    export interface DefaultTheme {
        palette: {
            primary: IPalette
            secondary: IPalette
            editor: {
                background: string
                paper: string
                selected: string
            }
            common: {
                warning: string
                rule: string
            }
        }
        tools: {
            selection: {
                fill: string
                handle: { color: string; size: string; borderRadius: string }
            }
            eraser: { stroke: string }
        }
        breakpoint: {
            sm: string
            md: string
            lg: string
            xl: string
            xxl: string
        }
        borderRadius: string
        boxShadow: string
        iconButton: {
            size: string
            margin: string
            padding: string
            strokeWidth: string
        }
        menuButton: {
            gap: string
            padding: string
            margin: string
            hoverFilter: string
        }
        toolbar: {
            gap: string
            padding: string
            margin: string
            boxShadow: string
        }
        colorPicker: {
            hue: {
                width: string
                height: string
            }
        }
        dialog: {
            background: string
        }
        zIndex: {
            notifications: string
            dialog: string
            dialogBG: string
            toolTip: string
            toolRing: string
            drawer: string
            drawerBG: string
            mainMenu: string
            favoriteTools: string
            popupBG: string
        }
    }
}
