import styled from "styled-components"

export const ViewBackground = styled.div`
    -webkit-touch-callout: none; /* prevent callout to copy image, etc when tap to hold */
    -webkit-text-size-adjust: none; /* prevent webkit from resizing text to fit */
    -webkit-user-select: none; /* prevent copy paste, to allow, change 'none' to 'text' */
    user-select: none;
    touch-action: none;
    overflow: hidden;
    position: fixed;
    inset: 0;
`

export const ViewControl = styled.div`
    position: absolute;
    width: 0;
    height: 0;
`

export const Content = styled.div`
    position: relative;
`
