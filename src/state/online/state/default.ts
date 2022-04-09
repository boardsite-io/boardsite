import {
    adjectives,
    animals,
    uniqueNamesGenerator,
} from "unique-names-generator"
import { OnlineState } from "./index.types"
import { getRandomColor } from "../../../util/color"

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
