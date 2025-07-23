import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceDetailsDialog } from './source-details-dialog.js';

describe('SourceDetailsDialogTs', () => {
  let component: SourceDetailsDialog;
  let fixture: ComponentFixture<SourceDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceDetailsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
