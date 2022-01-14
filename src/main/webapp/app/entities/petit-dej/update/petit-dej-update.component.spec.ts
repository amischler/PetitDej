import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PetitDejService } from '../service/petit-dej.service';
import { IPetitDej, PetitDej } from '../petit-dej.model';
import { ILieu } from 'app/entities/lieu/lieu.model';
import { LieuService } from 'app/entities/lieu/service/lieu.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { PetitDejUpdateComponent } from './petit-dej-update.component';

describe('PetitDej Management Update Component', () => {
  let comp: PetitDejUpdateComponent;
  let fixture: ComponentFixture<PetitDejUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let petitDejService: PetitDejService;
  let lieuService: LieuService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PetitDejUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PetitDejUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PetitDejUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    petitDejService = TestBed.inject(PetitDejService);
    lieuService = TestBed.inject(LieuService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Lieu query and add missing value', () => {
      const petitDej: IPetitDej = { id: 456 };
      const lieu: ILieu = { id: 94925 };
      petitDej.lieu = lieu;

      const lieuCollection: ILieu[] = [{ id: 21480 }];
      jest.spyOn(lieuService, 'query').mockReturnValue(of(new HttpResponse({ body: lieuCollection })));
      const additionalLieus = [lieu];
      const expectedCollection: ILieu[] = [...additionalLieus, ...lieuCollection];
      jest.spyOn(lieuService, 'addLieuToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ petitDej });
      comp.ngOnInit();

      expect(lieuService.query).toHaveBeenCalled();
      expect(lieuService.addLieuToCollectionIfMissing).toHaveBeenCalledWith(lieuCollection, ...additionalLieus);
      expect(comp.lieusSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const petitDej: IPetitDej = { id: 456 };
      const organisateur: IUser = { id: 71232 };
      petitDej.organisateur = organisateur;
      const participants: IUser[] = [{ id: 73575 }];
      petitDej.participants = participants;

      const userCollection: IUser[] = [{ id: 15596 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [organisateur, ...participants];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ petitDej });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const petitDej: IPetitDej = { id: 456 };
      const lieu: ILieu = { id: 72919 };
      petitDej.lieu = lieu;
      const organisateur: IUser = { id: 85204 };
      petitDej.organisateur = organisateur;
      const participants: IUser = { id: 20479 };
      petitDej.participants = [participants];

      activatedRoute.data = of({ petitDej });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(petitDej));
      expect(comp.lieusSharedCollection).toContain(lieu);
      expect(comp.usersSharedCollection).toContain(organisateur);
      expect(comp.usersSharedCollection).toContain(participants);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PetitDej>>();
      const petitDej = { id: 123 };
      jest.spyOn(petitDejService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ petitDej });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: petitDej }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(petitDejService.update).toHaveBeenCalledWith(petitDej);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PetitDej>>();
      const petitDej = new PetitDej();
      jest.spyOn(petitDejService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ petitDej });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: petitDej }));
      saveSubject.complete();

      // THEN
      expect(petitDejService.create).toHaveBeenCalledWith(petitDej);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PetitDej>>();
      const petitDej = { id: 123 };
      jest.spyOn(petitDejService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ petitDej });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(petitDejService.update).toHaveBeenCalledWith(petitDej);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLieuById', () => {
      it('Should return tracked Lieu primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLieuById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedUser', () => {
      it('Should return option if no User is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedUser(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected User for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedUser(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this User is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedUser(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
