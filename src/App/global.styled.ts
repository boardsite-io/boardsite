import styled from "styled-components"

export enum Breakpoint {
    Sm = "576px",
    Md = "768px",
    Lg = "992px",
    Xl = "1200px",
    Xxl = "1400px",
}

export const SELECTION_FILL = "#00a2ff38"
export const ERASER_STROKE = "#77110511"

export const GlobalStyles = styled.div`
    /* --- Color --- */
    --cDialogBackground: #000000aa; // Dialog background dimming
    color: ${({ theme }) => theme.palette.primary.contrastText};

    svg:not(.external-icon) {
        stroke: ${({ theme }) => theme.palette.primary.contrastText};
        stroke-width: var(--icon-stroke-width);
    }

    /* --- Selection Tool --- */
    --sel-color: ${SELECTION_FILL};
    --sel-handle-color: #00245366;
    --sel-handle-size: 0.75rem;
    --sel-handle-border-radius: 2px;

    /* --- General --- */
    --border-radius: 4px;
    --box-shadow: 0 1px 6px #00000033, 0 1px 4px #00000033;
    --page-box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;

    /* --- Stacking Context --- */
    --zIndexNotifications: 9999;
    --zIndexDialog: 1000;
    --zIndexDialogBG: 999;
    --zIndexToolTip: 888;
    --zIndexToolRing: 777;
    --zIndexDrawer: 81;
    --zIndexDrawerBG: 80;
    --zIndexMainMenu: 70;
    --zIndexFavoriteTools: 60;
    --zIndexPopupBG: 10;

    /* --- Menu Design --- */
    --toolbar-gap: 0;
    --toolbar-padding: 0;
    --toolbar-margin: 0.2rem;
    --toolbar-box-shadow: 0px 0px 2px 0px #00000088;

    --main-menu-button-gap: 10px;
    --main-menu-button-padding: 7px 10px;
    --main-menu-button-margin: 3px;
    --main-menu-hover-filter: brightness(80%);

    --button-hover-transform: scale(1.2, 1.2);

    --icon-button-size: 2rem;
    --icon-button-margin: 0.25rem 0.5rem;
    --icon-button-padding: 0;
    --icon-stroke-width: 5;

    /* --- Font --- */
    font-family: "Lato", sans-serif;
    font-size: 16px;
    font-weight: 400;

    body,
    input,
    button,
    select,
    textarea,
    ul,
    li {
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
    }

    /* --- Style Picker --- */
    --style-picker-hue-width: 1.2rem;
    --style-picker-hue-height: 2rem;
`
