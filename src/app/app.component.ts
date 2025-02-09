import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesignloaderService } from './services/ui/designloader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  designloaderS = inject(DesignloaderService);

  async ngOnInit(): Promise<void> {
    await this.designloaderS.initDesign();
  }
}
