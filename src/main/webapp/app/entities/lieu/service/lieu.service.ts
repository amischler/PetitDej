import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILieu, getLieuIdentifier } from '../lieu.model';

export type EntityResponseType = HttpResponse<ILieu>;
export type EntityArrayResponseType = HttpResponse<ILieu[]>;

@Injectable({ providedIn: 'root' })
export class LieuService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lieus');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(lieu: ILieu): Observable<EntityResponseType> {
    return this.http.post<ILieu>(this.resourceUrl, lieu, { observe: 'response' });
  }

  update(lieu: ILieu): Observable<EntityResponseType> {
    return this.http.put<ILieu>(`${this.resourceUrl}/${getLieuIdentifier(lieu) as number}`, lieu, { observe: 'response' });
  }

  partialUpdate(lieu: ILieu): Observable<EntityResponseType> {
    return this.http.patch<ILieu>(`${this.resourceUrl}/${getLieuIdentifier(lieu) as number}`, lieu, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILieu>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILieu[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLieuToCollectionIfMissing(lieuCollection: ILieu[], ...lieusToCheck: (ILieu | null | undefined)[]): ILieu[] {
    const lieus: ILieu[] = lieusToCheck.filter(isPresent);
    if (lieus.length > 0) {
      const lieuCollectionIdentifiers = lieuCollection.map(lieuItem => getLieuIdentifier(lieuItem)!);
      const lieusToAdd = lieus.filter(lieuItem => {
        const lieuIdentifier = getLieuIdentifier(lieuItem);
        if (lieuIdentifier == null || lieuCollectionIdentifiers.includes(lieuIdentifier)) {
          return false;
        }
        lieuCollectionIdentifiers.push(lieuIdentifier);
        return true;
      });
      return [...lieusToAdd, ...lieuCollection];
    }
    return lieuCollection;
  }
}
