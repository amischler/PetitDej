import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LieuService } from '../service/lieu.service';
import { ILieu, Lieu } from '../lieu.model';

import { LieuUpdateComponent } from './lieu-update.component';

describe('Lieu Management Update Component', () => {
  let comp: LieuUpdateComponent;
  let fixture: ComponentFixture<LieuUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lieuService: LieuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LieuUpdateComponent],
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
      .overrideTemplate(LieuUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LieuUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lieuService = TestBed.inject(LieuService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const lieu: ILieu = { id: 456 };

      activatedRoute.data = of({ lieu });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(lieu));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Lieu>>();
      const lieu = { id: 123 };
      jest.spyOn(lieuService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lieu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lieu }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(lieuService.update).toHaveBeenCalledWith(lieu);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Lieu>>();
      const lieu = new Lieu();
      jest.spyOn(lieuService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lieu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lieu }));
      saveSubject.complete();

      // THEN
      expect(lieuService.create).toHaveBeenCalledWith(lieu);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Lieu>>();
      const lieu = { id: 123 };
      jest.spyOn(lieuService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lieu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lieuService.update).toHaveBeenCalledWith(lieu);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
