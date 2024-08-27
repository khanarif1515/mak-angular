import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DomainNamePipe } from 'src/app/shared/pipes/domain-name/domain-name.pipe';
import { EventsService } from 'src/app/shared/services/events/events.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [MatExpansionModule, DomainNamePipe],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  panelOpenState = false;

  faqs = [
    {
      title: 'Is {{DOMAIN_NAME}} a secure platform for contributions?',
      desc: 'Absolutely! We prioritize transaction security, using industry-standard encryption and secure payment gateways.'
    },
    {
      title: 'Is my personal information safe when I contribute on {{DOMAIN_NAME}}?',
      desc: 'Yes, your privacy is crucial. We employ strict security measures for the utmost confidentiality.'
    },
    {
      title: 'How can I trust the campaigns on {{DOMAIN_NAME}} are genuine?',
      desc: 'We take campaign verification seriously. While we do our best, contributors should read descriptions and check for updates and medical documents for additional information.'
    },
    {
      title: 'How will I know where my contributions are going?',
      desc: 'We ensure that our contributors receive constant updates about the condition of the beneficiaries they have contributed to.'
    },
    {
      title: 'Why do I see that this campaign is raising funds for the specified beneficiary and other patients in need?',
      desc: 'At any given time, multiple campaigns on {{DOMAIN_NAME}} raise funds for medical treatments. We strive to support each one, but some may have more urgent or critical needs. In such cases, we highlight these critical fundraisers as well, giving you the opportunity to help save more than one life.'
    },
    {
      title: 'How much funding is raised or required for this fundraiser?',
      desc: 'The required amount is specified on the fundraiser page and in the provided documents.'
    },
    {
      title: 'How can I ensure that my funds go only to this fundraiser?',
      desc: `If you want to support only this specific fundraiser, simply select 'only beneficiary' from the options provided when making your contribution.`
    },
    {
      title: 'How are the funds allocated between multiple fundraisers?',
      desc: 'Funds are allocated based on the urgency of each fundraiser.'
    }
  ]

  constructor(
    private events: EventsService
  ) { }

  sendEvent() {
    // this.events.sendSystemEvent({eventName: 'Click_on_FAQs'}).subscribe(_ => _);
  }
}
