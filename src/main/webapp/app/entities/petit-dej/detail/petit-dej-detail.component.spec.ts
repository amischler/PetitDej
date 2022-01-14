import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PetitDejDetailComponent } from './petit-dej-detail.component';

describe('PetitDej Management Detail Component', () => {
  let comp: PetitDejDetailComponent;
  let fixture: ComponentFixture<PetitDejDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetitDejDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ petitDej: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PetitDejDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PetitDejDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load petitDej on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.petitDej).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
