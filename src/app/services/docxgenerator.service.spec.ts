import { TestBed } from '@angular/core/testing';

import { DocxgeneratorService } from './docxgenerator.service';

describe('DocxgeneratorService', () => {
  let service: DocxgeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocxgeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
