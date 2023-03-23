import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  faSortDown,
  faBars
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-artikelsidebar',
  templateUrl: './artikelsidebar.component.html',
  styleUrls: ['./artikelsidebar.component.scss']
})
export class ArtikelsidebarComponent{
  @ViewChild('sidebar') sidebar!:ElementRef;
  @ViewChild('sidebarbutton') sidebarbutton!:ElementRef;
  @ViewChild('closingdiv') closingdiv!:ElementRef;
  faSortDown = faSortDown;
  faBars = faBars;

  constructor(public router: Router){}

  dropdown(event: Event): void {
    var element = event.target as Element;
    element.closest(".thema")!.classList.toggle("themaangeklickt");
  }

  open(){
    this.sidebar.nativeElement.classList.add("sidebaroffen");
    this.sidebarbutton.nativeElement.style.display = "none";
    this.closingdiv.nativeElement.style.display = "block";
  }

  close(){
    this.sidebar.nativeElement.classList.remove("sidebaroffen");
    this.sidebarbutton.nativeElement.style.display = "flex";
    this.closingdiv.nativeElement.style.display = "none";
  }
}
