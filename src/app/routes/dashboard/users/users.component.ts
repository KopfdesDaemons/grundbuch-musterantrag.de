import { AfterViewInit, Component, inject } from '@angular/core';
import { User } from 'server/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements AfterViewInit {
  userS = inject(UserService);
  users: User[] = [];
  error: boolean = false;

  async ngAfterViewInit(): Promise<void> {
    await this.loadUsers()
    console.log(this.users);
  }

  async loadUsers(): Promise<void> {
    try {
      this.error = false;
      this.users = await this.userS.getAllUsersJSON();
    } catch {
      this.error = true;
    }
  }
}
