import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "./store"
import { RootState } from "./types"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCustomDispatch = () => useDispatch<AppDispatch>()
export const useCustomSelector: TypedUseSelectorHook<RootState> = useSelector
