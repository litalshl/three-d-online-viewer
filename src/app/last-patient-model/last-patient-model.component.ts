import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'last-patient-model',
  templateUrl: './last-patient-model.component.html',
  styleUrls: ['./last-patient-model.component.scss']
})
export class LastPatientModelComponent implements OnInit {

  constructor() {
   }

  async ngOnInit(): Promise<any> {    
  
      console.log('last-model called'); 
                  
  }

}
