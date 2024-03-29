import { ToolType } from "drawing/stroke/index.types"
import EraserIcon from "./svgs/eraser.svg"
import PenIcon from "./svgs/pen.svg"
import HighlighterIcon from "./svgs/highlighter.svg"
import SelectIcon from "./svgs/select.svg"
import LineIcon from "./svgs/line.svg"
import CircleIcon from "./svgs/circle.svg"
import RectangleIcon from "./svgs/rectangle.svg"
import PlusIcon from "./svgs/plus.svg"
import MinusIcon from "./svgs/minus.svg"
import ExpandIcon from "./svgs/expand.svg"
import ShrinkIcon from "./svgs/shrink.svg"
import PanIcon from "./svgs/pan.svg"
import TextfieldIcon from "./svgs/textfield.svg"
import ZoomInIcon from "./svgs/zoomin.svg"
import ZoomOutIcon from "./svgs/zoomout.svg"
import UndoIcon from "./svgs/undo.svg"
import RedoIcon from "./svgs/redo.svg"
import DownloadIcon from "./svgs/download.svg"
import UploadIcon from "./svgs/upload.svg"
import MenuIcon from "./svgs/menu.svg"
import OnlineIcon from "./svgs/online.svg"
import ExpandableIcon from "./svgs/expandable.svg"
import PageAboveIcon from "./svgs/pageabove.svg"
import PageBelowIcon from "./svgs/pagebelow.svg"
import PageClearIcon from "./svgs/pageclear.svg"
import PageDeleteIcon from "./svgs/pagedelete.svg"
import PageDeleteAllIcon from "./svgs/pagedeleteall.svg"
import TickIcon from "./svgs/tick.svg"
import BgCheckeredLandscape from "./svgs/background/checkeredlandscape.svg"
import BgCheckeredPortrait from "./svgs/background/checkeredportrait.svg"
import BgRuledLandscape from "./svgs/background/ruledlandscape.svg"
import BgRuledPortrait from "./svgs/background/ruledportrait.svg"

export {
    EraserIcon,
    PenIcon,
    HighlighterIcon,
    SelectIcon,
    LineIcon,
    CircleIcon,
    RectangleIcon,
    PlusIcon,
    MinusIcon,
    ExpandIcon,
    ShrinkIcon,
    PanIcon,
    TextfieldIcon,
    ZoomInIcon,
    ZoomOutIcon,
    UndoIcon,
    RedoIcon,
    DownloadIcon,
    UploadIcon,
    MenuIcon,
    OnlineIcon,
    ExpandableIcon,
    PageAboveIcon,
    PageBelowIcon,
    PageClearIcon,
    PageDeleteIcon,
    PageDeleteAllIcon,
    TickIcon,
    BgCheckeredLandscape,
    BgCheckeredPortrait,
    BgRuledLandscape,
    BgRuledPortrait,
}

export const ToolIcons = {
    [ToolType.Pen]: PenIcon,
    [ToolType.Line]: LineIcon,
    [ToolType.Rectangle]: RectangleIcon,
    [ToolType.Circle]: CircleIcon,
    [ToolType.Eraser]: EraserIcon,
    [ToolType.Pan]: PanIcon,
    [ToolType.Select]: SelectIcon,
    [ToolType.Highlighter]: HighlighterIcon,
    [ToolType.Textfield]: TextfieldIcon,
}
