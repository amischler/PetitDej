import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPetitDej } from '../petit-dej.model';

@Component({
  selector: 'jhi-petit-dej-detail',
  templateUrl: './petit-dej-detail.component.html',
})
export class PetitDejDetailComponent implements OnInit {
  petitDej: IPetitDej | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ petitDej }) => {
      this.petitDej = petitDej;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
