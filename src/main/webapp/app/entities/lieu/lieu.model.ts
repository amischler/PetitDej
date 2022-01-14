import { IPetitDej } from 'app/entities/petit-dej/petit-dej.model';

export interface ILieu {
  id?: number;
  name?: string | null;
  capacity?: number | null;
  petitDejs?: IPetitDej[] | null;
}

export class Lieu implements ILieu {
  constructor(public id?: number, public name?: string | null, public capacity?: number | null, public petitDejs?: IPetitDej[] | null) {}
}

export function getLieuIdentifier(lieu: ILieu): number | undefined {
  return lieu.id;
}
