import axios from "axios"
import { API_URL } from "./request"

export const AUTH_URL = `${API_URL}/github/oauth/authorize`
export const AUTH_VALIDATE_URL = `${API_URL}/github/oauth/validate`

const isAuthorized: Record<string, boolean> = {}

export const validateToken = async (token: string): Promise<boolean> => {
    if (!token) return false
    if (isAuthorized[token] !== undefined) return isAuthorized[token]
    const response = await axios.get(AUTH_VALIDATE_URL, {
        headers: { Authorization: `Bearer ${token}` },
    })
    isAuthorized[token] = response.status === 204
    return isAuthorized[token]
}
