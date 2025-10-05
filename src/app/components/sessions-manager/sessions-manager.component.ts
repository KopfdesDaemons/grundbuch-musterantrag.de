import { DatePipe } from '@angular/common';
import { Component, computed, ElementRef, inject, input, linkedSignal, OnInit, signal, viewChild } from '@angular/core';
import { Session } from 'common/models/session.model';
import { SessionRow } from 'src/app/interfaces/session-row';
import { PaginatedDataService } from 'src/app/services/data/paginated-data.service';
import { ErrorDisplayComponent } from '../error-display/error-display.component';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/user/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sessions-manager',
  imports: [DatePipe, ErrorDisplayComponent, ProgressSpinnerComponent, FormsModule],
  templateUrl: './sessions-manager.component.html',
  styleUrl: './sessions-manager.component.scss'
})
export class SessionsManagerComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly authS = inject(AuthService);
  private readonly router = inject(Router);

  readonly userID = input<number>();
  private paginatedDataService = new PaginatedDataService<Session>();
  protected readonly sessionsData = this.paginatedDataService.data;
  protected readonly sessions = this.paginatedDataService.items;
  protected readonly loadedPages = this.paginatedDataService.loadedPages;
  protected readonly totalPages = this.paginatedDataService.totalPages;
  protected readonly error = signal<Error | null>(null);

  readonly selectAllinput = viewChild<ElementRef>('selectAllInput');
  protected readonly selectedRows = computed<SessionRow[]>(() => this.rows().filter(row => row.isChecked()));

  private readonly rowsMap = new Map<string, SessionRow>();
  protected readonly rows = linkedSignal<Session[], SessionRow[]>({
    source: () => this.paginatedDataService.items(),
    computation: (sessions, previous) => {
      if (!sessions) {
        return previous?.value ?? [];
      }
      return sessions.map(session => {
        const refreshTokenID = session.refreshTokenID.toString();
        if (this.rowsMap.has(refreshTokenID)) {
          return this.rowsMap.get(refreshTokenID)!;
        }
        const newRow: SessionRow = {
          isChecked: signal(false),
          session: session
        };
        this.rowsMap.set(refreshTokenID, newRow);
        return newRow;
      });
    }
  });

  ngOnInit(): void {
    if (this.userID()) {
      this.paginatedDataService.init('/api/user-management/sessions', session => session.creationDate.toString(), {
        userID: this.userID()
      });
    } else {
      this.paginatedDataService.init('/api/auth/sessions', session => session.creationDate.toString(), {
        userID: this.userID()
      });
    }
  }

  scroll(element: any) {
    if (element.scrollTop > element.scrollHeight - element.clientHeight - 150) {
      if (!this.sessionsData.isLoading()) this.loadPage(this.loadedPages() + 1);
    }
  }

  private loadPage(pageNumber: number) {
    if (!this.totalPages()) return;
    if (pageNumber > this.totalPages()!) return;
    this.paginatedDataService.setPageToLoad(pageNumber);
    this.paginatedDataService.loadData();
  }

  reload() {
    this.error.set(null);
    this.paginatedDataService.resetItems();
    this.rowsMap.clear();
    this.paginatedDataService.setPageToLoad(1);
    this.paginatedDataService.loadData();
    if (this.selectAllinput()) {
      this.selectAllinput()!.nativeElement.checked = false;
    }
  }

  selectAll(value: boolean) {
    this.rows().forEach(row => row.isChecked.set(value));
  }

  async revokeSessions() {
    try {
      this.error.set(null);
      const refreshTokensIDs = this.selectedRows().map(row => row.session.refreshTokenID);
      if (this.userID()) {
        await lastValueFrom(
          this.http.patch('/api/user-management/revoke-sessions', {
            refreshTokensIDs: refreshTokensIDs,
            userID: this.userID()
          })
        );
      } else {
        await lastValueFrom(
          this.http.patch('/api/auth/revoke-sessions', {
            refreshTokensIDs: refreshTokensIDs
          })
        );
      }
      this.reload();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  async revokeAllSessions() {
    try {
      this.error.set(null);
      if (this.userID()) {
        await lastValueFrom(
          this.http.patch('/api/user-management/revoke-all-sessions', {
            userID: this.userID()
          })
        );
      } else {
        await this.authS.logoutEverywhere();
        await this.router.navigate(['/login']);
      }
      this.reload();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }
}
