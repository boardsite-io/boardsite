import { createSlice } from "@reduxjs/toolkit";
import * as constant from '../../constants.js';

const drawControlSlice = createSlice({
    name: "drawControl",
    initialState: {
        active: constant.DEFAULT_ACTIVE,
        tool: constant.DEFAULT_TOOL,
        style: {
            color: constant.DEFAULT_COLOR,
            width: constant.DEFAULT_WIDTH * constant.CANVAS_PIXEL_RATIO,
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
