import React, { useState } from "react"
import { nanoid } from "@reduxjs/toolkit"
import { IconButton } from "@material-ui/core"
import ClearIcon from "@material-ui/icons/Clear"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import Tooltip from "@material-ui/core/Tooltip"
import MenuIcon from "@material-ui/icons/Menu"
import {
    actAddPage,
    actClearPage,
    actDeletePage,
    actDeleteAll,
} from "../../redux/slice/boardcontrol"
import store from "../../redux/store"

// helper functions

export function addPage(pageId) {
    store.dispatch(
        actAddPage({
            pageId: nanoid(),
            pageIndex: store
                .getState()
                .boardControl.present.pageRank.indexOf(pageId),
        })
    )
}

export function clearPage(pageId) {
    store.dispatch(actClearPage(pageId))
}

export function deletePage(pageId) {
    store.dispatch(actDeletePage(pageId))
}

export function deleteAllPages() {
    store.dispatch(actDeleteAll())
}

/**
 *
 * @param {{pageId: string}} props
 */
export default function PageMenu({ pageId }) {
    // console.log("PageMenu Redraw");
    const [displayPageSettings, setDisplayPageSettings] = useState(false)

    function openPageSettings() {
        setDisplayPageSettings(true)
    }

    function closePageSettings() {
        setDisplayPageSettings(false)
    }

    return (
        <div>
            <Tooltip
                id="tooltip"
                title="page settings"
                TransitionProps={{ timeout: 0 }}
                placement="bottom">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={openPageSettings}>
                    <MenuIcon color="secondary" id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            {
                // Palette Popup
                displayPageSettings ? (
                    <div className="pagesettingspopup">
                        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                        <div
                            className="cover"
                            onClick={closePageSettings}
                            onKeyPress={() => {}}
                        />
                        <div className="pagesettings">
                            <Tooltip
                                id="tooltip"
                                title="clear Page"
                                TransitionProps={{ timeout: 0 }}
                                placement="left">
                                <IconButton
                                    id="iconButton"
                                    variant="contained"
                                    onClick={() => {
                                        clearPage(pageId)
                                        closePageSettings()
                                    }}>
                                    <ClearIcon
                                        color="secondary"
                                        id="iconButtonInner"
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                id="tooltip"
                                title="add page"
                                TransitionProps={{ timeout: 0 }}
                                placement="left">
                                <IconButton
                                    id="iconButton"
                                    variant="contained"
                                    onClick={() => {
                                        addPage(pageId)
                                        closePageSettings()
                                    }}>
                                    <AddIcon
                                        color="secondary"
                                        id="iconButtonInner"
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                id="tooltip"
                                title="delete page"
                                TransitionProps={{ timeout: 0 }}
                                placement="left">
                                <IconButton
                                    id="iconButton"
                                    variant="contained"
                                    onClick={() => {
                                        deletePage(pageId)
                                        closePageSettings()
                                    }}>
                                    <RemoveIcon
                                        color="secondary"
                                        id="iconButtonInner"
                                    />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}
