/**
 * @description
 * These are optional values you can include in the config object you can pass into the
 * directive for custom properties you want to use this with.  This tool can be used for
 * more than just the parallax effect, and it is able to transform anything about the
 * `parallaxElement` that you want to have bound to the scrolling of the nested element.
*/
interface IParallaxConfig {
    /**
     * @var cssKey - A string representing both the property you want to modify as well as
     *    a special CSS function or value you want included in the generated styles
     * @default 'backgroundPosition'
     */
    cssKey: string;
    /**
     * @deprecated Use "styleProperty" instead
     * @var styleProperty The style property (in camelCase) that the directive should manipulate
     * @default 'backgroundPositionY'
     */
    parallaxCss: string;
    /**
     * @var styleProperty The style property (in camelCase) that the directive should manipulate
     * @default 'backgroundPositionY'
     */
    styleProperty: string;
    /**
     * @deprecated Use "axis" instead
     * @var parallaxAxis The direction that the effect will move (when using background-position)
     * @default 'Y'
     */
    parallaxAxis: 'Y'|'X';
    /**
     * @var parallaxAxis The direction that the effect will move (when using background-position)
     * @default 'Y'
     */
    axis: 'Y'|'X';
    /**
     * @deprecated Use "ratio" instead
     * @var parallaxRatio - The rate of change (as a decimal) made when scrolling
     * @default -0.7
     * @description The ratio can have any of these effects:
     *  - Moves faster than the page: < 0
     *  - Moves with the page (like a normal image): 0
     *  - Moves slower than the page: > 0 && < 1
     *  - Stays fixed in its position: 1
     *  - Moves the opposite direction from the page: > 1
     */
    parallaxRatio: number;
    /**
     * @var ratio - The rate of change (as a decimal) made when scrolling
     * @default -0.7
     * @description The ratio can have any of these effects:
     *  - Moves faster than the page: < 0
     *  - Moves with the page (like a normal image): 0
     *  - Moves slower than the page: > 0 && < 1
     *  - Stays fixed in its position: 1
     *  - Moves the opposite direction from the page: > 1
     */
    ratio: number;
    /**
     * @deprecated Use "initialValue" instead
     * @var parallaxInitVal - The initial value for the configured css property
     * @default 0
     * @description Should only contain the number; configuring the unit is found under the "cssUnit" binding
     */
    parallaxInitVal: number;
    /**
     * @var initialValue - The initial value for the configured css property
     * @default 0
     * @description Should only contain the number; configuring the unit is found under the "cssUnit" binding
     */
    initialValue: number;
    /**
     * @deprecated Use "disabled" instead
     * @var parallaxIf - True if the effect is enabled
     * @default true
     * @description Migrating note: "disabled" is the inverse of "parallaxIf", and as such, inverse logic should be used when switching
     */
    parallaxIf: boolean;
    /**
     * @var disabled - Whether scrolling should trigger the effect or not
     * @default false
     * @description Migration note: "disabled" is the inverse of "parallaxIf", and as such, inverse logic should be used when switching.
     *    True if the effect should be stopped.
     */
    disabled: boolean;
    // tslint:disable
    /**
     * @deprecated Use "scrollerSelector" or "scrollElement" instead
     * @var scrollerId - A string that is an id of an element of which this directive will track the scrolling
     * @description Migration note: You should be able to prepend the former scrollerId string with a "#" if you use scrollerSelector instead.
     */
    // tslint:enable
    scrollerId: string;
    // tslint:disable
    /**
     * @var scrollerSelector - A string that is a valid CSS selector for the element of which this directive will track the scrolling
     * @description Migration note: You should be able to prepend the former scrollerId string with a "#" if you use scrollerSelector instead.
     */
    // tslint:enable
    scrollerSelector: string;
    /**
     * @var scrollElement - The element whose scroll position should be tracked
     * @default The window
     */
    scrollElement: HTMLElement|Window;
    /**
     * @var maxValue - The maximum value the effect should go
     */
    maxValue: number;
    /**
     * @var minValue - The minimum value the effect should go
     */
    minValue: number;
    /**
     * @var cssUnit - The unit the directive should use when updating the value
     * @default 'px'
     */
    cssUnit: string;
    /**
     * @deprecated Use "update" event binding instead
     * @var cb - A callback that will be called each time the
     * @param event - Original mousewheel event from scrolling
     * @param args - Any additional arguments sent through using the `cb_args` binding
     */
    cb: (this: HTMLElement, event: MouseWheelEvent, ...args: any[]) => void;
    /**
     * @deprecated Use "update" event binding instead
     * @var cb_context - What the "this" binding will be inside of the function
     * @default The provided or default "parallax" element
     */
    cb_context: any;
    /**
     * @deprecated Use "update" event binding instead
     * @var cb_args - Arguments applied to the provided "cb"
     */
    cb_args: any[];
    /**
     * @var parallaxElement - The element the effect will be applied to.
     * @default The element on which the directive is placed.
     */
    parallaxElement: HTMLElement;
}

export {
    IParallaxConfig,
};
