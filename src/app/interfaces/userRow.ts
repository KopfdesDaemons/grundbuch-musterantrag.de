import { FormGroup } from '@angular/forms';
import { User } from '../models/user.model';

export interface UserRow {
  isChecked: boolean;
  user: User;
  editMode: boolean;
  editForm: FormGroup | undefined;
}
