import { HttpErrorResponse } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-error-display',
  imports: [FontAwesomeModule],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.scss'
})
export class ErrorDisplayComponent {
  error = input.required<HttpErrorResponse>();
  faLock = faLock;
  faCircleExclamation = faCircleExclamation
}
