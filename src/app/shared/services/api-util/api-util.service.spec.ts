import { TestBed } from '@angular/core/testing';

import { ApiUtilService } from './api-util.service';

describe('ApiUtilService', () => {
  let service: ApiUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
