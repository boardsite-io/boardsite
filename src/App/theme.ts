import styled from "styled-components"

export enum ScreenSize {
    Xs = "30rem",
    Sm = "50rem",
    Md = "60rem",
    Lg = "80rem",
    Xl = "100rem",
}

export const Theme = styled.div`
    /* --- Color --- */
    --cPrimary: #f5f5f5; // Menu backgrounds
    --cSecondary: #121212; // Menu items
    --cSelected: #d9d7f1; // Selected tool background
    --cBackground: #bcaaa4; // Global background
    --cWarning: red; // Warning text
    --cDetails: #00796b; // Small details, borders, rails
    --cDetails2: #37474f; // Small details, borders, rails
    --cDialogBackground: #000000aa; // Dialog background
    --cRule: #00000022; // Horizontal and vertical rule

    svg:not(#transitory-icon) {
        stroke: var(--cSecondary);
        stroke-width: var(--icon-stroke-width);
    }

    /* --- General --- */
    --border-radius: 0.5rem;
    --box-shadow: 0 1px 6px #00000033, 0 1px 4px #00000033;

    /* --- Stacking Context --- */
    --zIndexNotifications: 999;
    --zIndexToolTip: 99;
    --zIndexDrawer: 81;
    --zIndexDrawerBG: 80;
    --zIndexDialog: 81;
    --zIndexDialogBG: 80;
    --zIndexMainMenu: 70;
    --zIndexToolRing: 60;
    --zIndexFavoriteTools: 60;
    --zIndexPopupBG: 10;

    /* --- Menu Design --- */
    --toolbar-gap: 0;
    --toolbar-padding: 0;
    --toolbar-margin: 0.2rem;
    --toolbar-box-shadow: 0px 0px 2px 0px #00000088;
    --toolbar-border-radius: 0.5rem;

    --main-menu-button-gap: 0.5rem;
    --main-menu-button-padding: 0.4rem 0.6rem;
    --main-menu-button-margin: 0.1rem;
    --main-menu-hover-filter: brightness(80%);

    --button-border-radius: 0.35rem;
    --button-hover-transform: scale(1.2, 1.2);

    --icon-button-size: 2rem;
    --icon-button-margin: 0.25rem 0.5rem;
    --icon-button-padding: 0;
    --icon-stroke-width: 5;

    /* --- Font --- */
    body,
    input,
    button,
    select,
    textarea {
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
    }
    font-family: "Lato", sans-serif;
    font-size: 1rem;
    font-weight: 900;

    /* --- Style Picker --- */
    --style-picker-hue-width: 1.2rem;
    --style-picker-hue-height: 2rem;
    --style-picker-pointer-border: 2px solid var(--cPrimary);
`
