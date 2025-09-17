import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-file-not-found',
  templateUrl: './file-not-found.component.html',
  styleUrl: './file-not-found.component.scss',
  imports: [HeaderComponent, RouterLink, FooterComponent]
})
export class FileNotFoundComponent {}
