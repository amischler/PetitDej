import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PetitDejComponent } from './list/petit-dej.component';
import { PetitDejDetailComponent } from './detail/petit-dej-detail.component';
import { PetitDejUpdateComponent } from './update/petit-dej-update.component';
import { PetitDejDeleteDialogComponent } from './delete/petit-dej-delete-dialog.component';
import { PetitDejRoutingModule } from './route/petit-dej-routing.module';

@NgModule({
  imports: [SharedModule, PetitDejRoutingModule],
  declarations: [PetitDejComponent, PetitDejDetailComponent, PetitDejUpdateComponent, PetitDejDeleteDialogComponent],
  entryComponents: [PetitDejDeleteDialogComponent],
})
export class PetitDejModule {}
