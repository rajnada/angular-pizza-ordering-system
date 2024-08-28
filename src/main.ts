import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { OrderEntryComponent } from './order-entry/order-entry.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [OrderEntryComponent],
  template: `
    <h1>Pizza Ordering System</h1>
    <app-order-entry></app-order-entry>
  `,
})
export class App {}

bootstrapApplication(App);
