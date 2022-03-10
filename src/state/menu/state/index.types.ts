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
    subscribeOpen: boolean
}

export type MenuSubscription = "mainMenu" | "shortcutsOpen" | "subscribeOpen"

export type MenuSubscribers = Record<MenuSubscription, Subscribers>
