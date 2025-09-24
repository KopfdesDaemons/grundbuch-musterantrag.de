import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-error-display',
  imports: [],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.scss'
})
export class ErrorDisplayComponent {
  error = input.required<Error | undefined | HttpErrorResponse>();
  httpError = computed<HttpErrorResponse | null>(() => {
    console.log(this.error());
    if (this.error() instanceof HttpErrorResponse) return this.error() as HttpErrorResponse;
    else return null;
  });
}
