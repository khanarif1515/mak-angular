import { TestBed } from '@angular/core/testing';

import { ABService } from './ab.service';

describe('ABService', () => {
  let service: ABService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ABService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
