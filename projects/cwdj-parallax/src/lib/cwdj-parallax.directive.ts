import {
  AfterViewInit,
  Directive,
  Input,
  ElementRef,
  OnDestroy,
  OnChanges,
  Output,
  EventEmitter,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IParallaxConfig } from './types';

@Directive({
  selector: '[cwdjParallax]',
})
export class ParallaxDirective implements AfterViewInit, OnChanges, OnDestroy {

  public name = 'parallaxDirective';

  @Input() config: IParallaxConfig;
  // The following inputs are all fields on the config object.  For
  // brevity's sake, you can do every one of these operations by passing
  // in the config object.  Instead,  caveat for this is that Angular doesn't permit
  // more than 9 keys being passed in an object literal in the template.
  /**
   * @var cssKey - A string representing both the property you want to modify as well as
   *    a special CSS function or value you want included in the generated styles
   * @default 'backgroundPosition'
   */
  @Input() cssKey = 'backgroundPosition';
  /**
   * @deprecated Use "styleProperty" instead
   * @var styleProperty The style property (in camelCase) that the directive should manipulate
   * @default 'backgroundPositionY'
   */
  @Input() parallaxCss: string;
  /**
   * @var styleProperty The style property (in camelCase) that the directive should manipulate
   * @default 'backgroundPositionY'
   */
  @Input() styleProperty = 'backgroundPositionY';
  /**
   * @deprecated Use "axis" instead
   * @var parallaxAxis The direction that the effect will move (when using background-position)
   * @default 'Y'
   */
  @Input() parallaxAxis: 'Y'|'X';
  /**
   * @var parallaxAxis The direction that the effect will move (when using background-position)
   * @default 'Y'
   */
  @Input() axis: 'Y'|'X' = 'Y';
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
  @Input() parallaxRatio;
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
  @Input() ratio = -.7;
  /**
   * @deprecated Use "initialValue" instead
   * @var parallaxInitVal - The initial value for the configured css property
   * @default 0
   * @description Should only contain the number; configuring the unit is found under the "cssUnit" binding
   */
  @Input() parallaxInitVal;
  /**
   * @var initialValue - The initial value for the configured css property
   * @default 0
   * @description Should only contain the number; configuring the unit is found under the "cssUnit" binding
   */
  @Input() initialValue = 0;
  /**
   * @deprecated Use "disabled" instead
   * @var parallaxIf - True if the effect is enabled
   * @default true
   * @description Migrating note: "disabled" is the inverse of "parallaxIf", and as such, inverse logic should be used when switching
   */
  @Input() parallaxIf;
  /**
   * @var disabled - Whether scrolling should trigger the effect or not
   * @default false
   * @description Migration note: "disabled" is the inverse of "parallaxIf", and as such, inverse logic should be used when switching.
   *    True if the effect should be stopped.
   */
  @Input() disabled = false;
  /**
   * @deprecated Use "scrollerSelector" or "scrollElement" instead
   * @var scrollerId - A string that is an id of an element of which this directive will track the scrolling
   * @description Migration note: You should be able to prepend the former scrollerId string with a "#" if you use scrollerSelector instead.
   */
  @Input() scrollerId: string;
  /**
   * @var scrollerSelector - A string that is a valid CSS selector for the element of which this directive will track the scrolling
   * @description Migration note: You should be able to prepend the former scrollerId string with a "#" if you use scrollerSelector instead.
   */
  @Input() scrollerSelector: string;
  /**
   * @var scrollElement - The element whose scroll position should be tracked
   * @default The window
   */
  @Input() scrollElement: HTMLElement|Window;
  /**
   * @var maxValue - The maximum value the effect should go
   */
  @Input() maxValue: number;
  /**
   * @var minValue - The minimum value the effect should go
   */
  @Input() minValue: number;
  /**
   * @var cssUnit - The unit the directive should use when updating the value
   * @default 'px'
   */
  @Input() cssUnit = 'px';
  /**
   * @deprecated Use "scroll" event binding instead
   * @var cb - A callback that will be called each time the
   * @param event - Original mousewheel event from scrolling
   * @param args - Any additional arguments sent through using the `cb_args` binding
   */
  @Input() cb: (this: HTMLElement, event: MouseWheelEvent, ...args: any[]) => void;
  /**
   * @deprecated Use "scroll" event binding instead
   * @var cb_context - What the "this" binding will be inside of the function
   * @default The provided or default "parallax" element
   */
  @Input() cb_context: any;
  /**
   * @deprecated Use "scroll" event binding instead
   * @var cb_args - Arguments applied to the provided "cb"
   */
  @Input() cb_args: any[];
  /**
   * @var parallaxElement - The element the effect will be applied to.
   * @default The element on which the directive is placed.
   */
  @Input() parallaxElement: HTMLElement;

  @Output() update = new EventEmitter<MouseWheelEvent>();

  public styles = {};

  private cssValue: string;
  private isSpecialVal = false;
  private hostElement: HTMLElement;
  private hasInitialized = false;
  private deprecatedFields = [
    'parallaxCss',
    'parallaxAxis',
    'parallaxRatio',
    'parallaxInitVal',
    'parallaxIf',
    'scrollerId',
    'cb',
    'cb_context',
    'cb_args',
  ];
  private whitelistedFields = [
    ...this.deprecatedFields,
    'cssKey',
    'styleProperty',
    'axis',
    'ratio',
    'initialValue',
    'disabled',
    'scrollerSelector',
    'scrollElement',
    'maxValue',
    'minValue',
    'cssUnit',
    'parallaxElement',
  ];

  constructor(element: ElementRef, @Inject(PLATFORM_ID) private platformId) {
    this.hostElement = element.nativeElement;
  }

  private evaluateScroll = (e: MouseWheelEvent) => {
    if (this.disabled) return;

    let resultVal: string;
    let calcVal: number;

    if (this.scrollElement instanceof Window)
      calcVal = this.scrollElement.scrollY * this.ratio + this.initialValue;
    else
      calcVal = this.scrollElement.scrollTop * this.ratio + this.initialValue;

    if (this.maxValue !== undefined && calcVal >= this.maxValue)
      calcVal = this.maxValue;
    else if (this.minValue !== undefined && calcVal <= this.minValue)
      calcVal = this.minValue;

    // added after realizing original setup wasn't compatible in Firefox
    if (this.cssKey === 'backgroundPosition') {
      if (this.axis === 'X') {
        resultVal = calcVal + this.cssUnit + ' 0';
      } else {
        resultVal = '0 ' + calcVal + this.cssUnit;
      }
    } else if (this.isSpecialVal) {
      resultVal = this.cssValue + '(' + calcVal + this.cssUnit + ')';
    } else {
      resultVal = calcVal + this.cssUnit;
    }

    if (this.cb) {
      // console.log('this should be running')
      this.cb.bind(this.cb_context || this.hostElement)(e, ...(this.cb_args || []));
    }

    this.parallaxElement.style[this.cssKey] = resultVal;

    this.update.emit(e);
  }

  public ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.prepareConfig();

      this.scrollElement.addEventListener('scroll', this.evaluateScroll);

      this.prepareParallax();
    }
  }

  public ngOnChanges() {
    if (!this.hasInitialized) return;

    if (isPlatformBrowser(this.platformId)) {
      this.prepareConfig();
      this.prepareParallax();
    }
  }

  public ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollElement.removeEventListener('scroll', this.evaluateScroll);
    }
  }

  private prepareParallax() {
    const simulatedEvent = new MouseEvent('scroll', { bubbles: false, cancelable: true });

    this.scrollElement.dispatchEvent(simulatedEvent);
  }

  private prepareConfig() {
    if (!this.config) this.config = {} as IParallaxConfig;

    const usedDeprecatedFields = this.deprecatedFields
        .filter(field => this[field] !== undefined || this.config[field]);

    if (usedDeprecatedFields.length) {
      console.warn(Error(
        `Warning!  Using deprecated field${
          usedDeprecatedFields.length > 1 ? 's' : ''
          // tslint:disable-next-line
        } (${usedDeprecatedFields.join(', ')}).  Please consult the documetation website http://cwadrupldijjit.com/cwdj-parallax/api for alternatives.`
      ));
    }

    for (const key in this.config) {
      if (this.whitelistedFields.includes(key)) {
        this[key] = this.config[key];
      }
    }

    let {
      parallaxCss,
      styleProperty,
      parallaxAxis,
      axis,
      parallaxRatio,
      ratio,
      parallaxInitVal,
      initialValue,
      parallaxIf,
      disabled,
      scrollerId,
      scrollerSelector,
      scrollElement,
      parallaxElement,
    } = this;
    let cssValArray: string[];

    this.styleProperty = styleProperty || parallaxCss || 'backgroundPositionY';
    if (this.styleProperty.includes('backgroundPosition')) {
      const axisFromStyleProperty = this.styleProperty.slice(-1).toUpperCase();

      if (['X', 'Y'].includes(axisFromStyleProperty)) {
        axis = axisFromStyleProperty as 'X'|'Y';
      }

      this.styleProperty = 'backgroundPosition';
    }

    cssValArray = this.styleProperty.split(':');
    this.cssKey = cssValArray[0];
    this.cssValue = cssValArray[1];

    this.isSpecialVal = Boolean(this.cssValue);
    if (!this.cssValue) this.cssValue = this.cssKey;

    this.ratio = +(ratio || parallaxRatio) || -.7;
    this.initialValue = +(initialValue || parallaxInitVal) || 0;

    this.parallaxElement = parallaxElement || this.hostElement;

    if (!scrollElement) {
      if (scrollerSelector) {
          this.scrollElement = document.querySelector<HTMLElement>(scrollerSelector);

          if (!this.scrollElement) {
            console.warn(new TypeError(`The selector provided to the cwdj-parallax directive for the scrolling element ('${
              this.scrollerSelector
            }') was not found in the document.  Tracking the window instead.`));
          }
      }
      else if (scrollerId) {
          this.scrollElement = document.getElementById(this.scrollerId);

          if (!this.scrollElement) {
            console.warn(new TypeError(`The ID provided to the cwdj-parallax directive ('${
              this.scrollerId
            }') was not found in the document.  Tracking the window instead.`));
          }
      }
    }

    if (!this.scrollElement) {
      this.scrollElement = window;
    }

    this.axis = axis || parallaxAxis || 'Y';

    this.disabled = disabled || (parallaxIf !== undefined ? !parallaxIf : false) || false;
  }
}
