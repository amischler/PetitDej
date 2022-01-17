import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'petit-dej',
        data: { pageTitle: 'petitDejApp.petitDej.home.title' },
        loadChildren: () => import('./petit-dej-extended/petit-dej-extended.module').then(m => m.PetitDejExtendedModule),
      },
      {
        path: 'lieu',
        data: { pageTitle: 'petitDejApp.lieu.home.title' },
        loadChildren: () => import('./lieu/lieu.module').then(m => m.LieuModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
