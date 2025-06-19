import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-optimized-image',
  imports: [NgOptimizedImage],
  templateUrl: './optimized-image.component.html',
  styleUrl: './optimized-image.component.scss'
})
export class OptimizedImageComponent {
  @Input() src!: string;
  @Input() fallback: string = '/assets/images/fallback.svg';
  @Input() width: string = '100%';
  @Input() height: string = 'auto';
  @Input() maxWidth: number = 100; // in 'px'
  @Input() maxHeight: number = 75; // in 'px'
  @Input() alt: string = '';
  @Input() loading?: 'lazy' | 'eager' = 'lazy';

  currentSrc!: string;

  ngOnChanges() {
    this.currentSrc = this.src;
  }

  onError() {
    this.currentSrc = this.fallback;
  }
}
