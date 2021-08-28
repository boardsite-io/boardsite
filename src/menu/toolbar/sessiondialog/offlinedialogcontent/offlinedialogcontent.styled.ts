import styled from "styled-components"

interface UserColorProps {
    $color: string
}
export const UserColorButton = styled.button`
    background: ${(props: UserColorProps) => props.$color};
    height: 20px;
    width: 20px;
    border-radius: 100%;
    border: none;
    outline: none;
    margin-top: 18px;
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
