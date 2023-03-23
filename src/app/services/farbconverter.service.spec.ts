import { TestBed } from '@angular/core/testing';

import { FarbconverterService } from './farbconverter.service';

describe('FarbconverterService', () => {
  let service: FarbconverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FarbconverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
