import styled, { css } from "styled-components"

interface Props {
    $deactivated?: boolean
    $active?: boolean
}

export const StyledIconButton = styled.button<Props>`
    ${({ theme, $active, $deactivated }) => css`
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        height: ${theme.iconButton.size};
        width: ${theme.iconButton.size};
        margin: ${theme.iconButton.margin};
        padding: ${theme.iconButton.padding};
        border: none;
        border-radius: ${theme.borderRadius};
        background: ${theme.palette.primary.main};

        /* color for non custom svgs */
        color: ${theme.palette.primary.contrastText};
        svg {
            transition: all 100ms ease-in-out;
            height: 80%;
            width: 80%;
        }

        ${$active
            ? css`
                  background: ${theme.palette.editor.selected};
              `
            : css`
                  &:hover {
                      svg {
                          transform: scale(1.2, 1.2);
                      }
                  }
              `};
        ${$deactivated
            ? css`
                  cursor: not-allowed;
                  svg {
                      stroke: ${theme.palette.primary.main};
                  }
              `
            : null};
    `}
`
