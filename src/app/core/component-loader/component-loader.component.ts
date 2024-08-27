import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyDirective } from './lazy/lazy.directive';

@Component({
  selector: 'app-component-loader',
  standalone: true,
  imports: [CommonModule, LazyDirective],
  templateUrl: './component-loader.component.html',
  styleUrls: ['./component-loader.component.scss']
})
export class ComponentLoader implements OnChanges {

  // @Input() load: boolean = false;
  @Input() selector: string = '';
  @Input() inputs: any;
  @Input() outputs: any;

  lazy_config: any;

  ngOnChanges(changes: SimpleChanges): void {
    // if ((!changes?.['load']?.currentValue) || (changes?.['load']?.currentValue === changes?.['load']?.previousValue) || (changes?.['load']?.currentValue?.toString() === changes?.['load']?.previousValue?.toString())) {
    //   return;
    // }
    this.loadLazyComponent();
  }

  loadLazyComponent() {
    // if (!this.load) {
    //   return;
    // }
    this.lazy_config = {
      component: this.getPath()
    }

  }

  getPath() {

    switch (true) {

      case this.selector === 'app-faq':
        return () => import('./../faq/faq.component');

      default:
        return;
    }

  }

}
