import { Point } from "board/stroke/types"

export type Hitbox = {
    v1: Point
    v2: Point
    v3: Point
    v4: Point
}

export interface StrokeHitbox {
    [id: string]: Hitbox[]
}
