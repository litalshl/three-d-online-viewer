import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxFileDropModule } from 'ngx-file-drop';

import { AppComponent } from './app.component';
import { ModelViewComponent } from './components/model-view/model-view.component';

@NgModule({
  declarations: [
    AppComponent,
    ModelViewComponent
  ],
  imports: [
    BrowserModule,
    NgxFileDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
