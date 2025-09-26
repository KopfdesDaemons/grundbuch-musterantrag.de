import { TestBed } from '@angular/core/testing';

import { PaginatedDataService } from './paginated-data.service';

describe('PaginatedDataService', () => {
  let service: PaginatedDataService<undefined>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginatedDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
