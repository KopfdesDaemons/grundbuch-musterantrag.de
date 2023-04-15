import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { faRotateRight, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  faRotateRight = faRotateRight;
  faCircleExclamation = faCircleExclamation;
  infoJson: any;
  files: any[] | undefined;
  page: number = 0;

  constructor(public http: HttpClient) { }

  ngOnInit() {
    this.getFiles();
  }

  scroll(element: any) {
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      this.getFiles();
    }
  }

  async getFiles() {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Lade Daten...');
        this.page++;
        if (this.infoJson && this.page > this.infoJson['totalPages']) return;
        if (!this.files) this.files = [];
        const url = '/api/uploads';
        const json: any = await lastValueFrom(this.http.get(url, { params: new HttpParams().set('page', this.page) }));
        this.infoJson = json;

        for (const file of json['files']) {
          this.files.push(file);
        }
      } catch (err) {
        console.error('Die Dateien konnten nicht geladen werden.');
        console.error(err);
        reject();
      }
    });
  }

  neuLaden() {
    this.page = 0;
    this.files = [];
    this.getFiles();
  }
}
