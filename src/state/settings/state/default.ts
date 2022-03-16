import { DEFAULT_DIRECTDRAW, DEFAULT_KEEP_CENTERED } from "consts"
import { Theme } from "theme"
import { SettingsState } from "./index.types"

export const getDefaultSettingsState = (): SettingsState => ({
    theme: Theme.Light,
    keepCentered: DEFAULT_KEEP_CENTERED,
    directDraw: DEFAULT_DIRECTDRAW,
})
