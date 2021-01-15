import { createSlice } from "@reduxjs/toolkit";

const drawControlSlice = createSlice({
    name: "drawcontrol",
    initialState: {
        active: true,
        tool: "pen",
        style: {
            color: "#000000",
            width: 1,
        }
    },
    reducers: {
        
    }
})

//export const { ... } = drawControlSlice.actions;

export default drawControlSlice.reducer;
