import styled from "styled-components"

export const StyledView = styled.div`
    position: fixed;
    inset: 0;
    background: var(--color0);
    -webkit-touch-callout: none; /* prevent callout to copy image, etc when tap to hold */
    -webkit-text-size-adjust: none; /* prevent webkit from resizing text to fit */
    -webkit-user-select: none; /* prevent copy paste, to allow, change 'none' to 'text' */
    user-select: none;
    touch-action: none;
`