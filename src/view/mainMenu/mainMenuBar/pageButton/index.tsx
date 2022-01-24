import { useCustomSelector } from "hooks"
import { FormattedMessage } from "language"
import React, { memo } from "react"
import { MainMenuButton } from "../index.styled"

const PageButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    memo((props) => {
        const pageRank = useCustomSelector((state) => state.board.pageRank)
        const pageIndex = useCustomSelector(
            (state) => state.board.currentPageIndex
        )

        const currentPage = pageIndex + 1
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
