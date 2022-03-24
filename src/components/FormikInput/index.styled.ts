import styled, { css } from "styled-components"

export const FormikLabel = styled.label<{
    textAlign: "left" | "center"
    fullWidth?: boolean
}>`
    display: flex;
    flex-direction: column;
    margin: 0.5rem 0;
    color: ${({ theme }) => theme.palette.primary.contrastText}AA;

    ${({ fullWidth }) =>
        fullWidth &&
        css`
            width: 100%;
        `}
    ${({ textAlign }) =>
        textAlign &&
        css`
            text-align: ${textAlign};

            ${Input} {
                text-align: ${textAlign};
            }
        `}
`

export const Input = styled.input<{ isValid: boolean }>`
    padding: 5px 0;
    color: ${({ theme }) => theme.palette.primary.contrastText};
    background: transparent;
    outline: none;
    border: none;
    border-bottom: 1px solid;
    border-color: ${({ isValid, theme }) =>
        isValid
            ? theme.palette.secondary.main
            : theme.palette.primary.contrastText};

    :hover {
        cursor: text;
    }

    :disabled {
        filter: opacity(40%);
        cursor: not-allowed;
    }
`

export const ValidationError = styled.span`
    color: ${({ theme }) => theme.palette.common.warning};
    font-size: small;
`
