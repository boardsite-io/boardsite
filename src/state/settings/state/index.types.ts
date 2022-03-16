import { Subscribers } from "state/index.types"
import { Theme } from "theme"

export interface SettingsState {
    theme: Theme
    keepCentered: boolean
    directDraw: boolean
}

export type SettingsSubscription = "theme" | "settings"

export type SettingsSubscribers = Record<SettingsSubscription, Subscribers>
