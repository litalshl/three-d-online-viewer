import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LastPatientModelComponent } from './last-patient-model/last-patient-model.component';
import { ModelViewComponent } from './components/model-view/model-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LastPatientModelComponent,
    ModelViewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
