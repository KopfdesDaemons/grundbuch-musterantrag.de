import { HttpErrorResponse } from '@angular/common/http';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-display',
  imports: [],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.scss'
})
export class ErrorDisplayComponent {
  error = input.required<HttpErrorResponse>();
}
