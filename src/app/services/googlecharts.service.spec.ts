import { TestBed } from '@angular/core/testing';

import { GooglechartsService } from './googlecharts.service';

describe('GooglechartsService', () => {
  let service: GooglechartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GooglechartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
