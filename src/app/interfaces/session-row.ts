import { WritableSignal } from '@angular/core';
import { Session } from 'common/models/session.model';

export interface SessionRow {
  isChecked: WritableSignal<boolean>;
  session: Session;
}
