import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update',
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
  templateUrl: './update.html',
  styleUrl: './update.css',
})
export class UpdateComponent implements OnInit {
  form: FormGroup;
  idEditando!: number;
  isLoading = true;

  mediaTypes = ['ONLINE', 'IMPRESSO'];
  sourceTypes = ['ARTIGO', 'JORNAL', 'LIVRO', 'MONOGRAFIA', 'REVISTA', 'TCC'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
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
      authors: this.fb.array<FormGroup>([]),
      keywords: this.fb.array<FormGroup>([])
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const idParam = paramMap.get('id');

      if (!idParam) {
        this.snackBar.open('ID da fonte não informado.', '', { duration: 3000 });
        this.router.navigate(['/home/search']);
        return;
      }

      this.idEditando = Number(idParam);

      const token = localStorage.getItem('token');
      if (!token) {
        this.snackBar.open('Usuário não autenticado.', '', { duration: 3000 });
        this.router.navigate(['/login']);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      this.isLoading = true;

      this.http.get<any>(`http://localhost:8080/library/${this.idEditando}`, { headers }).subscribe({
        next: (data) => {
          console.log('Dados recebidos do backend:', data);
          this.patchForm(data);
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('Erro ao carregar dados para edição.', '', { duration: 3000 });
          this.router.navigate(['/home/search']);
        }
      });
    });
  }

  private createAuthorGroup(author: any = {}): FormGroup {
    return this.fb.group({
      name: [author.name || ''],
      email: [author.email || ''],
      orcid: [author.orcid || ''],
      affiliation: [author.affiliation || '']
    });
  }

  private createKeywordGroup(value: string = ''): FormGroup {
    return this.fb.group({ value: [value] });
  }

  patchForm(data: any) {
    this.form.patchValue({
      reviewerCode: data.reviewerCode,
      title: data.title,
      year: data.year,
      reference: data.reference,
      url: data.url,
      type: data.type,
      media: data.media,
      driveUrl: data.driveUrl,
      imageUrl: data.imageUrl,
      notes: data.notes,
      abstractText: data.abstractText
    });

    const authorsArray = this.fb.array<FormGroup>([]);
    for (let author of data.authors || []) {
      authorsArray.push(this.createAuthorGroup(author));
    }
    this.form.setControl('authors', authorsArray);

    const keywordsArray = this.fb.array<FormGroup>([]);
    for (let keyword of data.keywords || []) {
      keywordsArray.push(this.createKeywordGroup(keyword.value));
    }
    this.form.setControl('keywords', keywordsArray);
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

  onCancel() {
    this.router.navigate(['/home/search'])
  }

  submit() {
    if (this.form.valid) {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.put(`http://localhost:8080/library/${this.idEditando}`, this.form.value, { headers }).subscribe({
        next: () => {
          this.snackBar.open('Fonte atualizada com sucesso!', '', { duration: 3000, panelClass: ['snackbar-success'] });
          this.router.navigate(['/home/search']);
        },
        error: () => {
          this.snackBar.open('Erro ao atualizar fonte.', '', { duration: 3000, panelClass: ['snackbar-error'] });
        }
      });
    } else {
      this.snackBar.open('Formulário inválido. Verifique os campos.', '', { duration: 3000, panelClass: ['snackbar-warning'] });
    }
  }
}
