import { TestBed } from '@angular/core/testing';

import { UserroleService } from './userrole.service';

describe('UserroleService', () => {
  let service: UserroleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserroleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
