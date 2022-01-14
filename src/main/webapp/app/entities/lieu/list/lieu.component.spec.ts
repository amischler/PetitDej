import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LieuService } from '../service/lieu.service';

import { LieuComponent } from './lieu.component';

describe('Lieu Management Component', () => {
  let comp: LieuComponent;
  let fixture: ComponentFixture<LieuComponent>;
  let service: LieuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LieuComponent],
    })
      .overrideTemplate(LieuComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LieuComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LieuService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.lieus?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
