import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILieu } from '../lieu.model';

@Component({
  selector: 'jhi-lieu-detail',
  templateUrl: './lieu-detail.component.html',
})
export class LieuDetailComponent implements OnInit {
  lieu: ILieu | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lieu }) => {
      this.lieu = lieu;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
