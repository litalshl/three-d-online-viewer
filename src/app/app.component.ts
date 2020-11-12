import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'three-d-online-viewer';
  filePath = 'https://cherry-online-demo.s3.us-east-2.amazonaws.com/Companies/1/Clinics/17/Patients/194/Models/662/Regions/662/Region.ply.drc';
}
