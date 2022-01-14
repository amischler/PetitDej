import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LieuComponent } from './list/lieu.component';
import { LieuDetailComponent } from './detail/lieu-detail.component';
import { LieuUpdateComponent } from './update/lieu-update.component';
import { LieuDeleteDialogComponent } from './delete/lieu-delete-dialog.component';
import { LieuRoutingModule } from './route/lieu-routing.module';

@NgModule({
  imports: [SharedModule, LieuRoutingModule],
  declarations: [LieuComponent, LieuDetailComponent, LieuUpdateComponent, LieuDeleteDialogComponent],
  entryComponents: [LieuDeleteDialogComponent],
})
export class LieuModule {}
