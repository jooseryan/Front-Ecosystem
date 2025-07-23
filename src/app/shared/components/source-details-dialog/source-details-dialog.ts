import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-source-details-dialog',
  imports: [
    MatDialogModule,
    CommonModule
  ],
  templateUrl: './source-details-dialog.html',
  styleUrls: ['./source-details-dialog.css']
})
export class SourceDetailsDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
