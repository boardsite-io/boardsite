import { useDispatch } from "react-redux"
import type { AppDispatch } from "redux/store"

export const useCustomDispatch: () => AppDispatch = () =>
    useDispatch<AppDispatch>()
