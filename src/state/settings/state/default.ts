import { DEFAULT_DIRECTDRAW, DEFAULT_KEEP_CENTERED } from "consts"
import { ThemeOption } from "theme/themes"
import { SettingsState } from "./index.types"

export const getDefaultSettingsState = (): SettingsState => ({
    theme: ThemeOption.Light,
    keepCentered: DEFAULT_KEEP_CENTERED,
    directDraw: DEFAULT_DIRECTDRAW,
})
