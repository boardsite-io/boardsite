import { createSlice } from "@reduxjs/toolkit";
import {
    DEFAULT_ACTIVE,
    DEFAULT_TOOL,
    DEFAULT_COLOR,
    DEFAULT_WIDTH,
    CANVAS_PIXEL_RATIO
} from '../../constants.js';

const drawControlSlice = createSlice({
    name: "drawControl",
    initialState: {
        active: DEFAULT_ACTIVE,
        tool: DEFAULT_TOOL,
        style: {
            color: DEFAULT_COLOR,
            width: DEFAULT_WIDTH * CANVAS_PIXEL_RATIO,
        }
    },
    reducers: {
        setColor: (state, action) => {
            const color = action.payload;
            state.style.color = color;
        },
        setWidth: (state, action) => {
            const width = action.payload;
            state.style.width = width;
        },
        setTool: (state, action) => {
            const tool = action.payload;
            state.tool = tool;
        },
        setActive: (state, action) => {
            const active = action.payload;
            state.active = active;
        },
    }
});

export const { setColor, setWidth, setTool, setActive } = drawControlSlice.actions;
export default drawControlSlice.reducer;
