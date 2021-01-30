import React, { memo } from "react"
import { nanoid } from "@reduxjs/toolkit"
import { Rect, Text } from "react-konva"
import {
    ADD_PAGE,
    CLEAR_PAGE,
    DELETE_PAGE,
} from "../../redux/slice/boardcontrol"
import store from "../../redux/store"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../constants"

function addPage(pageId) {
    store.dispatch(
        ADD_PAGE({
            pageId: nanoid(),
            pageIndex: store
                .getState()
                .boardControl.present.pageRank.indexOf(pageId),
        })
    )
}

function clearPage(pageId) {
    store.dispatch(CLEAR_PAGE(pageId))
}

function deletePage(pageId) {
    store.dispatch(DELETE_PAGE(pageId))
}

export default memo(({ pageId }) => (
    <>
        <Rect
            height={30}
            width={30}
            x={CANVAS_WIDTH + 20}
            y={
                (CANVAS_HEIGHT + 20) *
                store.getState().boardControl.present.pageRank.indexOf(pageId)
            }
            stroke="#000"
            strokeWidth={0}
            fill="#00d2be"
            shadowColor="#000000"
            shadowBlur={10}
            shadowOffset={{ x: 0, y: 0 }}
            shadowOpacity={0.5}
            cornerRadius={4}
            onClick={() => addPage(pageId)}
        />
        <Text
            x={CANVAS_WIDTH + 26.5}
            y={
                1.5 +
                (CANVAS_HEIGHT + 20) *
                    store
                        .getState()
                        .boardControl.present.pageRank.indexOf(pageId)
            }
            text="+"
            fontSize={30}
        />
        <Rect
            height={30}
            width={30}
            x={CANVAS_WIDTH + 20}
            y={
                50 +
                (CANVAS_HEIGHT + 20) *
                    store
                        .getState()
                        .boardControl.present.pageRank.indexOf(pageId)
            }
            stroke="#000"
            strokeWidth={0}
            fill="#00d2be"
            shadowColor="#000000"
            shadowBlur={10}
            shadowOffset={{ x: 0, y: 0 }}
            shadowOpacity={0.5}
            cornerRadius={4}
            onClick={() => clearPage(pageId)}
        />
        <Text
            x={CANVAS_WIDTH + 32}
            y={
                55 +
                (CANVAS_HEIGHT + 20) *
                    store
                        .getState()
                        .boardControl.present.pageRank.indexOf(pageId)
            }
            text="/"
            fontSize={25}
        />
        <Rect
            height={30}
            width={30}
            x={CANVAS_WIDTH + 20}
            y={
                100 +
                (CANVAS_HEIGHT + 20) *
                    store
                        .getState()
                        .boardControl.present.pageRank.indexOf(pageId)
            }
            stroke="#000"
            strokeWidth={0}
            fill="#00d2be"
            shadowColor="#000000"
            shadowBlur={10}
            shadowOffset={{ x: 0, y: 0 }}
            shadowOpacity={0.5}
            cornerRadius={4}
            onClick={() => deletePage(pageId)}
        />
        <Text
            x={CANVAS_WIDTH + 30}
            y={
                100 +
                (CANVAS_HEIGHT + 20) *
                    store
                        .getState()
                        .boardControl.present.pageRank.indexOf(pageId)
            }
            text="-"
            fontSize={30}
        />
    </>
))
