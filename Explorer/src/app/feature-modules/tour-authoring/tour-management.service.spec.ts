import { TestBed } from '@angular/core/testing';

import { TourManagementService } from './tour-management.service';

describe('TourManagementService', () => {
  let service: TourManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
