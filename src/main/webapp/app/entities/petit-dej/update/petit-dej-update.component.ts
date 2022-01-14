import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPetitDej, PetitDej } from '../petit-dej.model';
import { PetitDejService } from '../service/petit-dej.service';
import { ILieu } from 'app/entities/lieu/lieu.model';
import { LieuService } from 'app/entities/lieu/service/lieu.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-petit-dej-update',
  templateUrl: './petit-dej-update.component.html',
})
export class PetitDejUpdateComponent implements OnInit {
  isSaving = false;

  lieusSharedCollection: ILieu[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    commentaire: [],
    lieu: [],
    organisateur: [],
    participants: [],
  });

  constructor(
    protected petitDejService: PetitDejService,
    protected lieuService: LieuService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ petitDej }) => {
      this.updateForm(petitDej);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const petitDej = this.createFromForm();
    if (petitDej.id !== undefined) {
      this.subscribeToSaveResponse(this.petitDejService.update(petitDej));
    } else {
      this.subscribeToSaveResponse(this.petitDejService.create(petitDej));
    }
  }

  trackLieuById(index: number, item: ILieu): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  getSelectedUser(option: IUser, selectedVals?: IUser[]): IUser {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPetitDej>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(petitDej: IPetitDej): void {
    this.editForm.patchValue({
      id: petitDej.id,
      date: petitDej.date,
      commentaire: petitDej.commentaire,
      lieu: petitDej.lieu,
      organisateur: petitDej.organisateur,
      participants: petitDej.participants,
    });

    this.lieusSharedCollection = this.lieuService.addLieuToCollectionIfMissing(this.lieusSharedCollection, petitDej.lieu);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
      this.usersSharedCollection,
      petitDej.organisateur,
      ...(petitDej.participants ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.lieuService
      .query()
      .pipe(map((res: HttpResponse<ILieu[]>) => res.body ?? []))
      .pipe(map((lieus: ILieu[]) => this.lieuService.addLieuToCollectionIfMissing(lieus, this.editForm.get('lieu')!.value)))
      .subscribe((lieus: ILieu[]) => (this.lieusSharedCollection = lieus));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) =>
          this.userService.addUserToCollectionIfMissing(
            users,
            this.editForm.get('organisateur')!.value,
            ...(this.editForm.get('participants')!.value ?? [])
          )
        )
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IPetitDej {
    return {
      ...new PetitDej(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      commentaire: this.editForm.get(['commentaire'])!.value,
      lieu: this.editForm.get(['lieu'])!.value,
      organisateur: this.editForm.get(['organisateur'])!.value,
      participants: this.editForm.get(['participants'])!.value,
    };
  }
}
