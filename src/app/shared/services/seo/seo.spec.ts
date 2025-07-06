import { TestBed } from '@angular/core/testing';

import { SeoS } from './seo';

describe('Seo', () => {
  let service: SeoS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
