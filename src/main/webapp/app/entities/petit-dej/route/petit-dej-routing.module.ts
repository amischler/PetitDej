import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PetitDejComponent } from '../list/petit-dej.component';
import { PetitDejDetailComponent } from '../detail/petit-dej-detail.component';
import { PetitDejUpdateComponent } from '../update/petit-dej-update.component';
import { PetitDejRoutingResolveService } from './petit-dej-routing-resolve.service';

const petitDejRoute: Routes = [
  {
    path: '',
    component: PetitDejComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PetitDejDetailComponent,
    resolve: {
      petitDej: PetitDejRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PetitDejUpdateComponent,
    resolve: {
      petitDej: PetitDejRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PetitDejUpdateComponent,
    resolve: {
      petitDej: PetitDejRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(petitDejRoute)],
  exports: [RouterModule],
})
export class PetitDejRoutingModule {}
