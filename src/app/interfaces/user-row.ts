import { FormGroup } from '@angular/forms';
import { User } from '../models/user.model';
import { WritableSignal } from '@angular/core';

export interface UserRow {
  isChecked: WritableSignal<boolean>;
  user: User;
  editMode: boolean;
  editForm: FormGroup | undefined;
}
