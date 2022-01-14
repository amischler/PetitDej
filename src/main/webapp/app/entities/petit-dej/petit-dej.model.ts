import dayjs from 'dayjs/esm';
import { ILieu } from 'app/entities/lieu/lieu.model';
import { IUser } from 'app/entities/user/user.model';

export interface IPetitDej {
  id?: number;
  date?: dayjs.Dayjs;
  commentaire?: string | null;
  lieu?: ILieu | null;
  organisateur?: IUser | null;
  participants?: IUser[] | null;
}

export class PetitDej implements IPetitDej {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public commentaire?: string | null,
    public lieu?: ILieu | null,
    public organisateur?: IUser | null,
    public participants?: IUser[] | null
  ) {}
}

export function getPetitDejIdentifier(petitDej: IPetitDej): number | undefined {
  return petitDej.id;
}
