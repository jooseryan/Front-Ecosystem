import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule
],
  templateUrl: './import.html',
  styleUrls: ['./import.css']
})
export class ImportComponent {
  form: FormGroup;
  fileToUpload: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      reviewerCode: [''],
      title: [''],
      year: [null],
      reference: [''],
      url: [''],
      type: [''],
      media: [''],
      notes: [''],
      abstractText: [''],
      authors: this.fb.array<FormGroup>([]),
      keywords: this.fb.array<FormGroup>([])
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      this.fileToUpload = file;
    } else {
      this.snackBar.open('Por favor, selecione um arquivo CSV válido.', 'Fechar', { duration: 3000 });
      event.target.value = '';
      this.fileToUpload = null;
    }
  }

  onSubmit() {
    if (!this.fileToUpload) return;

    const formData = new FormData();
    formData.append('file', this.fileToUpload);

    this.http.post('/api/import-csv', formData).subscribe({
      next: () => {
        this.snackBar.open('Arquivo importado com sucesso!', 'Fechar', { duration: 3000 });
        this.fileToUpload = null;
        this.form.reset();
      },
      error: () => {
        this.snackBar.open('Erro ao importar arquivo.', 'Fechar', { duration: 3000 });
      }
    });
  }
}
