import styled from "styled-components"

export const SessionInfoWrapper = styled.div`
    position: fixed;
    left: 10px;
    top: 90px;
    overflow: hidden;
    border-radius: var(--menubar-border-radius);
    max-height: 500px;
    pointer-events: none;
    display: grid;
    grid-auto-flow: row;
    gap: 10px;
`

export const UserInfo = styled.div`
    background: #00000066;
    display: grid;
    grid-auto-flow: column;
    font-family: "Courier New", Courier, monospace;
    font-size: small;
    height: 18px;
    width: fit-content;
    max-width: 250px;
    gap: 5px;
    border-radius: 100px;
    padding-right: 6px;
`

interface UserColorProps {
    $color: string
}
export const UserColor = styled.div`
    background: ${(props: UserColorProps) => props.$color};
    width: 18px;
    height: 18px;
    border-radius: 100px;
    margin: auto;
`

export const UserAlias = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: white;
    width: 100%;
    margin: auto;
`
