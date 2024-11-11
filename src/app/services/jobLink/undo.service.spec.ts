/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UndoService } from './undo.service';

describe('Service: Undo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UndoService]
    });
  });

  it('should ...', inject([UndoService], (service: UndoService) => {
    expect(service).toBeTruthy();
  }));
});
