import { DrawerTitle } from "components"
import { FormattedMessage } from "language"
import React from "react"
import { menu, useMenu } from "state/menu"
import { ShortcutDrawer, ShortcutList } from "./index.styled"
import Shortcut from "./Shortcut"

const Shortcuts = () => {
    const { shortcutsOpen } = useMenu("shortcutsOpen")

    return (
        <ShortcutDrawer
            open={shortcutsOpen}
            onClose={() => menu.closeShortcuts()}
        >
            <DrawerTitle>
                <FormattedMessage id="Shortcut.Title" />
            </DrawerTitle>
            <ShortcutList>
                <Shortcut
                    titleId="Shortcut.File.New"
                    keysId="Shortcut.File.New.Keys"
                />
                <Shortcut
                    titleId="Shortcut.File.Open"
                    keysId="Shortcut.File.Open.Keys"
                />
                <Shortcut
                    titleId="Shortcut.File.Save"
                    keysId="Shortcut.File.Save.Keys"
                />
                <Shortcut titleId="Shortcut.Undo" keysId="Shortcut.Undo.Keys" />
                <Shortcut titleId="Shortcut.Redo" keysId="Shortcut.Redo.Keys" />
                <Shortcut
                    titleId="Shortcut.Page.AddOver"
                    keysId="Shortcut.Page.AddOver.Keys"
                />
                <Shortcut
                    titleId="Shortcut.Page.AddUnder"
                    keysId="Shortcut.Page.AddUnder.Keys"
                />
                <Shortcut
                    titleId="Shortcut.Page.DeleteCurrent"
                    keysId="Shortcut.Page.DeleteCurrent.Keys"
                />
                <Shortcut
                    titleId="Shortcut.Tool.Active"
                    keysId="Shortcut.Tool.Active.Keys"
                />
                <Shortcut
                    titleId="Shortcut.Tool.Eraser"
                    keysId="Shortcut.Tool.Eraser.Keys"
                />
                <Shortcut
                    titleId="Shortcut.Tool.Selection"
                    keysId="Shortcut.Tool.Selection.Keys"
                />
                <Shortcut
                    titleId="Shortcut.Tool.Panning"
                    keysId="Shortcut.Tool.Panning.Keys"
                />
                <Shortcut
                    titleId="Shortcut.Tool.Pen"
                    keysId="Shortcut.Tool.Pen.Keys"
                />
                <Shortcut
                    titleId="Shortcut.Tool.Line"
                    keysId="Shortcut.Tool.Line.Keys"
                />
                <Shortcut
                    titleId="Shortcut.Tool.Rectangle"
                    keysId="Shortcut.Tool.Rectangle.Keys"
                />
                <Shortcut
                    titleId="Shortcut.Tool.Circle"
                    keysId="Shortcut.Tool.Circle.Keys"
                />
                <Shortcut
                    titleId="Shortcut.FirstPage"
                    keysId="Shortcut.FirstPage.Keys"
                />
                <Shortcut
                    titleId="Shortcut.LastPage"
                    keysId="Shortcut.LastPage.Keys"
                />
                <Shortcut
                    titleId="Shortcut.PreviousPage"
                    keysId="Shortcut.PreviousPage.Keys"
                />
                <Shortcut
                    titleId="Shortcut.NextPage"
                    keysId="Shortcut.NextPage.Keys"
                />
            </ShortcutList>
        </ShortcutDrawer>
    )
}
export default Shortcuts
