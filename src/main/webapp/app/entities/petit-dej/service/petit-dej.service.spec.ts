import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPetitDej, PetitDej } from '../petit-dej.model';

import { PetitDejService } from './petit-dej.service';

describe('PetitDej Service', () => {
  let service: PetitDejService;
  let httpMock: HttpTestingController;
  let elemDefault: IPetitDej;
  let expectedResult: IPetitDej | IPetitDej[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PetitDejService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      date: currentDate,
      commentaire: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PetitDej', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new PetitDej()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PetitDej', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_FORMAT),
          commentaire: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PetitDej', () => {
      const patchObject = Object.assign(
        {
          commentaire: 'BBBBBB',
        },
        new PetitDej()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PetitDej', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_FORMAT),
          commentaire: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PetitDej', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPetitDejToCollectionIfMissing', () => {
      it('should add a PetitDej to an empty array', () => {
        const petitDej: IPetitDej = { id: 123 };
        expectedResult = service.addPetitDejToCollectionIfMissing([], petitDej);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(petitDej);
      });

      it('should not add a PetitDej to an array that contains it', () => {
        const petitDej: IPetitDej = { id: 123 };
        const petitDejCollection: IPetitDej[] = [
          {
            ...petitDej,
          },
          { id: 456 },
        ];
        expectedResult = service.addPetitDejToCollectionIfMissing(petitDejCollection, petitDej);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PetitDej to an array that doesn't contain it", () => {
        const petitDej: IPetitDej = { id: 123 };
        const petitDejCollection: IPetitDej[] = [{ id: 456 }];
        expectedResult = service.addPetitDejToCollectionIfMissing(petitDejCollection, petitDej);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(petitDej);
      });

      it('should add only unique PetitDej to an array', () => {
        const petitDejArray: IPetitDej[] = [{ id: 123 }, { id: 456 }, { id: 16321 }];
        const petitDejCollection: IPetitDej[] = [{ id: 123 }];
        expectedResult = service.addPetitDejToCollectionIfMissing(petitDejCollection, ...petitDejArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const petitDej: IPetitDej = { id: 123 };
        const petitDej2: IPetitDej = { id: 456 };
        expectedResult = service.addPetitDejToCollectionIfMissing([], petitDej, petitDej2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(petitDej);
        expect(expectedResult).toContain(petitDej2);
      });

      it('should accept null and undefined values', () => {
        const petitDej: IPetitDej = { id: 123 };
        expectedResult = service.addPetitDejToCollectionIfMissing([], null, petitDej, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(petitDej);
      });

      it('should return initial array if no PetitDej is added', () => {
        const petitDejCollection: IPetitDej[] = [{ id: 123 }];
        expectedResult = service.addPetitDejToCollectionIfMissing(petitDejCollection, undefined, null);
        expect(expectedResult).toEqual(petitDejCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
