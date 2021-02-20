import React from "react"
import { BsFilePlus, BsFileMinus, BsFileRuled } from "react-icons/bs"
import {
    handleAddPageAt,
    handleClearPage,
    handleDeletePage,
} from "../../board/request_handlers"
import "../../../css/menucomponents/pageoptions.css"

export default function PageOptions() {
    return (
        <div className="pageoptions-wrap">
            <button
                type="button"
                id="icon-button"
                onClick={() => handleAddPageAt()}>
                <BsFilePlus id="icon" />
            </button>
            <button
                type="button"
                id="icon-button"
                onClick={() => handleDeletePage()}>
                <BsFileMinus id="icon" />
            </button>
            <button
                type="button"
                id="icon-button"
                onClick={() => handleClearPage()}>
                <BsFileRuled id="icon" />
            </button>
        </div>
    )
}
