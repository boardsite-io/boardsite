import { Subscribers } from "state/index.types"

export enum MainMenuState {
    Closed,
    General,
    View,
    Page,
    Session,
}

export enum MainSubMenuState {
    Closed,
    File,
    Edit,
    PageStyle,
    PageSize,
    GoTo,
    Settings,
    SessionSettings,
}

export interface MenuState {
    mainMenuState: MainMenuState
    mainSubMenuState: MainSubMenuState
    shortcutsOpen: boolean
}

export type MenuSubscribers = {
    mainMenu: Subscribers
    mainSubMenu: Subscribers
    shortcutsOpen: Subscribers
}

export type MenuSubscription = keyof MenuSubscribers
