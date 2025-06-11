import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class RegisterComponent {
  form;

  mediaTypes = ['ONLINE', 'IMPRESSO'];
  sourceTypes = ['ARTIGO', 'JORNAL', 'LIVRO', 'MONOGRAFIA', "REVISTA", 'TCC'];

  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      reviewerCode: ['', Validators.required],
      title: ['', Validators.required],
      year: [null, Validators.required],
      reference: [''],
      url: [''],
      type: ['', Validators.required],
      media: ['', Validators.required],
      driveUrl: [''],
      imageUrl: [''],
      notes: [''],
      abstractText: [''],
      authors: this.fb.array([
        this.fb.group({
          name: [''],
          email: [''],
          orcid: [''],
          affiliation: ['']
        })
      ]),
      keywords: this.fb.array([
        this.fb.group({
          value: ['']
        })
      ])
    });
  }

  get authors() {
    return this.form.get('authors') as FormArray;
  }

  get keywords() {
    return this.form.get('keywords') as FormArray;
  }

  addAuthor() {
    this.authors.push(this.fb.group({
      name: [''],
      email: [''],
      orcid: [''],
      affiliation: ['']
    }));
  }

  addKeyword() {
    this.keywords.push(this.fb.group({ value: [''] }));
  }

  submit() {
    if (this.form.valid) {
      const token = localStorage.getItem('token');

      const headers = {
        Authorization: `Bearer ${token}`
      };

      this.http.post('http://localhost:8080/library/add', this.form.value, { headers }).subscribe({
        next: (res) => {
          this.snackBar.open('Fonte cadastrada com sucesso!', '', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.form.reset();
        },
        error: (err) => {
          console.error('Erro ao cadastrar fonte:', err);
          this.snackBar.open('Erro ao cadastrar fonte. Tente novamente.', '', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      this.snackBar.open('Formulário inválido. Verifique os campos.', '', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
    }
  }

}
