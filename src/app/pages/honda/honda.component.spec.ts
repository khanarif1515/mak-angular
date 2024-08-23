import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HondaComponent } from './honda.component';

describe('HondaComponent', () => {
  let component: HondaComponent;
  let fixture: ComponentFixture<HondaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HondaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HondaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
