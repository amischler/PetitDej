import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LieuDetailComponent } from './lieu-detail.component';

describe('Lieu Management Detail Component', () => {
  let comp: LieuDetailComponent;
  let fixture: ComponentFixture<LieuDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LieuDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ lieu: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LieuDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LieuDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load lieu on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.lieu).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
