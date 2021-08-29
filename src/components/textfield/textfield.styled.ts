import styled from "styled-components"

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
        $hasFocus ? "0.7rem" : "1rem"};
    height: 1rem;
    padding: 0;
    margin: 0;
    color: #00000088;
    /* background: black; */
`

export const InputHelperText = styled.label`
    pointer-events: none;
    position: absolute;
    bottom: 0;
    font-size: 0.7rem;
    height: 1rem;
    color: #00000088;
    /* background: black; */
`

interface InputBarProps {
    $hasFocus: boolean
}
export const InputBar = styled.div`
    position: absolute;
    bottom: 1rem;
    transition: all 250ms;
    height: 1px;
    width: 100%;
    background: ${({ $hasFocus }: InputBarProps) =>
        $hasFocus ? "#00ff0088" : "#00000088"};
    /* background: black; */
`

export type TextAlign = "left" | "center" | "right"
interface InputProps {
    $textAlign: TextAlign
}
export const StyledInput = styled.input`
    padding: 0;
    position: absolute;
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
