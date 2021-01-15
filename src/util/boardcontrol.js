
/**
 * 
 */
export class BoardControl {
    constructor() {
        // this.pageCollection = [];
        this.strokeCollection = {};
        this.hitboxCollection = {};
        this.undoStack = [];
        this.redoStack = [];

        this.style = {
            color: "#000000",
            width: 12,
        }

        // this.websocketRef = null;
        this.scaleRef = 1;
        this.activeTool = "pen";
    }

    /**
     * 
     */
    // deleteAll() {
    //     this.pageCollection.forEach((page) => {
    //         const canvas = page.canvasRef.current;
    //         const ctx = canvas.getContext('2d');
    //         ctx.clearRect(0, 0, 2480, 3508);
    //     });
    
    //     this.strokeCollection = {};
    //     this.hitboxCollection = {};
    //     this.undoStack = [];
    //     this.redoStack = [];
    //     // this.pageCollection = [];
    // }
}
