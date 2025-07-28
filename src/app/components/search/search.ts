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
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { SourceDetailsDialog } from '../../shared/components/source-details-dialog/source-details-dialog';

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
    MatButtonModule
  ],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class SearchComponent implements OnInit {

  displayedColumns: string[] = ['title', 'year', 'authors', 'type', 'media', 'actions'];
  dataSource = new MatTableDataSource<BibliographicSource>();

  bibliographicSources$!: Observable<BibliographicSource[]>;
  errorMessage: string | null = null;

  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;

  constructor(
    private bibliographicService: BibliographicSourceService,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadBibliographicSources();
  }

  loadBibliographicSources(): void {
    this.errorMessage = null;

    this.bibliographicService.getPaginated(this.currentPage, this.pageSize).pipe(
      tap(response => {
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.pageSize = response.size;
        this.currentPage = response.number;
      }),
      catchError(error => {
        console.error('Erro ao carregar fontes:', error);
        this.onError('Erro ao carregar fontes bibliográficas. Tente novamente.');
        return of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 });
      })
    ).subscribe();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadBibliographicSources();
  }

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0);
  }

  goToPrevious(): void {
    if (this.currentPage > 0) {
      this.onPageChange({ pageIndex: this.currentPage - 1, pageSize: this.pageSize });
    }
  }

  goToNext(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.onPageChange({ pageIndex: this.currentPage + 1, pageSize: this.pageSize });
    }
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
      disableClose: true,
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

  openDetailsDialog(source: BibliographicSource): void {
    this.dialog.open(SourceDetailsDialog, {
      width: '500px',
      data: source
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
    yearStart: null,
    yearEnd: null,
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

  types = ['TCC', 'REVISTA', 'ARTIGO', 'JORNAL', 'MONOGRAFIA', 'LIVRO'];
  medias = ['IMPRESSO', 'ONLINE'];

  search(): void {
  const params: any = {};

  if (this.enabledFilters['title']) {
    params.title = this.filters.title;
  }

  if (this.enabledFilters['author']) {
    params.author = this.filters.author;
  }

  if (this.enabledFilters['year']) {
    if (this.filters.yearStart) {
      params.yearStart = this.filters.yearStart;
    }
    if (this.filters.yearEnd) {
      params.yearEnd = this.filters.yearEnd;
    }
  }

  if (this.enabledFilters['type']) {
    params.type = this.filters.type;
  }

  if (this.enabledFilters['media']) {
    params.media = this.filters.media;
  }

  this.bibliographicService.searchWithFilters(params).subscribe(data => {

    const sorted = data.sort((a, b) => a.year - b.year);
    console.log('Resultados da pesquisa:', data);
    this.dataSource.data = sorted;
  });
}

  get hasAnyFilterSelected(): boolean {
  return Object.values(this.enabledFilters).some(value => value);
}


  clearFilters(): void {
    this.filters = { title: '', author: '', yearStart: null, yearEnd: null, type: '', media: '' };
    this.enabledFilters = { title: false, author: false, year: false, type: false, media: false };

    this.loadBibliographicSources();
  }


}
