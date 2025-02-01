import { Component } from '@angular/core';
import { AntragsanzahltimeframeComponent } from "../../../components/charts/antragsanzahltimeframe/antragsanzahltimeframe.component";
import { AntragsartenComponent } from "../../../components/charts/antragsarten/antragsarten.component";

@Component({
  selector: 'app-statistic',
  imports: [AntragsanzahltimeframeComponent, AntragsartenComponent],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent {

}
