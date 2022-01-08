import { createSlice } from "@reduxjs/toolkit"

export interface MenuState {
    settingsOpen: boolean
    aboutOpen: boolean
    pageActionsOpen: boolean
    importMenuOpen: boolean
    exportMenuOpen: boolean
}
const initState: MenuState = {
    settingsOpen: false,
    aboutOpen: false,
    pageActionsOpen: false,
    importMenuOpen: false,
    exportMenuOpen: false,
}
const loadingSlice = createSlice({
    name: "menu",
    initialState: initState,
    reducers: {
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
        OPEN_PAGE_ACTIONS: (state) => {
            state.pageActionsOpen = true
        },
        CLOSE_PAGE_ACTIONS: (state) => {
            state.pageActionsOpen = false
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
    OPEN_SETTINGS,
    CLOSE_SETTINGS,
    OPEN_ABOUT,
    CLOSE_ABOUT,
    OPEN_PAGE_ACTIONS,
    CLOSE_PAGE_ACTIONS,
    OPEN_IMPORT_MENU,
    CLOSE_IMPORT_MENU,
    OPEN_EXPORT_MENU,
    CLOSE_EXPORT_MENU,
} = loadingSlice.actions

export default loadingSlice.reducer
