import { AfterViewInit, Component, inject } from '@angular/core';
import { User } from 'server/models/user';
import { UserService } from 'src/app/services/user.service';
import { faTrash, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [FaIconComponent, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements AfterViewInit {
  userS = inject(UserService);
  error: boolean = false;
  rows: { isChecked: boolean, user: User }[] = [];

  faTrash = faTrash;
  faRotateRight = faRotateRight;

  async ngAfterViewInit(): Promise<void> {
    await this.loadUsers()
  }

  async loadUsers(): Promise<void> {
    try {
      this.error = false;
      const users = await this.userS.getAllUsersJSON();
      this.rows = users.map(user => ({ isChecked: false, user: user }));
    } catch {
      this.error = true;
    }
  }

  async deleteUsers(): Promise<void> {
    const userIDs = this.rows
      .filter(row => row.isChecked)
      .map(row => row.user.userID)
      .filter((userID): userID is number => userID !== undefined);
    if (userIDs.length === 0) return;
    await this.userS.deleteUsers(userIDs);
    await this.loadUsers();
  }
}
