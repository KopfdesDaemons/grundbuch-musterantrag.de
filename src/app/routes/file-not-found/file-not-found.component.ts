import { Component } from '@angular/core';
import { faWarning } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-file-not-found',
  templateUrl: './file-not-found.component.html',
  styleUrl: './file-not-found.component.scss'
})
export class FileNotFoundComponent {
  faWarning = faWarning;
}
