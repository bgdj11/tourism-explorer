import { TestBed } from '@angular/core/testing';

import { ObjectServiceTsService } from './object.service.ts.service';

describe('ObjectServiceTsService', () => {
  let service: ObjectServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
