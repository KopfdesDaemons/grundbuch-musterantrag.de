import { TestBed } from '@angular/core/testing';

import { DisqusService } from './disqus.service';

describe('DisqusService', () => {
  let service: DisqusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisqusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
