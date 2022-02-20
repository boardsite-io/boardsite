import axios from "axios"
import { API_URL } from "./request"

export const AUTH_URL = `${API_URL}/github/oauth/authorize`
export const AUTH_CALLBACK = "/github/oauth/callback"

const isAuthorized: Record<string, boolean> = {}

export const validateToken = async (token: string): Promise<boolean> => {
    if (!token) return false
    if (isAuthorized[token] !== undefined) return isAuthorized[token]
    const response = await axios.get(`${API_URL}/github/oauth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    isAuthorized[token] = response.status === 204
    return isAuthorized[token]
}
