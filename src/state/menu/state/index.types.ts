import { Subscribers } from "state/index.types"

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
}

export type MenuSubscribers = {
    mainMenu: Subscribers
    shortcutsOpen: Subscribers
}

export type MenuSubscription = keyof MenuSubscribers
