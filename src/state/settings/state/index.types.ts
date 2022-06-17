import { Theme } from "theme"
import { SerializedVersionState } from "state/types"

export interface SettingsState {
    theme: Theme
    keepCentered: boolean
    directDraw: boolean
}

export type SerializedSettingsState = SerializedVersionState<SettingsState>
