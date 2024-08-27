import { Directive, Input, OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appLazyDirective]',
  standalone: true
})
export class LazyDirective implements OnChanges {

  @Input() appLazyDirective: any;
  @Input() inputs: any;
  @Input() outputs: any;

  comp_instance: any;

  constructor(
    private container: ViewContainerRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.comp_instance && changes?.['inputs']?.currentValue) {
      this.setInput();
    } else if (!changes?.['appLazyDirective']?.currentValue) {
      return;
    } else {
      this.load().catch((err) => { console.log(err) });
    }
  }

  load() {
    return (this.appLazyDirective.component() as Promise<any>).then((component) => {
      this.container.clear();
      this.comp_instance = this.container.createComponent(component[Object.keys(component)[0]]).instance;
      this.setInput();
      this.setOutput();
    });
  }

  setInput() {
    if (typeof this.inputs === 'object') {
      Object.keys(this.inputs).forEach(element => {
        this.comp_instance[element] = this.inputs[element];
      });
    }
  }

  setOutput() {
    if (typeof this.outputs === 'object') {
      Object.keys(this.outputs).forEach(element => {
        this.comp_instance[element].subscribe((e: any) => {
          if (typeof this.outputs[element] === 'function') {
            this.outputs[element](e);
          }
        });
      });
    }
  }

}
