import styled from "styled-components"

export const UserList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0rem;
    max-height: 20rem;
    overflow-y: scroll;
`

export const UserInfo = styled.div`
    display: flex;
    justify-items: left;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    height: 2rem;
`

interface UserColorProps {
    $color: string
}

export const UserColor = styled.div`
    background: ${(props: UserColorProps) => props.$color};
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 100%;
`

export const UserAlias = styled.p`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
