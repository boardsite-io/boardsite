import styled from "styled-components"

export const ViewWrap = styled.div`
    position: fixed;
    display: flex;
    inset: 0;
    background: var(--cBackground);
    -webkit-touch-callout: none; /* prevent callout to copy image, etc when tap to hold */
    -webkit-text-size-adjust: none; /* prevent webkit from resizing text to fit */
    -webkit-user-select: none; /* prevent copy paste, to allow, change 'none' to 'text' */
    user-select: none;
    touch-action: none;
`