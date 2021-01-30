import React from "react"
import { nanoid } from "@reduxjs/toolkit"
import { IconButton } from "@material-ui/core"
import ClearIcon from "@material-ui/icons/Clear"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import Tooltip from "@material-ui/core/Tooltip"
import MenuIcon from "@material-ui/icons/Menu"
import {
    ADD_PAGE,
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
} from "../../redux/slice/boardcontrol"
import store from "../../redux/store"

// helper functions

export function addPage(pageId) {
    store.dispatch(
        ADD_PAGE({
            pageId: nanoid(),
            pageIndex: store
                .getState()
                .boardControl.present.pageRank.indexOf(pageId),
        })
    )
}

export function clearPage(pageId) {
    store.dispatch(CLEAR_PAGE(pageId))
}

export function deletePage(pageId) {
    store.dispatch(DELETE_PAGE(pageId))
}

export function deleteAllPages() {
    store.dispatch(DELETE_ALL_PAGES({ pageid: nanoid() }))
}

/**
 *
 * @param {{pageId: string}} props
 */
export default function PageMenu({
    pageId,
    displayPageSettings,
    setDisplayPageSettings,
}) {
    // console.log("PageMenu Redraw");

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
