import { ThemeOption } from "theme/themes"
import { SerializedVersionState } from "state/types"

export interface SettingsState {
    theme: ThemeOption
    keepCentered: boolean
    directDraw: boolean
}

export type SerializedSettingsState = SerializedVersionState<SettingsState>
