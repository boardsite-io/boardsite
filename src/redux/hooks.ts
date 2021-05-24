import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "./store"

export const useCustomDispatch = () => useDispatch<AppDispatch>()
export const useCustomSelector: TypedUseSelectorHook<RootState> = useSelector
