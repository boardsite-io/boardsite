export enum MainMenuState {
    Closed,
    General,
    View,
    Page,
    Session,
}

export enum DialogState {
    Closed,
    InitialSelectionFirstLoad,
    InitialSelection,
    OnlineCreate,
    OnlineJoin,
    OnlineChangeAlias,
    OnlineChangePassword,
}

export interface MenuState {
    dialogState: DialogState
    mainMenuState: MainMenuState
    shortcutsOpen: boolean
    subscribeOpen: boolean
}
