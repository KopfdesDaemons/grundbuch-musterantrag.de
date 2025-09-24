import { FormGroup } from '@angular/forms';
import { User } from '../models/user.model';
import { Signal } from '@angular/core';

export interface UserRow {
  isChecked: Signal<boolean>;
  user: User;
  editMode: boolean;
  editForm: FormGroup | undefined;
}
