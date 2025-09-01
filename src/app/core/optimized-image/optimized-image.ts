import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-optimized-image',
  imports: [NgOptimizedImage],
  templateUrl: './optimized-image.html',
  styleUrl: './optimized-image.scss'
})
export class OptimizedImage {

  @Input() src!: string;
  @Input() fallback: string = '/images/fallback.svg';
  @Input() width: string = '100%';
  @Input() height: string = 'auto';
  @Input() maxWidth?: number; // in 'px'
  @Input() maxHeight?: number; // in 'px'
  @Input() alt: string = '';
  @Input() loading?: 'lazy' | 'eager' = 'lazy';
  @Input() objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | '' = '';

  currentSrc!: string;

  ngOnChanges() {
    this.currentSrc = this.src;
  }

  onError() {
    this.currentSrc = this.fallback;
  }

}
