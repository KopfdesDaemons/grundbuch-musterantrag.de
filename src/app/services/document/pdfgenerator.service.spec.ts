import { TestBed } from '@angular/core/testing';

import { PdfgeneratorService } from './pdfgenerator.service';

describe('PdfgeneratorService', () => {
  let service: PdfgeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfgeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
