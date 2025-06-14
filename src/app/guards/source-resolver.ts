import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BibliographicSourceService } from '../services/bibliographic-source.service';
import { Observable, of } from 'rxjs';
import { BibliographicSource } from '../models/bibliographic-source.model';

@Injectable({ providedIn: 'root' })
export class SourceResolver implements Resolve<BibliographicSource | null> {
  constructor(private service: BibliographicSourceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BibliographicSource | null> {
    const id = route.params['id'];
    if (id) {
      return this.service.getById(id);
    }
    return of(null);
  }
}
