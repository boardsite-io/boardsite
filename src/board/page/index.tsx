import React, { FC } from "react"
import PageListener from "./listener"
import PageContent from "./content"
import PageBackground from "./background"
import { PageProps } from "./types"

const Page: FC<PageProps> = (props) => (
    <>
        <PageBackground {...props} />
        <PageContent {...props} />
        <PageListener {...props} />
    </>
)

export default Page
