import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { MainMenuState, MainSubMenuState, MenuState } from "./index.types"

const initState: MenuState = {
    mainMenuState: MainMenuState.Closed,
    mainSubMenuState: MainSubMenuState.Closed,
    shortcutsOpen: false,
}
const loadingSlice = createSlice({
    name: "menu",
    initialState: initState,
    reducers: {
        CLOSE_MAIN_MENU: (state) => {
            state.mainMenuState = MainMenuState.Closed
            state.mainSubMenuState = MainSubMenuState.Closed
        },
        SET_MAIN_MENU: (state, action: PayloadAction<MainMenuState>) => {
            state.mainMenuState = action.payload
        },
        SET_MAIN_SUB_MENU: (state, action: PayloadAction<MainSubMenuState>) => {
            state.mainSubMenuState = action.payload
        },
        OPEN_SHORTCUTS: (state) => {
            state.shortcutsOpen = true
        },
        CLOSE_SHORTCUTS: (state) => {
            state.shortcutsOpen = false
        },
    },
})

export const {
    SET_MAIN_MENU,
    SET_MAIN_SUB_MENU,
    CLOSE_MAIN_MENU,
    OPEN_SHORTCUTS,
    CLOSE_SHORTCUTS,
} = loadingSlice.actions

export default loadingSlice.reducer
