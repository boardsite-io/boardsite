import { PageId } from "state/board/state/index.types"
import {
    PageLayer,
    PageSubscribers,
    RenderTrigger,
    Subscribers,
    Subscription,
} from "./index.types"

export class SubscriptionState {
    subscribers: Subscribers = {
        ActiveTool: [],
        ColorPicker: [],
        EditMenu: [],
        FavoriteTools: [],
        PageBackgroundSetting: [],
        PageSizeMenu: [],
        PageSizeSetting: [],
        PageStyleMenu: [],
        ShapeTools: [],
        ToolRing: [],
        WidthPicker: [],
        UseLiveStroke: [],
        UseViewControl: [],
        PageContent: [],
        LayerConfig: [],
        Loading: [],
        MainMenu: [],
        MenuPageButton: [],
        Notification: [],
        Theme: [],
        RenderNG: [],
        Session: [],
        SessionDialog: [],
        Settings: [],
        SettingsMenu: [],
        ShortcutsOpen: [],
        SubscribeOpen: [],
        ViewTransform: [],
    }

    subscribe(subscription: Subscription, trigger: RenderTrigger) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(subscription: Subscription, trigger: RenderTrigger) {
        this.subscribers[subscription] = this.subscribers[subscription].filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(...subscriptions: Subscription[]): void {
        subscriptions.forEach((sub) => {
            this.subscribers[sub].forEach((trigger) => {
                trigger({})
            })
        })
    }

    // Custom subscription for pages and their layers

    pageSubscribers: PageSubscribers = {}

    subscribePage(
        pageLayer: PageLayer,
        pageId: PageId,
        trigger: RenderTrigger
    ): void {
        if (this.pageSubscribers[pageId] === undefined) {
            this.pageSubscribers[pageId] = {}
        }
        this.pageSubscribers[pageId] = {
            ...this.pageSubscribers[pageId],
            [pageLayer]: trigger,
        }
    }

    unsubscribePage(pageLayer: PageLayer, pageId: PageId): void {
        delete this.pageSubscribers[pageId]?.[pageLayer]
    }

    renderPageLayer(pageLayer: PageLayer, pageId: PageId): void {
        this.pageSubscribers[pageId]?.[pageLayer]?.({})
    }
}

export const subscriptionState = new SubscriptionState()
