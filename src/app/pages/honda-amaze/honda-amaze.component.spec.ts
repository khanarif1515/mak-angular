import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HondaAmazeComponent } from './honda-amaze.component';

describe('HondaAmazeComponent', () => {
  let component: HondaAmazeComponent;
  let fixture: ComponentFixture<HondaAmazeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HondaAmazeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HondaAmazeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
