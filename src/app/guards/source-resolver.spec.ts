import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { sourceResolver } from './source-resolver';

describe('sourceResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => sourceResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
