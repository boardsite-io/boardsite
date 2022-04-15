import { Button } from "components"
import styled, { css } from "styled-components"

export const Presets = styled.div`
    margin: 6px 0;
    display: flex;
    align-items: center;
    box-shadow: var(--box-shadow);

    button:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
    }
    button:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
    }
`

export const CreateButtons = styled.div`
    display: flex;
    gap: 6px;
    align-items: center;
`

export const SizeButton = styled(Button)<{ active: boolean }>`
    :focus {
        z-index: 1; /* prevent other buttons from overlapping focus outline */
    }
    margin: 0;
    padding: 6px;
    border-radius: 0;
    box-shadow: none;
    ${({ active }) =>
        active
            ? css`
                  filter: brightness(140%);
              `
            : undefined}
`
