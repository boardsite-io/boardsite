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
    shortcutsOpen: boolean
}
