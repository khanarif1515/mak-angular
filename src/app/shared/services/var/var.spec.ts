import { TestBed } from '@angular/core/testing';

import { Var } from './var';

describe('Var', () => {
  let service: Var;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Var);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
