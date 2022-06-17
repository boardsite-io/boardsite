import {
    adjectives,
    animals,
    uniqueNamesGenerator,
} from "unique-names-generator"
import { getRandomColor } from "util/color"
import { OnlineState } from "./index.types"

export const getDefaultOnlineState = (): OnlineState => ({
    user: {
        alias: uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            separator: "",
            style: "capital",
        }),
        color: getRandomColor(),
    },
    token: "",
    session: {},
    isAuthorized: false,
})
