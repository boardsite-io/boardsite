import { BsCloudUpload } from "react-icons/bs"
import styled from "styled-components"

interface Props {
    $hovering: boolean
}

export const StyledFileDropZone = styled.div`
    display: flex;
    height: 200px;
    width: 100%;
    min-width: 100px;
    background: ${(props: Props) => (props.$hovering ? "green" : "#eee")};
    border-radius: 5px;
    border-style: dashed;
    border-width: 1px;
    text-align: center;
    align-items: center;
    justify-content: center;
    :hover {
        cursor: pointer;
    }
`

export const StyledDivNoTouch = styled.div`
    pointer-events: none;
`

export const StyledIcon = styled(BsCloudUpload)`
    height: 50px;
    width: 50px;
`

export const StyledTitle = styled.h4`
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    margin-bottom: 10px;
    margin-top: 5px;
`

export const StyledSubtitle = styled.p`
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    margin-bottom: 5px;
    margin-top: 5px;
`
