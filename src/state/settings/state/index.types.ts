import { Theme } from "theme"
import { SerializedVersionState } from "../../types"

export interface SettingsState {
    theme: Theme
    keepCentered: boolean
    directDraw: boolean
}

export type SerializedSettingsState = SerializedVersionState<SettingsState>
