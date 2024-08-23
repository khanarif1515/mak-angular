import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazeMH12PQ4787Component } from './amaze-mh-12-pq-4787.component';

describe('AmazeMH12PQ4787Component', () => {
  let component: AmazeMH12PQ4787Component;
  let fixture: ComponentFixture<AmazeMH12PQ4787Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmazeMH12PQ4787Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmazeMH12PQ4787Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
