import styled from "styled-components"

export enum ScreenSize {
    Xs = "30rem",
    Sm = "50rem",
    Md = "60rem",
    Lg = "80rem",
    Xl = "100rem",
}

export const Theme = styled.div`
    /* --- General --- */
    --border-radius: 0.5rem;

    /* --- Stacking Context --- */
    --zIndexToolRing: 100;
    --zIndexFavoriteTools: 100;
    --zIndexMainMenu: 1000;
    --zIndexMainMenuBG: 900;
    --zIndexDialog: 1100;

    /* --- Menu Design --- */
    --toolbar-padding: 0.2rem;
    --toolbar-margin: 0.2rem;
    --toolbar-box-shadow: 0px 0px 2px 0px #00000088;
    --toolbar-border-radius: 0.5rem;

    --button-gap: 0.4rem;
    --button-border-radius: 0.35rem;
    --button-hover-transform: scale(1.2, 1.2);

    /* --- Font --- */
    body,
    input,
    select,
    textarea {
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
    }
    font-family: "Lato", sans-serif;
    font-size: 1rem;
    font-weight: 900;

    /* --- Color --- */
    --cWarning: red; // Warning text
    --cBackground: linear-gradient(#888888, #696969); // Global background
    --cMenuBackground: #f5f5f5; // Menu backgrounds
    --cMenuItems: #121212; // Menu items
    --cActiveTool: #d9d7f1; // Active tool background
    --cDetails: #00796b; // Small details, borders, rails
    --cDetails2: #37474f; // Small details, borders, rails
    --cDialogBackground: #000000aa; // Dialog background

    --main-menu-hover-filter: brightness(80%);
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
`
