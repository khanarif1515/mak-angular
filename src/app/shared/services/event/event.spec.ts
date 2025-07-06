import { TestBed } from '@angular/core/testing';

import { EventS } from './event';

describe('Event', () => {
  let service: EventS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
