import styled from "styled-components"

export enum ScreenSize {
    Xs = "30rem",
    Sm = "50rem",
    Md = "60rem",
    Lg = "80rem",
    Xl = "100rem",
}

export const Theme = styled.div`
    /* Color Overview
        0: Global Background 
        1: Icon Stroke Color
        2: NavBar, FavTools, ViewNav
        3: Buttons, SliderThumb, SliderRailActive
        4: Details, SliderRailInactive, Borders
        5: Background of Dialog, Drawer, ...
        6: Transparent background behind Dialog, Drawer, ...
        7: Active Tools 
        8: Active Tools Background 
    */
    --color0: linear-gradient(#888888, #696969);
    --color1: white;
    --color2: #00000088;
    --color3: #00796b;
    --color4: #37474f;
    --color5: white;
    --color6: #000000aa;
    --color7: #00ff00;
    --color8: #263238; /* Blue Grey 900 */

    --icon-button-size: 2rem;
    --icon-stroke-width: 8;

    --style-picker-hue-width: 1.2rem;
    --style-picker-hue-height: 2rem;
    --style-picker-pointer-border: 2px solid var(--color1);
    --style-picker-padding: var(--menu-padding) var(--button-gap);

    --menu-padding: 0.2rem;
    --menubar-box-shadow: 0px 0px 2px 0px #00000088;
    --menubar-border-radius: 0.5rem;

    --button-gap: 0.4rem;
    --button-border-radius: 0.35rem;
    --button-hover-transform: scale(1.2, 1.2);
    --button-hover-box-shadow: 0 0 1rem 0 var(--color7);
    --button-active-box-shadow: inset 0 0 0.5rem 0 var(--color7),
        0 0 0.5rem 0 var(--color7);
    --box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

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

    svg:not(#transitory-icon) {
        stroke-width: var(--icon-stroke-width);
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
