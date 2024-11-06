import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  isArVisible = false;  // Flag per la visibilità della scena AR

  constructor() {}

  toggleAR() {
    this.isArVisible = !this.isArVisible;  // Cambia lo stato di visibilità
  }
}
