import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPetitDej } from '../petit-dej.model';
import { PetitDejService } from '../service/petit-dej.service';

@Component({
  templateUrl: './petit-dej-delete-dialog.component.html',
})
export class PetitDejDeleteDialogComponent {
  petitDej?: IPetitDej;

  constructor(protected petitDejService: PetitDejService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.petitDejService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
