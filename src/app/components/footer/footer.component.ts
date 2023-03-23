import { Component } from '@angular/core';
import { DesignloaderService } from 'src/app/services/designloader.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(public dl: DesignloaderService){}
}
