import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { createSelector, OutputSelector } from "reselect"
import type { RootState, AppDispatch } from "./store"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCustomDispatch = () => useDispatch<AppDispatch>()
export const useCustomSelector: TypedUseSelectorHook<RootState> = useSelector
// export const createCustomSelector: OutputSelector<RootState> = createSelector
