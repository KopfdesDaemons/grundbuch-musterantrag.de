import { Component, OnInit } from '@angular/core';
import { DesignloaderService } from 'src/app/services/designloader.service';
import { FormService } from 'src/app/services/form.service';
import { Title } from '@angular/platform-browser';
import { AntragGrundbuchausdruck } from 'src/app/models/antragGrundbuchausdruck';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Antrag } from 'src/app/interfaces/antrag';

@Component({
  selector: 'app-antragsformular',
  templateUrl: './antragsformular.component.html',
  styleUrls: ['./antragsformular.component.scss']
})
export class AntragsformularComponent implements OnInit {
  private routeParamsSubscription: Subscription | undefined;

  constructor(
    private titleService: Title,
    public fs: FormService,
    public dl: DesignloaderService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.routeParamsSubscription = this.route.params.subscribe(async (params) => {

      const antragArt: string = params['antragsart'];
      this.titleService.setTitle('Musterantrag ' + antragArt);

      let antrag: Antrag | null = null;
      switch (antragArt) {
        case 'grundbuchausdruck': {
          antrag = new AntragGrundbuchausdruck();
        }
      }
      if (antrag) this.fs.init(antrag.getFormGroup());
    })
  }

  ngOnDestroy(): void {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
  }
}
