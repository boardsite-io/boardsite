import { Button } from "components"
import styled, { css } from "styled-components"

export const Presets = styled.div`
    ${({ theme }) => css`
        margin: 6px 0;
        display: flex;
        align-items: center;
        box-shadow: ${theme.boxShadow};
        border-radius: ${theme.borderRadius};

        button:first-child {
            border-top-left-radius: ${theme.borderRadius};
            border-bottom-left-radius: ${theme.borderRadius};
        }
        button:last-child {
            border-top-right-radius: ${theme.borderRadius};
            border-bottom-right-radius: ${theme.borderRadius};
        }
    `}
`

export const CreateButtons = styled.div`
    display: grid;
    gap: 6px;
    grid-template-columns: repeat(2, 1fr);
`

export const PresetButton = styled(Button)<{ active: boolean }>`
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
