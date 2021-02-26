import React from "react"
import { MdRedo, MdUndo } from "react-icons/md"
import store from "../../../redux/store"

export default function UndoRedo() {
    // const canUndo = useSelector((state) => state.boardControl.past.length > 0)
    // const canRedo = useSelector((state) => state.boardControl.future.length > 0)

    return (
        <>
            <button
                type="button"
                id="icon-button"
                // disabled={!canUndo}
                onClick={() => {
                    store.dispatch()
                }}>
                <MdUndo id="icon" />
            </button>
            <button
                type="button"
                id="icon-button"
                // disabled={!canRedo}
                onClick={() => {
                    store.dispatch()
                }}>
                <MdRedo id="icon" />
            </button>
        </>
    )
}
