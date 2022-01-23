import styled from "styled-components"

export enum ScreenSize {
    Xs = "30rem",
    Sm = "50rem",
    Md = "60rem",
    Lg = "80rem",
    Xl = "100rem",
}

export const Theme = styled.div`
    // Warning text
    --cWarning: red;
    // Global background
    --cBackground: linear-gradient(#888888, #696969);
    // Menu backgrounds
    --cMenuBackground: white;
    // Menu items
    --cMenuItems: black;
    // Active tool background
    --cActiveTool: #d9d7f1;
    // Small details, borders, rails
    --cDetails: #00796b;
    --cDetails2: #37474f;
    // Dialog background
    --cDialogBackground: #000000aa;

    --box-shadow: 0 1px 6px #00000033, 0 1px 4px #00000033;

    --icon-button-size: 2rem;
    --icon-stroke-width: 6;

    svg:not(#transitory-icon) {
        stroke: var(--cMenuItems);
        stroke-width: var(--icon-stroke-width);
    }

    --style-picker-hue-width: 1.2rem;
    --style-picker-hue-height: 2rem;
    --style-picker-pointer-border: 2px solid var(--cMenuBackground);

    --menu-padding: 0.2rem;
    --menubar-box-shadow: 0px 0px 2px 0px #00000088;
    --menubar-border-radius: 0.5rem;

    --button-gap: 0.4rem;
    --button-border-radius: 0.35rem;
    --button-hover-transform: scale(1.2, 1.2);

    font-family: "Lato", sans-serif;
    font-size: 1rem;
    font-weight: 900;

    body,
    input,
    select,
    textarea {
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
    }

    /* Scrollbar Styling .. TODO: check if div:: is a good approach */
    --padding-hack: 0.2rem;
    --scrollbar-width: 0.6rem;
    div::-webkit-scrollbar {
        width: calc(var(--scrollbar-width) + var(--padding-hack));
    }
    div::-webkit-scrollbar-track {
        box-shadow: inset 0 0 10rem 10rem #00000010;
    }
    div::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 10rem 10rem #bbbbbe;
    }
    div::-webkit-scrollbar-track,
    div::-webkit-scrollbar-thumb {
        border: solid var(--padding-hack) transparent;
        border-radius: 10rem;
    }
`
