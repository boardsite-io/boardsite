import { FormattedMessage } from "language"
import React, { memo } from "react"
import { useGState } from "state"
import { view } from "state/view"
import { MainMenuButton } from "../index.styled"

const PageButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    memo((props) => {
        const { pageRank } = useGState("MenuPageButton").board

        const currentPage = view.getPageIndex() + 1
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
