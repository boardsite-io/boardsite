export default {
    // Tool Bar
    Settings: "Open settings menu",
    Session: "Open session menu",
    Undo: "Undo",
    Redo: "Redo",
    // Tools
    ActiveTool: "Active Tool (1, A)",
    EraserTool: "Eraser Tool (2, E)",
    SelectionTool: "Selection Tool (3, S)",
    PanningTool: "Panning Tool (4, SPACE)",
    PenTool: "Pen Tool (5, P)",
    LineTool: "Line Tool (6, L)",
    RectangleTool: "Rectangle Tool (7, R)",
    CircleTool: "Circle Tool (8, C)",
    SelectWidth: ({ width }: { width: number }): string => `Width ${width}px`,
    ZoomIn: "Zoom In",
    ZoomOut: "Zoom Out",
    PageSettings: "Open page settings",
    ResetView: "Reset view",
    MaximizeView: "Fit page to screen width",
    // Favorite Tools Bar
    FavoriteTool: "Click to select favorite tool and hold to edit slot",
    ReplaceFavoriteTool: "Overwrite favorite tool with current tool",
    RemoveFavoriteTool: "Delete favorite tool",
    AddFavoriteTool: "Save current tool as favorite in a new slot",
    // Navigation Bar
    FirstPage: "Go to first page",
    PreviousPage: "Go to previous page",
    NextPage: "Go to next page",
    LastPage: "Go to last page",
    // Page Settings
    Size: {
        A4Landscape: "A4 landscape",
        A4Portrait: "A4 portrait",
        Square: "Square",
    },
    Background: {
        Blank: "Blank page",
        Checkered: "Checkered page",
        Ruled: "Ruled page",
    },
}
