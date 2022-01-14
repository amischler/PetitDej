import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPetitDej, PetitDej } from '../petit-dej.model';
import { PetitDejService } from '../service/petit-dej.service';

@Injectable({ providedIn: 'root' })
export class PetitDejRoutingResolveService implements Resolve<IPetitDej> {
  constructor(protected service: PetitDejService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPetitDej> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((petitDej: HttpResponse<PetitDej>) => {
          if (petitDej.body) {
            return of(petitDej.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PetitDej());
  }
}
