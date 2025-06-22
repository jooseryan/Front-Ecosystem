import { Component, EventEmitter, OnInit, output, input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { BibliographicSource } from '../../models/bibliographic-source.model';
import { BibliographicSourceService } from '../../services/bibliographic-source.service';
import { SharedModule } from '../../shared/shared-module';
import { ConfirmationDialog } from '../../shared/components/confirmation-dialog/confirmation-dialog';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    SharedModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class SearchComponent implements OnInit {

  displayedColumns: string[] = ['title', 'year', 'authors', 'type', 'media', 'actions'];
  dataSource = new MatTableDataSource<BibliographicSource>();

  bibliographicSources$!: Observable<BibliographicSource[]>;
  errorMessage: string | null = null;

  constructor(
    private bibliographicService: BibliographicSourceService,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBibliographicSources();
  }

  loadBibliographicSources(): void {
    this.errorMessage = null;

    this.bibliographicService.getAll().pipe(
      tap(data => {
        this.dataSource.data = data;
      }),
      catchError(error => {
        console.error('Error loading bibliographic sources:', error);
        this.onError('Erro ao carregar fontes bibliográficas. Tente novamente mais tarde.');
        return of([]);
      })
    ).subscribe();
  }

  onError(errorMsg: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  retryLoad(): void {
    this.loadBibliographicSources();
  }

  onEdit(source: BibliographicSource): void {
    this.router.navigate(['/home/update', source.id]);
  }

  onDelete(source: BibliographicSource): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: 'Tem certeza que deseja remover essa fonte?',
      width: '400px',
      height: '200px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const token = localStorage.getItem('token');

        if (!token) {
          this.snackBar.open('Usuário não autenticado. Faça login novamente.', '', {
            duration: 3000,
            panelClass: ['snackbar-warning'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`
        };

        this.http.delete(`http://localhost:8080/library/${source.id}`, { headers }).subscribe({
          next: () => {
            this.snackBar.open('Fonte deletada com sucesso!', '', {
              duration: 3000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.loadBibliographicSources();
          },
          error: (error) => {
            console.error('Erro ao deletar:', error);
            this.snackBar.open('Erro ao deletar a fonte.', '', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        });
      }
    });
  }

  filterOptions = {
  title: false,
  author: false,
  year: false,
  type: false,
  media: false
};

filters = {
  title: '',
  author: '',
  year: null,
  type: '',
  media: ''
};

enabledFilters: { [key: string]: boolean } = {
  title: false,
  author: false,
  year: false,
  type: false,
  media: false
};

types = ['TCC', 'Revista', 'Artigo', 'Jornal', 'Monografia', 'Livro'];
medias = ['Impresso', 'Online'];

search(): void {
  const params: any = {};

  if (this.enabledFilters['title']) params.title = this.filters.title;
  if (this.enabledFilters['author']) params.author = this.filters.author;
  if (this.enabledFilters['year']) params.year = this.filters.year;
  if (this.enabledFilters['type']) params.type = this.filters.type;
  if (this.enabledFilters['media']) params.media = this.filters.media;

  this.bibliographicService.searchWithFilters(params).subscribe(data => {
    console.log('Resultados da pesquisa:', data);
    this.dataSource.data = data;
  });
}

clearFilters(): void {
  this.filters = { title: '', author: '', year: null, type: '', media: '' };
  this.enabledFilters = { title: false, author: false, year: false, type: false, media: false };

  this.loadBibliographicSources();
}


}
