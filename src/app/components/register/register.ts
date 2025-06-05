import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class RegisterComponent {
  form;

  mediaTypes = ['ONLINE', 'IMPRESSO'];
  sourceTypes = ['ARTIGO', 'JORNAL','LIVRO', 'MONOGRAFIA', "REVISTA", 'TCC'];

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
        console.log('Fonte cadastrada com sucesso:', res);
        this.form.reset();
      },
      error: (err) => {
        console.error('Erro ao cadastrar fonte:', err);
      }
    });
  } else {
    console.warn('Formulário inválido');
  }
}

}
