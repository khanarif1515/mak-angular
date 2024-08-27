import { Pipe, PipeTransform } from '@angular/core';
import { VariablesService } from 'src/app/shared/services';

@Pipe({
  name: 'DomainNamePipe',
  standalone: true
})
export class DomainNamePipe implements PipeTransform {
  constructor(
    private vars: VariablesService
  ) { }

  transform(val: unknown, domainName?: string): unknown {
    if (val && typeof val === 'string') {
      val = val.replace(/{{DOMAIN_NAME}}/g, domainName || this.vars.domain_details.name || '').replace(/{{POWERED_BY}}/g, this.vars.poweredBy);
    }
    return val;
  }

}
