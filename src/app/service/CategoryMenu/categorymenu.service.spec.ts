import { TestBed } from '@angular/core/testing';

import { CategoryMenuService } from './categorymenu.service';

describe('CategorymenuService', () => {
  let service: CategoryMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
