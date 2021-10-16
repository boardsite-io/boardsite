import { LoadingState } from "./loading.types"

const initState: LoadingState = {
    isLoading: false,
    message: "Loading...",
}

const loadingReducer = (state = initState, action: any): LoadingState => {
    switch (action.type) {
        case "START_LOADING": {
            return {
                ...state,
                message: action.payload,
                isLoading: true,
            }
        }
        case "END_LOADING": {
            state.isLoading = false
            return {
                ...state,
                isLoading: false,
            }
        }
        default:
            return state
    }
}
export default loadingReducer
