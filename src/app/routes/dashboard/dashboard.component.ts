import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { faRotateRight, faCircleExclamation, faFileArrowDown, faArrowUpRightFromSquare, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  faRotateRight = faRotateRight;
  faCircleExclamation = faCircleExclamation;
  faFileArrowDown = faFileArrowDown;
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  faEllipsisVertical = faEllipsisVertical;
  infoJson: any;
  files: any[] | undefined;
  page: number = 0;

  constructor(public http: HttpClient, private elem: ElementRef) { }

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
        if (this.infoJson && this.page > this.infoJson['totalPages']) return;
        if (!this.files) this.files = [];
        const url = '/api/uploads';
        const json: any = await lastValueFrom(this.http.get(url, { params: new HttpParams().set('page', this.page) }));
        this.infoJson = json;
        console.log(this.infoJson);
        
        
        for (const file of json['files']) {
          this.files.push(file);
        }
        this.page++;
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    const dropDowns = this.elem.nativeElement.querySelectorAll('.dropDown');
    
    for (const dropdown of dropDowns) {
      const ul = dropdown.querySelector('ul');
      
      if (ul.style.visibility === 'visible') {
        if (!dropdown.contains(event.target)) {
          ul.style.visibility = 'collapse';
        }
      }
    }
  }

  click(element: any){
    const dropdown = element.closest('.dropDown') as HTMLElement;
    const ulElement = dropdown.querySelector('.dropDownMenu') as HTMLElement;
    
    if(ulElement) ulElement.style.visibility = 'visible';
  }

  async deleteFile(name: string){
    await lastValueFrom(this.http.delete('/api/uploads', {params: new HttpParams().set('name', name)}));
    this.neuLaden();
  }
}
