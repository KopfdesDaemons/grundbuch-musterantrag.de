import { FormGroup } from '@angular/forms';
import { WritableSignal } from '@angular/core';
import { User } from 'common/models/user.model';

export interface UserRow {
  isChecked: WritableSignal<boolean>;
  user: User;
  editMode: boolean;
  editForm: FormGroup | undefined;
}
