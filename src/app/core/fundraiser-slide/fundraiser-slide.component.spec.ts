import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserSlideComponent } from './fundraiser-slide.component';

describe('FundraiserSlideComponent', () => {
  let component: FundraiserSlideComponent;
  let fixture: ComponentFixture<FundraiserSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundraiserSlideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundraiserSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
