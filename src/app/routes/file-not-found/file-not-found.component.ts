import { Component } from '@angular/core';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-file-not-found',
  templateUrl: './file-not-found.component.html',
  styleUrl: './file-not-found.component.scss',
  imports: [HeaderComponent, FaIconComponent, RouterLink, FooterComponent]
})
export class FileNotFoundComponent {
  faWarning = faWarning;
}
