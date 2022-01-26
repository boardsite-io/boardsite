import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export enum MainMenuState {
    Closed,
    General,
    View,
    Page,
}

export enum MainSubMenuState {
    Closed,
    File,
    Edit,
    PageStyle,
    PageSize,
    GoTo,
    Settings,
}

export interface MenuState {
    mainMenuState: MainMenuState
    mainSubMenuState: MainSubMenuState
    aboutOpen: boolean
}
const initState: MenuState = {
    mainMenuState: MainMenuState.Closed,
    mainSubMenuState: MainSubMenuState.Closed,
    aboutOpen: false,
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
        OPEN_ABOUT: (state) => {
            state.aboutOpen = true
        },
        CLOSE_ABOUT: (state) => {
            state.aboutOpen = false
        },
    },
})

export const {
    SET_MAIN_MENU,
    SET_MAIN_SUB_MENU,
    CLOSE_MAIN_MENU,
    OPEN_ABOUT,
    CLOSE_ABOUT,
} = loadingSlice.actions

export default loadingSlice.reducer
