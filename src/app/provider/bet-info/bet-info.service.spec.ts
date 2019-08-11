import { TestBed } from '@angular/core/testing';

import { BetInfoService } from './bet-info.service';

describe('BetInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BetInfoService = TestBed.get(BetInfoService);
    expect(service).toBeTruthy();
  });
});
