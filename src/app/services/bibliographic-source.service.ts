import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BibliographicSource } from '../models/bibliographic-source.model';
import { HttpParams } from '@angular/common/http';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class BibliographicSourceService {

  private apiUrl = 'http://localhost:8080/library';

  constructor(private http: HttpClient) { }

  getAll(): Observable<BibliographicSource[]> {
    return this.http.get<BibliographicSource[]>(this.apiUrl);
  }

  getPaginated(page: number, itens: number): Observable<Page<BibliographicSource>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itens', itens.toString());

    return this.http.get<Page<BibliographicSource>>(this.apiUrl, { params })
  }
  getById(id: number): Observable<BibliographicSource> {
    return this.http.get<BibliographicSource>(`${this.apiUrl}/${id}`);
  }

  create(source: BibliographicSource): Observable<BibliographicSource> {
    return this.http.post<BibliographicSource>(this.apiUrl, source);
  }

  update(id: number, source: BibliographicSource): Observable<BibliographicSource> {
    return this.http.put<BibliographicSource>(`${this.apiUrl}/${id}`, source);
  }

  partialUpdate(id: number, source: Partial<BibliographicSource>): Observable<BibliographicSource> {
    return this.http.patch<BibliographicSource>(`${this.apiUrl}/${id}`, source);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchWithFilters(params: any): Observable<BibliographicSource[]> {
    return this.http.get<BibliographicSource[]>('http://localhost:8080/library/search', { params });
  }

}
