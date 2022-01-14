import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILieu } from '../lieu.model';
import { LieuService } from '../service/lieu.service';

@Component({
  templateUrl: './lieu-delete-dialog.component.html',
})
export class LieuDeleteDialogComponent {
  lieu?: ILieu;

  constructor(protected lieuService: LieuService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lieuService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
