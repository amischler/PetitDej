import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPetitDej } from '../petit-dej/petit-dej.model';
import { PetitDejExtendedService } from './petit-dej-extended.service';
import { PetitDejComponent } from '../petit-dej/list/petit-dej.component';

@Component({
  selector: 'jhi-petit-dej',
  templateUrl: './petit-dej-extended.component.html',
})
export class PetitDejExtendedComponent extends PetitDejComponent implements OnInit {

  constructor(protected petitDejService: PetitDejExtendedService, protected modalService: NgbModal) {
    super(petitDejService, modalService);
  }

  ngOnInit(): void {
      super.ngOnInit();
  }

  switchParticipation(petitDej: IPetitDej): void {
    this.petitDejService.switchParticipation(petitDej).subscribe(() => this.loadAll());
  }

}
