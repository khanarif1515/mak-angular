import { Directive, ElementRef } from '@angular/core';
import { UtilService, VariablesService } from '../../services';

@Directive({
  selector: '[appImageFallback]',
  standalone: true
})
export class ImageFallbackDirective {

  constructor(
    private el: ElementRef,
    private util: UtilService,
    private vars: VariablesService
  ) { }

  ngOnInit() {
    this.execute();
  }

  execute(): any {
    this.util.testImage(this.el.nativeElement.src).then((val: any) => {
      if (val.status === 'success') {
        this.el.nativeElement.src = val.url;
      }
    }, error => {
      this.el.nativeElement.src = this.vars.defaultImg;
    })
  }

}
