import { TestBed } from '@angular/core/testing';

import { DesignloaderService } from './designloader.service';

describe('DesignloaderService', () => {
  let service: DesignloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
