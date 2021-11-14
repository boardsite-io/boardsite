import React, { memo } from "react"
import PageListener from "./listener"
import Strokes from "./strokes"
import PageBackground from "./background"
import { PageProps } from "./index.types"

const Page = memo<PageProps>((props) => (
    <>
        <PageBackground {...props} />
        <Strokes {...props} />
        <PageListener {...props} />
    </>
))

export default Page
