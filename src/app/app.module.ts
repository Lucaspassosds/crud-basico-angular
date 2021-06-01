import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { IndexComponent } from './components/index.component';
import { CreateComponent } from './components/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { IndexService } from './services/index.service';
import { CreateService } from './services/create.service';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    CreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    IndexService,
    CreateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
