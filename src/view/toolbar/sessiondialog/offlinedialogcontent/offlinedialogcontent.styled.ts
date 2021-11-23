import styled from "styled-components"

interface UserColorProps {
    $color: string
}

export const UserColorButton = styled.button`
    background: ${(props: UserColorProps) => props.$color};
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 100%;
    border: none;
    outline: none;
    &:hover {
        cursor: pointer;
    }
`

export const UserSelection = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 1rem;
`

export const OfflineDialogWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
`
