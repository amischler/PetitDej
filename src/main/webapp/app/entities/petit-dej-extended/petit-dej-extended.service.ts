import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPetitDej, getPetitDejIdentifier } from '../petit-dej/petit-dej.model';
import { PetitDejService } from '../petit-dej/service/petit-dej.service';

export type EntityResponseType = HttpResponse<IPetitDej>;
export type EntityArrayResponseType = HttpResponse<IPetitDej[]>;

@Injectable({ providedIn: 'root' })
export class PetitDejExtendedService extends PetitDejService {

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/v1/petit-dejs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http, applicationConfigService);
  }

  switchParticipation(petitDej: IPetitDej): Observable<EntityResponseType> {
    return this.http
          .get<IPetitDej>(`${this.resourceUrl}/participate/${getPetitDejIdentifier(petitDej) as number}`, { observe: 'response' })
          .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

}
