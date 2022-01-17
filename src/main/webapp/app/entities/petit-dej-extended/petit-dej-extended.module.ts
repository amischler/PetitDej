import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PetitDejComponent } from '../petit-dej/list/petit-dej.component';
import { PetitDejExtendedComponent } from './petit-dej-extended.component';
import { PetitDejDetailComponent } from '../petit-dej/detail/petit-dej-detail.component';
import { PetitDejUpdateComponent } from '../petit-dej/update/petit-dej-update.component';
import { PetitDejDeleteDialogComponent } from '../petit-dej/delete/petit-dej-delete-dialog.component';
import { PetitDejExtendedRoutingModule } from './petit-dej-extended-routing.module';

@NgModule({
  imports: [SharedModule, PetitDejExtendedRoutingModule],
  declarations: [PetitDejComponent, PetitDejExtendedComponent, PetitDejDetailComponent, PetitDejUpdateComponent, PetitDejDeleteDialogComponent],
  entryComponents: [PetitDejDeleteDialogComponent],
})
export class PetitDejExtendedModule {}
