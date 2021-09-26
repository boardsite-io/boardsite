import styled from "styled-components"

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
        8: Icon Hover
    */
    --color0: linear-gradient(#888888, #696969);
    --color1: white;
    --color2: #00000088;
    --color3: #00796b;
    --color4: #37474f;
    --color5: white;
    --color6: #000000aa;
    --color7: #00ff00;
    --color8: black;

    --menu-padding: 0.2rem;
    --menubar-box-shadow: 0px 0px 2px 0px #00000088;
    --menubar-border-radius: 0.5rem;
    --button-gap: 0.1rem;
    --button-border-radius: 0.35rem;
    --box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    --icon-button-size: 2rem;

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
`
