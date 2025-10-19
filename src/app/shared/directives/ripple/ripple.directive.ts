import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRipple]'
})
export class RippleDirective {
  // accept attribute-only usage (appRipple) which will pass a string when present
  @Input('appRipple') set enabledInput(v: boolean | string | undefined) {
    if (v === undefined || v === null) {
      this.enabled = true;
      return;
    }
    // attribute-only passes empty string, or a string value; treat truthy strings as true, 'false' as false
    if (typeof v === 'string') {
      this.enabled = !(v === 'false');
      return;
    }
    this.enabled = Boolean(v);
  }
  enabled = true;
  @Input() rippleColor?: string;
  @Input() rippleCentered = false;
  @Input() rippleDuration = 600; // ms
  @Input() rippleRadius?: number; // px (diameter will be derived)

  private static stylesInjected = false;
  private removeTimers = new Set<number>();

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    // Do not run in SSR
    if (typeof window === 'undefined' || !this.el?.nativeElement) return;

    this.ensureHostPosition();
    this.injectStylesOnce();
  }

  ngOnDestroy(): void {
    for (const t of this.removeTimers) {
      try { window.clearTimeout(t); } catch { }
    }
    this.removeTimers.clear();
  }

  private ensureHostPosition() {
    const el = this.el.nativeElement;
    const style = window.getComputedStyle(el);
    if (style.position === '' || style.position === 'static') {
      this.renderer.setStyle(el, 'position', 'relative');
    }
    this.renderer.setStyle(el, 'overflow', 'hidden');
  }

  private injectStylesOnce() {
    if (RippleDirective.stylesInjected) return;
    const css = `
      .app-ripple {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        opacity: 0.36;
        will-change: transform, opacity;
        background: var(--ripple-color, rgba(0,0,0,0.24));
      }
      .app-ripple.app-ripple-show {
        transform: scale(1);
        opacity: 0;
      }
    `;
    const styleEl = this.renderer.createElement('style');
    this.renderer.setProperty(styleEl, 'textContent', css);
    this.renderer.appendChild(document.head, styleEl);
    RippleDirective.stylesInjected = true;
  }

  private createRipple(x: number, y: number) {
    if (!this.enabled) return;
    const host = this.el.nativeElement;
    const rect = host.getBoundingClientRect();

    const diameter = this.rippleRadius && this.rippleRadius > 0
      ? this.rippleRadius
      : Math.max(rect.width, rect.height) * 2;

    const ripple = this.renderer.createElement('span');
    this.renderer.addClass(ripple, 'app-ripple');

    // set size
    this.renderer.setStyle(ripple, 'width', `${diameter}px`);
    this.renderer.setStyle(ripple, 'height', `${diameter}px`);
    this.renderer.setStyle(ripple, 'transition', `transform ${this.rippleDuration}ms ease-out, opacity ${this.rippleDuration}ms linear`);
    if (this.rippleColor) {
      this.renderer.setStyle(ripple, 'background', this.rippleColor);
    }
    // position center or based on event
    const left = x - rect.left - diameter / 2;
    const top = y - rect.top - diameter / 2;

    this.renderer.setStyle(ripple, 'left', `${left}px`);
    this.renderer.setStyle(ripple, 'top', `${top}px`);
    this.renderer.setStyle(ripple, 'position', 'absolute');

    this.renderer.appendChild(host, ripple);

    // force layout then animate
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    ripple.offsetWidth; // force reflow
    this.renderer.addClass(ripple, 'app-ripple-show');

    const removeDelay = window.setTimeout(() => {
      try { this.renderer.removeChild(host, ripple); } catch { }
      this.removeTimers.delete(removeDelay);
    }, this.rippleDuration + 50);
    this.removeTimers.add(removeDelay);
  }

  private createCenteredRipple() {
    const host = this.el.nativeElement;
    const rect = host.getBoundingClientRect();
    this.createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    if (typeof window === 'undefined') return;
    if (!this.enabled) return;

    // if centered mode requested, use center
    if (this.rippleCentered) {
      this.createCenteredRipple();
      return;
    }

    // fallback to center if event has no coordinates
    const x = (event.clientX && event.clientY) ? event.clientX : (this.el.nativeElement.getBoundingClientRect().left + this.el.nativeElement.getBoundingClientRect().width / 2);
    const y = (event.clientX && event.clientY) ? event.clientY : (this.el.nativeElement.getBoundingClientRect().top + this.el.nativeElement.getBoundingClientRect().height / 2);
    this.createRipple(x, y);
  }

  // keyboard activation (space/enter) should produce centered ripple similar to mat-ripple
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
      this.createCenteredRipple();
    }
  }
}
