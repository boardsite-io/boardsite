import styled from "styled-components"

export const UserInfo = styled.div`
    display: grid;
    grid-auto-flow: column;
    font-family: "Courier New", Courier, monospace;
    width: fit-content;
    gap: 5px;
    border-radius: 100%;
    padding-right: 6px;
    padding-bottom: 1rem;
`

interface UserColorProps {
    $color: string
}
export const UserColor = styled.div`
    background: ${(props: UserColorProps) => props.$color};
    width: 18px;
    height: 18px;
    border-radius: 100%;
    margin: auto;
`

export const UserAlias = styled.p`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: auto;
`
