import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxBenefitBannerComponent } from './tax-benefit-banner.component';

describe('TaxBenefitBannerComponent', () => {
  let component: TaxBenefitBannerComponent;
  let fixture: ComponentFixture<TaxBenefitBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxBenefitBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxBenefitBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
