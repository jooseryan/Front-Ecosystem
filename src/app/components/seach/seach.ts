import { BibliographicSource } from './../../models/bibliographic-source.model';
import { Author } from './../../models/author.model';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BibliographicSourceService } from '../../services/bibliographic-source.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators'; // Importe 'map'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared-module';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog';
import {MatIconModule} from '@angular/material/icon';

export interface BibliographicSourceDisplay extends Omit<BibliographicSource, 'authors'> {
  authors: string;
}

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
  templateUrl: './seach.html',
  styleUrls: ['./seach.css']
})
export class SeachComponent implements OnInit {

  displayedColumns: string[] = ['title', 'year', 'authors', 'type', 'media', 'actions'];
  dataSource = new MatTableDataSource<BibliographicSourceDisplay>();

  bibliographicSources$!: Observable<BibliographicSourceDisplay[]>;
  errorMessage: string | null = null;

  constructor(
    private bibliographicService: BibliographicSourceService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBibliographicSources();
  }

  loadBibliographicSources(): void {
    this.errorMessage = null;

    this.bibliographicSources$ = this.bibliographicService.getAll().pipe(
      map(data => {
        const transformedData = data.map(item => ({
          ...item,
          authors: item.authors && Array.isArray(item.authors)
            ? item.authors.map((a: Author) => a.name).join(', ')
            : ''
        }) as BibliographicSourceDisplay);

        // Atualiza o dataSource com os dados transformados
        this.dataSource.data = transformedData;
        return transformedData; // Retorna os dados transformados para o stream principal
      }),
      catchError(error => {
        console.error('Error loading bibliographic sources:', error);
        this.onError('Erro ao carregar fontes bibliográficas. Tente novamente mais tarde.');
        return of([]); // Retorna Observable de array vazio do tipo BibliographicSourceDisplay[]
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

  onEdit(bibliographicSource: BibliographicSourceService) {
    //this.edit.emit(bibliographicSource);
  }

  onDelete(bibliographicSource: BibliographicSourceService) {
    //this.remove.emit(bibliographicSource);
  }
}


