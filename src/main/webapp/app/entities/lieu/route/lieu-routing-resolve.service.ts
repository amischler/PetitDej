import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILieu, Lieu } from '../lieu.model';
import { LieuService } from '../service/lieu.service';

@Injectable({ providedIn: 'root' })
export class LieuRoutingResolveService implements Resolve<ILieu> {
  constructor(protected service: LieuService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILieu> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lieu: HttpResponse<Lieu>) => {
          if (lieu.body) {
            return of(lieu.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Lieu());
  }
}
