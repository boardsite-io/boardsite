import styled from "styled-components"
import MenuItem from "View/MainMenu/MenuItem"

const opacityGradient1 = 0.5
const opacityGradient2 = 1

export const AuthenticatedMenuItem = styled(MenuItem)`
    background: linear-gradient(
            108deg,
            rgba(255, 215, 0, ${opacityGradient1}) 0%,
            rgba(255, 124, 30, ${opacityGradient1}) 20%,
            rgba(255, 61, 161, ${opacityGradient1}) 40%,
            rgba(255, 0, 247, ${opacityGradient1}) 60%,
            rgba(176, 0, 254, ${opacityGradient1}) 80%,
            rgba(82, 0, 254, ${opacityGradient1}) 100%
        ),
        linear-gradient(
            45deg,
            rgba(255, 215, 0, ${opacityGradient2}) 0%,
            rgba(255, 124, 30, ${opacityGradient2}) 20%,
            rgba(255, 61, 161, ${opacityGradient2}) 40%,
            rgba(255, 0, 247, ${opacityGradient2}) 60%,
            rgba(176, 0, 254, ${opacityGradient2}) 80%,
            rgba(82, 0, 254, ${opacityGradient2}) 100%
        );
`
