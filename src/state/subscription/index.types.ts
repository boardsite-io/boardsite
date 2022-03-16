import { PageId } from "state/board/state/index.types"

export type Subscription =
    // Board
    | "RenderNG"
    | "MenuPageButton"
    | "EditMenu"
    | "SettingsMenu"
    // Drawing
    | "PageBackgroundSetting"
    | "PageSizeSetting"
    | "ActiveTool"
    | "ColorPicker"
    | "WidthPicker"
    | "ToolRing"
    | "FavoriteTools"
    | "ShapeTools"
    | "PageSizeMenu"
    | "PageStyleMenu"
    | "UseViewControl"
    | "UseLiveStroke"
    | "PageContent"
    // Loading
    | "Loading"
    // Menu
    | "MainMenu"
    | "ShortcutsOpen"
    | "SubscribeOpen"
    // Notification
    | "Notification"
    // Online
    | "Session"
    | "UserSelection"
    // Settings
    | "Theme"
    | "Settings"
    // View
    | "LayerConfig"
    | "ViewTransform"

export type RenderTrigger = React.Dispatch<React.SetStateAction<object>>
export type Subscribers = Record<Subscription, RenderTrigger[]>

export type PageLayer = "background" | "content" | "transformer"
export type PageLayerTriggers = Record<PageLayer, RenderTrigger>
export type PageSubscribers = Record<
    PageId,
    Partial<PageLayerTriggers> | undefined
>
