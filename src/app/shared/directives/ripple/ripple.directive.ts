import { Directive, ElementRef, Renderer2, HostListener, Input, inject } from '@angular/core';

@Directive({
  selector: '[appRipple]'
})
export class RippleDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  /** Enable or disable the ripple effect (default: true) */
  @Input('appRipple') set enabledInput(v: boolean | string | undefined) {
    this.enabled = v === undefined || v === null ? true : typeof v === 'string' ? v !== 'false' : !!v;
  }
  enabled = true;

  /** Custom ripple color */
  @Input() rippleColor?: string;

  /** If true, ripple always starts at element center */
  @Input() rippleCentered = false;

  /** Duration of ripple animation (ms) */
  @Input() rippleDuration = 500;

  /** Optional fixed ripple radius */
  @Input() rippleRadius?: number;

  /** Internal cleanup */
  private static stylesInjected = false;
  private activeTimeouts = new Set<number>();

  constructor() { }

  // === Lifecycle ===
  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return; // SSR safety
    this.prepareHost();
    // this.injectStyles();
  }

  ngOnDestroy(): void {
    for (const timer of this.activeTimeouts) clearTimeout(timer);
    this.activeTimeouts.clear();
  }

  // === Helpers ===
  private prepareHost(): void {
    const host = this.el.nativeElement;
    const style = window.getComputedStyle(host);
    if (!style.position || style.position === 'static') {
      this.renderer.setStyle(host, 'position', 'relative');
    }
    this.renderer.setStyle(host, 'overflow', 'hidden');
  }

  // private injectStyles(): void {
  //   if (RippleDirective.stylesInjected || typeof document === 'undefined') return;

  //   const css = `
  //     .app-ripple {
  //       position: absolute;
  //       border-radius: 50%;
  //       pointer-events: none;
  //       transform: scale(0);
  //       opacity: 0.36;
  //       will-change: transform, opacity;
  //       background: var(--ripple-color, rgba(0, 0, 0, 0.24));
  //     }
  //     .app-ripple.app-ripple-active {
  //       transform: scale(1);
  //       opacity: 0;
  //     }
  //   `;

  //   const styleEl = this.renderer.createElement('style');
  //   this.renderer.setProperty(styleEl, 'textContent', css);
  //   this.renderer.appendChild(document.head, styleEl);
  //   RippleDirective.stylesInjected = true;
  // }

  private createRipple(x: number, y: number) {
    if (!this.enabled) return;

    const host = this.el.nativeElement;
    const rect = host.getBoundingClientRect();
    const size = this.rippleRadius && this.rippleRadius > 0 ? this.rippleRadius : Math.max(rect.width, rect.height) * 2;
    const ripple = this.renderer.createElement('span');
    this.renderer.addClass(ripple, 'app-ripple');
    this.renderer.setStyle(ripple, 'width', `${size}px`);
    this.renderer.setStyle(ripple, 'height', `${size}px`);
    this.renderer.setStyle(ripple, 'transition', `transform ${this.rippleDuration}ms ease-out, opacity ${this.rippleDuration}ms linear`);
    if (this.rippleColor) {
      this.renderer.setStyle(ripple, 'background', this.rippleColor);
    }

    const left = x - rect.left - size / 2;
    const top = y - rect.top - size / 2;
    this.renderer.setStyle(ripple, 'left', `${left}px`);
    this.renderer.setStyle(ripple, 'top', `${top}px`);
    this.renderer.appendChild(host, ripple);

    // Trigger layout → animation
    ripple.offsetHeight;
    this.renderer.addClass(ripple, 'app-ripple-active');

    // Remove after animation
    const timer = window.setTimeout(() => {
      try {
        this.renderer.removeChild(host, ripple);
      } catch { }
      this.activeTimeouts.delete(timer);
    }, this.rippleDuration + 100);
    this.activeTimeouts.add(timer);
  }

  private createCenteredRipple() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    if (!this.enabled || typeof window === 'undefined') return;
    if (this.rippleCentered) { this.createCenteredRipple(); return; }
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    this.createRipple(x, y);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
      this.createCenteredRipple();
    }
  }
}
