import styled, { css } from "styled-components"

export const OuterWrap = styled.div`
    width: 100%;
`

export type AlignItems = "center" | "flex-start" | "flex-end"
interface InputWrapperProps {
    $alignItems: AlignItems
}

export const InputWrapper = styled.div`
    position: relative;
    height: 4rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: ${({ $alignItems }: InputWrapperProps) => $alignItems};
`

interface InputLabelProps {
    $hasFocus: boolean
}

export const InputLabel = styled.label`
    pointer-events: none;
    position: absolute;
    transition: all 250ms;
    top: ${({ $hasFocus }: InputLabelProps) => ($hasFocus ? "0" : "1.5rem")};
    font-size: ${({ $hasFocus }: InputLabelProps) =>
        $hasFocus ? "0.9rem" : "1rem"};
    height: 1rem;
    color: ${({ theme }) => theme.palette.primary.contrastText};
    filter: brightness(70%);
`

export const InputHelperText = styled.label`
    pointer-events: none;
    position: absolute;
    bottom: 0;
    font-size: 0.9rem;
    height: 1rem;
    color: ${({ theme }) => theme.palette.primary.contrastText};
`

interface InputBarProps {
    $hasFocus: boolean
    $error: boolean
}

export const InputBar = styled.div`
    position: absolute;
    bottom: 1rem;
    transition: all 250ms;
    height: 1px;
    width: 100%;

    ${({ $error, $hasFocus }: InputBarProps) => {
        if ($error) {
            return css`
                background: ${({ theme }) => theme.palette.common.warning};
            `
        }
        if ($hasFocus) {
            return css`
                background: ${({ theme }) => theme.palette.secondary.main};
            `
        }
        return css`
            background: ${({ theme }) => theme.palette.primary.contrastText};
        `
    }};
`

export type TextAlign = "left" | "center" | "right"
interface InputProps {
    $textAlign: TextAlign
}

export const StyledInput = styled.input`
    color: ${({ theme }) => theme.palette.primary.contrastText};
    background: transparent;
    position: absolute;
    padding: 0;
    bottom: 1rem;
    height: 2rem;
    width: 100%;
    text-align: ${({ $textAlign }: InputProps) => $textAlign};
    outline: none;
    border: none;
    &:hover {
        cursor: text;
    }
`
