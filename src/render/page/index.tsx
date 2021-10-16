import React, { FC } from "react"
import PageListener from "./listener"
import Strokes from "./strokes"
import PageBackground from "./background"
import { PageProps } from "./types"

const Page: FC<PageProps> = (props) => (
    <>
        <PageBackground {...props} />
        <Strokes {...props} />
        <PageListener {...props} />
    </>
)

export default Page
