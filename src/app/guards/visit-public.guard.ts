import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { VisitService } from '../services/visit.service';

@Injectable({
  providedIn: 'root',
})
export class CanActivateVisitGuard implements CanActivate {
  constructor(public router: Router, public visitService: VisitService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const arrUrl = state.url.split('/');
    const id = arrUrl[arrUrl.length - 1];
    const type = arrUrl[arrUrl.length - 2];

    this.visitService.sendVisit(id, this.getType(type));
    return true;
  }

  getType(type: string) {
    if (type === 'documentos-publicos') return 'document';
    if (type === 'categoria') return 'layout';
    if (type === 'subcategoria') return 'sublayout';
    if (type === 'tema') return 'topic';
    if (type === 'solucion') return 'solution';
    return '';
  }
}
