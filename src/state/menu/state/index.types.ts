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
    OnlineEnterPassword,
    OnlineChangeAlias,
    OnlineChangePassword,
    OnlineLeave,
    Subscribe,
}

export interface MenuState {
    dialogState: DialogState
    mainMenuState: MainMenuState
    shortcutsOpen: boolean
    textfieldSettingsOpen: boolean
}
