import { FormattedMessage } from "language"
import React, { memo } from "react"
import { useBoard } from "state/board"
import { MainMenuButton } from "../index.styled"

const PageButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    memo((props) => {
        const { currentPageIndex, pageRank } = useBoard("MenuPageButton")

        const currentPage = currentPageIndex + 1
        const numberPages = pageRank.length

        return (
            <MainMenuButton type="button" {...props}>
                {numberPages > 0 ? (
                    <FormattedMessage
                        id="Menu.Bar.Page"
                        values={{ currentPage, numberPages }}
                    />
                ) : (
                    <FormattedMessage id="Menu.Bar.Page.None" />
                )}
            </MainMenuButton>
        )
    })
export default PageButton
