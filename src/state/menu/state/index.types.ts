export enum MainMenuState {
    Closed,
    General,
    View,
    Page,
    Session,
}

export interface MenuState {
    mainMenuState: MainMenuState
    shortcutsOpen: boolean
    subscribeOpen: boolean
}
