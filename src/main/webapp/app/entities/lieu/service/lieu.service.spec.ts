import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILieu, Lieu } from '../lieu.model';

import { LieuService } from './lieu.service';

describe('Lieu Service', () => {
  let service: LieuService;
  let httpMock: HttpTestingController;
  let elemDefault: ILieu;
  let expectedResult: ILieu | ILieu[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LieuService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      capacity: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Lieu', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Lieu()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Lieu', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          capacity: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Lieu', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          capacity: 1,
        },
        new Lieu()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Lieu', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          capacity: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Lieu', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLieuToCollectionIfMissing', () => {
      it('should add a Lieu to an empty array', () => {
        const lieu: ILieu = { id: 123 };
        expectedResult = service.addLieuToCollectionIfMissing([], lieu);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lieu);
      });

      it('should not add a Lieu to an array that contains it', () => {
        const lieu: ILieu = { id: 123 };
        const lieuCollection: ILieu[] = [
          {
            ...lieu,
          },
          { id: 456 },
        ];
        expectedResult = service.addLieuToCollectionIfMissing(lieuCollection, lieu);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Lieu to an array that doesn't contain it", () => {
        const lieu: ILieu = { id: 123 };
        const lieuCollection: ILieu[] = [{ id: 456 }];
        expectedResult = service.addLieuToCollectionIfMissing(lieuCollection, lieu);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lieu);
      });

      it('should add only unique Lieu to an array', () => {
        const lieuArray: ILieu[] = [{ id: 123 }, { id: 456 }, { id: 4095 }];
        const lieuCollection: ILieu[] = [{ id: 123 }];
        expectedResult = service.addLieuToCollectionIfMissing(lieuCollection, ...lieuArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const lieu: ILieu = { id: 123 };
        const lieu2: ILieu = { id: 456 };
        expectedResult = service.addLieuToCollectionIfMissing([], lieu, lieu2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lieu);
        expect(expectedResult).toContain(lieu2);
      });

      it('should accept null and undefined values', () => {
        const lieu: ILieu = { id: 123 };
        expectedResult = service.addLieuToCollectionIfMissing([], null, lieu, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lieu);
      });

      it('should return initial array if no Lieu is added', () => {
        const lieuCollection: ILieu[] = [{ id: 123 }];
        expectedResult = service.addLieuToCollectionIfMissing(lieuCollection, undefined, null);
        expect(expectedResult).toEqual(lieuCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
