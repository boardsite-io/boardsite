import { ErrorBody, ErrorCode } from "./types"

export const isErrorResponse = <T>(error: T, code: ErrorCode): boolean =>
    (error as ErrorBody).response?.data.code === code
