import {
    DEFAULT_PAGE_GAP,
    DEFAULT_VIEW_TRANSFORM,
    DEVICE_PIXEL_RATIO,
    MAX_PIXEL_SCALE,
    TRANSFORM_PIXEL_SCALE_DEBOUNCE,
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
} from "consts"
import { debounce } from "lodash"
import { board } from "state/board"
import { settings } from "state/settings"
import { subscriptionState } from "state/subscription"
import { GlobalState } from "state/types"
import { ViewSerializer } from "../serializers"
import {
    applyBound,
    getHorizontalBounds,
    getLowerBound,
    getUpperBound,
    getViewCenterY,
    zoomTo,
} from "../util"
import { ViewTransform, ViewState, PageIndex } from "./index.types"

export class View extends ViewSerializer implements GlobalState<ViewState> {
    getState(): ViewState {
        return this.state
    }

    setState(newState: ViewState) {
        this.state = newState
        return this
    }

    override async loadFromLocalStorage(): Promise<ViewState> {
        const state = await super.loadFromLocalStorage()
        subscriptionState.render("RenderNG", "ViewTransform")
        return state
    }

    /**
     * Get the index of the current page
     * @returns the current page index
     */
    getPageIndex(): PageIndex {
        return this.getState().pageIndex
    }

    /**
     * Go to a page of a specified index
     * @param pageIndex target page index
     */
    setPageIndex(pageIndex: PageIndex) {
        this.state.pageIndex = pageIndex
        this.saveToLocalStorage()
        subscriptionState.render("RenderNG", "MenuPageButton")
        board.clearTransform()
    }

    /**
     * Check if pageIndex is OOB and needs adjustment
     */
    validatePageIndex() {
        const numberOfPages = board.getState().pageRank.length
        if (!numberOfPages) {
            this.setPageIndex(0) // No pages -> Set to 0
        } else if (this.getState().pageIndex >= numberOfPages) {
            this.setPageIndex(numberOfPages - 1) // OOB -> Go to last page
        }
    }

    /**
     * Cache the view dimensions onResize to avoid expensive DOM operations
     */
    updateViewDimensions() {
        this.state.innerWidth = window.innerWidth
        this.state.innerHeight = window.innerHeight
        this.centerView()
    }

    /**
     * Center the view while maintaining the current scale
     */
    centerView(): void {
        const newTransform = {
            ...this.getState().viewTransform,
            xOffset: this.getCenterX() / this.getState().viewTransform.scale,
        }

        this.updateViewTransform(newTransform)
    }

    /**
     * Zoom to the center of the screen
     * @param isZoomingIn set to true to zoom in
     */
    zoomCenter(isZoomingIn: boolean): void {
        const newTransform = zoomTo({
            viewTransform: this.getState().viewTransform,
            zoomPoint: {
                x: this.getCenterX(),
                y: this.getCenterY(),
            },
            zoomScale: isZoomingIn ? ZOOM_IN_WHEEL_SCALE : ZOOM_OUT_WHEEL_SCALE,
        })

        this.updateViewTransform(newTransform)
    }

    /**
     * Reset the view transform to the default values
     */
    resetView(): void {
        this.updateViewTransform({
            scale: DEFAULT_VIEW_TRANSFORM.scale,
            xOffset: this.getCenterX(),
            yOffset: DEFAULT_VIEW_TRANSFORM.yOffset,
        })
    }

    /**
     * Reset the view scale at the center of the screen
     */
    resetViewScale(): void {
        this.rescaleAtCenter(1)
    }

    /**
     * Set the view scale so that the current page fits the viewport width
     */
    fitToPage(): void {
        const pageSize = board.getPageSize(this.getPageIndex())
        this.rescaleAtCenter(this.getState().innerWidth / pageSize.width)
    }

    /**
     * Update the view transform. Bounds and a pixel scale update are applied if necessary
     * @param newTransform transform update to be applied
     */
    updateViewTransform(newTransform: ViewTransform): void {
        newTransform = this.handlePageChange(newTransform)
        newTransform = this.applyBounds(newTransform)

        this.state.viewTransform = newTransform
        this.checkPixelScaleDebounced(newTransform)

        subscriptionState.render("ViewTransform")
    }

    /**
     * Find out if currently on first page
     * @returns true if on first page
     */
    onFirstPage(): boolean {
        return this.getState().pageIndex === 0
    }

    /**
     * Find out if currently on last page
     * @returns true if on last page
     */
    onLastPage(): boolean {
        return (
            this.getState().pageIndex === board.getState().pageRank.length - 1
        )
    }

    /**
     * Test if the view is zoomed in at least full screen
     * @param scale : optional input for testing for a specific scale
     * @returns true if the views page width exceeds the window width
     */
    isFullScreen(scale = this.getState().viewTransform.scale) {
        const effectivePageWidth =
            board.getPageSize(this.getState().pageIndex).width * scale
        return effectivePageWidth > this.getState().innerWidth
    }

    /**
     * Go to the next page
     */
    jumpToNextPage(): void {
        if (this.state.pageIndex < board.getState().pageRank.length - 1) {
            this.setPageIndex(this.state.pageIndex + 1)
        }
    }

    /**
     * Go to the previous page
     */
    jumpToPrevPage(): void {
        if (this.state.pageIndex > 0) {
            this.setPageIndex(this.state.pageIndex - 1)
        }
    }

    /**
     * Go to the first page
     */
    jumpToFirstPage(): void {
        this.setPageIndex(0)
    }

    /**
     * Go to the last page
     */
    jumpToLastPage(): void {
        this.setPageIndex(board.getState().pageRank.length - 1)
    }

    /**
     * Debounced pixel scale check
     */
    private checkPixelScaleDebounced = debounce(
        this.checkPixelScale,
        TRANSFORM_PIXEL_SCALE_DEBOUNCE
    )

    /**
     * Check if the pixel scale needs adjustment and apply if necessary.
     * @param newTransform new viewTransform which could trigger a rescale
     */
    private checkPixelScale(newTransform: ViewTransform): void {
        const newPixelScale = Math.min(
            DEVICE_PIXEL_RATIO * Math.ceil(newTransform.scale),
            MAX_PIXEL_SCALE
        )

        if (newPixelScale !== this.getState().layerConfig.pixelScale) {
            this.state.layerConfig = {
                pixelScale: newPixelScale,
            }
            subscriptionState.render("LayerConfig")
        }
    }

    /**
     * Get the yOffset at which a rescale will not
     * change the position at a specified y coordinate
     * @param newScale new scale to be applied
     * @param yFixed y coordinate at which the view should rescale at
     * @returns new yOffset
     */
    private scaleWithFixedY(
        newScale: number,
        yFixed: number
    ): ViewTransform["yOffset"] {
        const { scale, yOffset } = this.getState().viewTransform

        return yOffset + yFixed / newScale - yFixed / scale
    }

    /**
     * Rescale the view at the center of the viewport
     * @param newScale new scale to be applied
     */
    private rescaleAtCenter(newScale: number): void {
        const newTransform = {
            scale: newScale,
            xOffset: this.getCenterX() / newScale,
            yOffset: this.scaleWithFixedY(newScale, this.getCenterY()),
        }
        this.updateViewTransform(newTransform)
    }

    private getCenterX(): number {
        return this.getState().innerWidth / 2
    }

    private getCenterY(): number {
        return this.getState().innerHeight / 2
    }

    /**
     * Transition the view transform and page index to previous page
     * @param newTransform updated transform
     * @returns view transform adjusted to page transition
     */
    private transitionToPreviousPage(
        newTransform: ViewTransform
    ): ViewTransform {
        this.jumpToPrevPage()
        const pageHeight = board.getPageSize(this.getState().pageIndex).height
        newTransform.yOffset -= pageHeight + DEFAULT_PAGE_GAP
        return newTransform
    }

    /**
     * Transition the view transform and page index to next page
     * @param newTransform updated transform
     * @returns view transform adjusted to page transition
     */
    private transitionToNextPage(newTransform: ViewTransform): ViewTransform {
        this.jumpToNextPage()
        const pageHeight = board.getPageSize(
            this.getState().pageIndex - 1
        ).height
        newTransform.yOffset += pageHeight + DEFAULT_PAGE_GAP
        return newTransform
    }

    /**
     * Detect if page index has changed and adjust the transform accordingly
     * @param newTransform updated transform
     * @returns adjusted transform
     */
    private handlePageChange(newTransform: ViewTransform): ViewTransform {
        const transformedCenterY = getViewCenterY({
            viewTransform: newTransform,
            innerHeight: this.getState().innerHeight,
        })
        const prevPageBorder = -DEFAULT_PAGE_GAP / 2
        const nextPageBorder =
            board.getPageSize(this.getState().pageIndex).height *
                newTransform.scale +
            DEFAULT_PAGE_GAP / 2

        if (transformedCenterY < prevPageBorder) {
            if (!this.onFirstPage()) {
                return this.transitionToPreviousPage(newTransform)
            }
        } else if (transformedCenterY > nextPageBorder) {
            if (!this.onLastPage()) {
                return this.transitionToNextPage(newTransform)
            }
        }
        return newTransform
    }

    /**
     * Apply bounds on a transform
     * @param newTransform transform to apply bounds on
     * @returns bounded transform
     */
    private applyBounds(newTransform: ViewTransform): ViewTransform {
        return {
            ...newTransform,
            xOffset: this.applyBoundsX(newTransform),
            yOffset: this.applyBoundsY(newTransform),
        }
    }

    /**
     * Apply horizontal bounds
     * @param newTransform transform to apply bounds on
     * @returns X-bounded transform
     */
    private applyBoundsX(
        newTransform: ViewTransform
    ): ViewTransform["xOffset"] {
        const { keepCentered } = settings.getState()

        // Zoomed out with keepCentered setting on sticks to center
        if (keepCentered && !this.isFullScreen(newTransform.scale)) {
            return this.getCenterX() / newTransform.scale
        }

        const pageWidth = board.getPageSize(this.getState().pageIndex).width
        const { leftBound, rightBound } = getHorizontalBounds({
            newTransform,
            keepCentered,
            pageWidth,
            innerWidth: this.state.innerWidth,
        })

        return applyBound({
            value: newTransform.xOffset,
            min: leftBound,
            max: rightBound,
        })
    }

    /**
     * Apply vertical bounds
     * @param newTransform transform to apply bounds on
     * @returns Y-bounded transform
     */
    private applyBoundsY(
        newTransform: ViewTransform
    ): ViewTransform["yOffset"] {
        if (this.onFirstPage()) {
            const upperBound = getUpperBound({
                newTransform,
                innerHeight: this.getState().innerHeight,
            })

            if (newTransform.yOffset > upperBound) {
                return upperBound
            }

            if (this.onLastPage()) {
                const lowerBound = getLowerBound({
                    newTransform,
                    pageHeight: board.getPageSize(this.getState().pageIndex)
                        .height,
                    innerHeight: this.getState().innerHeight,
                })

                // If the upper and lower bounds cross
                // eachother then set y to upper bound
                if (upperBound < lowerBound) {
                    return upperBound
                }

                if (newTransform.yOffset < lowerBound) {
                    return lowerBound
                }
            }
        }

        if (this.onLastPage()) {
            const lowerBound = getLowerBound({
                newTransform,
                pageHeight: board.getPageSize(this.getState().pageIndex).height,
                innerHeight: this.getState().innerHeight,
            })

            if (newTransform.yOffset < lowerBound) {
                return lowerBound
            }
        }

        return newTransform.yOffset
    }
}

export const view = new View()
