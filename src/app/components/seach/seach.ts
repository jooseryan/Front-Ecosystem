// search.component.ts
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BibliographicSource } from '../../models/bibliographic-source.model';
import { BibliographicSourceService } from '../../services/bibliographic-source.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seach',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './seach.html',
  styleUrls: ['./seach.css']
})
export class SeachComponent implements OnInit {

displayedColumns: string[] = ['title', 'year', 'authors', 'type', 'media'];
dataSource = new MatTableDataSource<BibliographicSource>();


  constructor(private bibliographicService: BibliographicSourceService) {}

  ngOnInit(): void {
    this.bibliographicService.getAll().subscribe(data => {
      // opcional: você pode formatar o autor se vier como array
      this.dataSource.data = data.map(item => ({
        ...item,
        autor: item.authors?.map(a => a.name).join(', ') // caso "autores" seja um array de objetos
      }));
    });
  }
}

