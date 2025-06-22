import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
export class RegisterComponent implements OnInit {
  form: FormGroup;

  mediaTypes = ['ONLINE', 'IMPRESSO'];
  sourceTypes = ['ARTIGO', 'JORNAL', 'LIVRO', 'MONOGRAFIA', 'REVISTA', 'TCC'];

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
      driveUrl: [''],
      imageUrl: [''],
      notes: [''],
      abstractText: [''],
      authors: this.fb.array<FormGroup>([]),
      keywords: this.fb.array<FormGroup>([])
    });
  }

  ngOnInit() {
    this.addAuthor();
    this.addKeyword();
  }

  private createAuthorGroup(author: any = {}): FormGroup {
    return this.fb.group({
      name: [author.nome || ''],
      email: [author.email || ''],
      orcid: [author.orcid || ''],
      affiliation: [author.afiliacao || '']
    });
  }

  private createKeywordGroup(value: string = ''): FormGroup {
    return this.fb.group({ value: [value] });
  }

  get authors(): FormArray<FormGroup> {
    return this.form.get('authors') as FormArray<FormGroup>;
  }

  get keywords(): FormArray<FormGroup> {
    return this.form.get('keywords') as FormArray<FormGroup>;
  }

  addAuthor() {
    this.authors.push(this.createAuthorGroup());
  }

  addKeyword() {
    this.keywords.push(this.createKeywordGroup());
  }

  submit() {
    if (this.form.valid) {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.post('http://localhost:8080/library/add', this.form.value, { headers }).subscribe({
        next: () => {
          this.snackBar.open('Fonte cadastrada com sucesso!', '', { duration: 3000, panelClass: ['snackbar-success'] });
          this.router.navigate(['/home/seach']);
        },
        error: () => {
          this.snackBar.open('Erro ao cadastrar fonte.', '', { duration: 3000, panelClass: ['snackbar-error'] });
        }
      });
    } else {
      this.snackBar.open('Formulário inválido. Verifique os campos.', '', { duration: 3000, panelClass: ['snackbar-warning'] });
    }
  }
}
