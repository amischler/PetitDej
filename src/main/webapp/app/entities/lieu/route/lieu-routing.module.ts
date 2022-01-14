import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LieuComponent } from '../list/lieu.component';
import { LieuDetailComponent } from '../detail/lieu-detail.component';
import { LieuUpdateComponent } from '../update/lieu-update.component';
import { LieuRoutingResolveService } from './lieu-routing-resolve.service';

const lieuRoute: Routes = [
  {
    path: '',
    component: LieuComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LieuDetailComponent,
    resolve: {
      lieu: LieuRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LieuUpdateComponent,
    resolve: {
      lieu: LieuRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LieuUpdateComponent,
    resolve: {
      lieu: LieuRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lieuRoute)],
  exports: [RouterModule],
})
export class LieuRoutingModule {}
