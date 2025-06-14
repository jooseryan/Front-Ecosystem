import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

import { BibliographicSource } from '../../models/bibliographic-source.model';
import { BibliographicSourceService } from '../../services/bibliographic-source.service';
import { SharedModule } from '../../shared/shared-module';
import { ConfirmationDialog } from '../../shared/components/confirmation-dialog/confirmation-dialog';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog';

@Component({
  selector: 'app-seach',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    SharedModule,
    MatIconModule
  ],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class SearchComponent implements OnInit {
  @Output() edit = new EventEmitter<BibliographicSource>();
  @Output() delete = new EventEmitter<BibliographicSource>();

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

    this.bibliographicSources$ = this.bibliographicService.getAll().pipe(
      tap(data => {
        this.dataSource.data = data;
      }),
      catchError(error => {
        console.error('Error loading bibliographic sources:', error);
        this.onError('Erro ao carregar fontes bibliográficas. Tente novamente mais tarde.');
        return of([]);
      })
    );
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
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const token = localStorage.getItem('token');

        if (!token) {
          this.snackBar.open('Usuário não autenticado. Faça login novamente.', '', {
            duration: 3000,
            panelClass: ['snackbar-warning']
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
              panelClass: ['snackbar-success']
            });
            this.loadBibliographicSources();
          },
          error: (error) => {
            console.error('Erro ao deletar:', error);
            this.snackBar.open('Erro ao deletar a fonte.', '', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
    });
  }
}
