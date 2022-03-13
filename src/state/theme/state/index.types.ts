import { Subscribers } from "state/index.types"
import { Theme } from "theme"

export interface ThemeState {
    theme: Theme
}

export type ThemeSubscription = "theme"

export type ThemeSubscribers = Record<ThemeSubscription, Subscribers>
