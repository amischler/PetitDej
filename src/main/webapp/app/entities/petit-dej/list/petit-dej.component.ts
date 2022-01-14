import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPetitDej } from '../petit-dej.model';
import { PetitDejService } from '../service/petit-dej.service';
import { PetitDejDeleteDialogComponent } from '../delete/petit-dej-delete-dialog.component';

@Component({
  selector: 'jhi-petit-dej',
  templateUrl: './petit-dej.component.html',
})
export class PetitDejComponent implements OnInit {
  petitDejs?: IPetitDej[];
  isLoading = false;

  constructor(protected petitDejService: PetitDejService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.petitDejService.query().subscribe({
      next: (res: HttpResponse<IPetitDej[]>) => {
        this.isLoading = false;
        this.petitDejs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPetitDej): number {
    return item.id!;
  }

  delete(petitDej: IPetitDej): void {
    const modalRef = this.modalService.open(PetitDejDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.petitDej = petitDej;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
