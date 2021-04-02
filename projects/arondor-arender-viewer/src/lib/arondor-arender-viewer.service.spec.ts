import { TestBed } from '@angular/core/testing';

import { ArondorArenderViewerService } from './arondor-arender-viewer.service';

describe('ArondorArenderViewerService', () => {
  let service: ArondorArenderViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArondorArenderViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
