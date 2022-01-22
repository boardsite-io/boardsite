import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export enum GeneralMenuState {
    Default,
    File,
    Edit,
    Page,
    PageStyle,
    PageSize,
    View,
}

export interface MenuState {
    generalMenuOpen: boolean
    generalMenuState: GeneralMenuState
    settingsOpen: boolean
    aboutOpen: boolean
    importMenuOpen: boolean
    exportMenuOpen: boolean
}
const initState: MenuState = {
    generalMenuOpen: false,
    generalMenuState: GeneralMenuState.Default,
    settingsOpen: false,
    aboutOpen: false,
    importMenuOpen: false,
    exportMenuOpen: false,
}
const loadingSlice = createSlice({
    name: "menu",
    initialState: initState,
    reducers: {
        OPEN_GENERAL_MENU: (state) => {
            state.generalMenuState = GeneralMenuState.Default
            state.generalMenuOpen = true
        },
        CLOSE_GENERAL_MENU: (state) => {
            state.generalMenuState = GeneralMenuState.Default
            state.generalMenuOpen = false
        },
        SET_GENERAL_MENU: (state, action: PayloadAction<GeneralMenuState>) => {
            state.generalMenuState = action.payload
        },
        OPEN_SETTINGS: (state) => {
            state.settingsOpen = true
        },
        CLOSE_SETTINGS: (state) => {
            state.settingsOpen = false
        },
        OPEN_ABOUT: (state) => {
            state.aboutOpen = true
        },
        CLOSE_ABOUT: (state) => {
            state.aboutOpen = false
        },
        OPEN_IMPORT_MENU: (state) => {
            state.importMenuOpen = true
        },
        CLOSE_IMPORT_MENU: (state) => {
            state.importMenuOpen = false
        },
        OPEN_EXPORT_MENU: (state) => {
            state.exportMenuOpen = true
        },
        CLOSE_EXPORT_MENU: (state) => {
            state.exportMenuOpen = false
        },
    },
})

export const {
    SET_GENERAL_MENU,
    OPEN_GENERAL_MENU,
    CLOSE_GENERAL_MENU,
    OPEN_SETTINGS,
    CLOSE_SETTINGS,
    OPEN_ABOUT,
    CLOSE_ABOUT,
    OPEN_IMPORT_MENU,
    CLOSE_IMPORT_MENU,
    OPEN_EXPORT_MENU,
    CLOSE_EXPORT_MENU,
} = loadingSlice.actions

export default loadingSlice.reducer
