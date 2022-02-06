import React, { memo } from "react"
import { Background } from "./Background"
import { PageProps } from "./index.types"
import { Content } from "./Content"
import { Live } from "./Live"

const Page: React.FC<PageProps> = memo((props) => {
    return (
        <>
            <Background {...props} />
            <Content {...props} />
            <Live {...props} />
        </>
    )
})

export default Page
