import { Component, OnInit } from '@angular/core';
import { DesignloaderService } from 'src/app/services/designloader.service';
import { FormService } from 'src/app/services/form.service';
import { Title } from '@angular/platform-browser';
import { AntragGrundbuchausdruck } from 'src/app/models/antragGrundbuchausdruck';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragNamensberichtigung } from 'src/app/models/antragNamensberichtigung';
import { AntragGrundbuchberichtigungSterbefall } from 'src/app/models/antragGrundbuchberichtigungSterbefall';
import { AntragLoesschungAbt2 } from 'src/app/models/antragLoeschungAbt2';
import { AntragAbschriftBewilligung } from 'src/app/models/antragAbschriftBewilligung';

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
      this.titleService.setTitle('Musterantrag ' + this.capitalizeFirstLetter(antragArt));

      let antrag: Antrag | null = null;
      switch (antragArt) {
        case 'grundbuchausdruck': {
          antrag = new AntragGrundbuchausdruck();
          break;
        }
        case 'namensberichtigung': {
          antrag = new AntragNamensberichtigung();
          break;
        }
        case 'grundbuchberichtigung-sterbefall': {
          antrag = new AntragGrundbuchberichtigungSterbefall();
          break;
        }
        case 'loeschung-abteilung2': {
          antrag = new AntragLoesschungAbt2();
          break
        }
        case 'abschrift-bewilligung': {
          antrag = new AntragAbschriftBewilligung();
          break
        }
      }
      if (antrag) this.fs.init(antrag);
    })
  }

  ngOnDestroy(): void {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
