import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPetitDej, getPetitDejIdentifier } from '../petit-dej.model';

export type EntityResponseType = HttpResponse<IPetitDej>;
export type EntityArrayResponseType = HttpResponse<IPetitDej[]>;

@Injectable({ providedIn: 'root' })
export class PetitDejService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/petit-dejs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(petitDej: IPetitDej): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(petitDej);
    return this.http
      .post<IPetitDej>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(petitDej: IPetitDej): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(petitDej);
    return this.http
      .put<IPetitDej>(`${this.resourceUrl}/${getPetitDejIdentifier(petitDej) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(petitDej: IPetitDej): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(petitDej);
    return this.http
      .patch<IPetitDej>(`${this.resourceUrl}/${getPetitDejIdentifier(petitDej) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPetitDej>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPetitDej[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPetitDejToCollectionIfMissing(petitDejCollection: IPetitDej[], ...petitDejsToCheck: (IPetitDej | null | undefined)[]): IPetitDej[] {
    const petitDejs: IPetitDej[] = petitDejsToCheck.filter(isPresent);
    if (petitDejs.length > 0) {
      const petitDejCollectionIdentifiers = petitDejCollection.map(petitDejItem => getPetitDejIdentifier(petitDejItem)!);
      const petitDejsToAdd = petitDejs.filter(petitDejItem => {
        const petitDejIdentifier = getPetitDejIdentifier(petitDejItem);
        if (petitDejIdentifier == null || petitDejCollectionIdentifiers.includes(petitDejIdentifier)) {
          return false;
        }
        petitDejCollectionIdentifiers.push(petitDejIdentifier);
        return true;
      });
      return [...petitDejsToAdd, ...petitDejCollection];
    }
    return petitDejCollection;
  }

  protected convertDateFromClient(petitDej: IPetitDej): IPetitDej {
    return Object.assign({}, petitDej, {
      date: petitDej.date?.isValid() ? petitDej.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((petitDej: IPetitDej) => {
        petitDej.date = petitDej.date ? dayjs(petitDej.date) : undefined;
      });
    }
    return res;
  }
}
