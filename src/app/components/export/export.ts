import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './export.html',
  styleUrls: ['./export.css']
})
export class ExportComponent {
  selectedFormat: string = 'csv';
  downloadLink: string | null = null;

  exportarDados() {
    const dados = [
      { nome: 'Item 1', valor: 10 },
      { nome: 'Item 2', valor: 20 },
    ];

    let content: string;
    let mimeType: string;
    let extension: string;

    switch (this.selectedFormat) {
      case 'csv':
        content = this.convertToCSV(dados);
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      case 'json':
        content = JSON.stringify(dados, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    this.downloadLink = URL.createObjectURL(blob);
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => `"${row[h]}"`).join(','));
    return [headers.join(','), ...rows].join('\n');
  }
}
