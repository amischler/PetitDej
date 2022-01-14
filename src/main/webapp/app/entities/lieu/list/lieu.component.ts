import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILieu } from '../lieu.model';
import { LieuService } from '../service/lieu.service';
import { LieuDeleteDialogComponent } from '../delete/lieu-delete-dialog.component';

@Component({
  selector: 'jhi-lieu',
  templateUrl: './lieu.component.html',
})
export class LieuComponent implements OnInit {
  lieus?: ILieu[];
  isLoading = false;

  constructor(protected lieuService: LieuService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.lieuService.query().subscribe({
      next: (res: HttpResponse<ILieu[]>) => {
        this.isLoading = false;
        this.lieus = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILieu): number {
    return item.id!;
  }

  delete(lieu: ILieu): void {
    const modalRef = this.modalService.open(LieuDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.lieu = lieu;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
