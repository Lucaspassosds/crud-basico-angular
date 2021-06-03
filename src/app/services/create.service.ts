import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EventEmitter } from "events";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class CreateService {
  readonly apiURL: string;

  private currentPessoa = new BehaviorSubject('');
  sharedMessage = this.currentPessoa.asObservable();

  constructor(private http: HttpClient) {
    this.apiURL = "http://localhost:8080/api";
  }

  setPessoa(msg : string){
    this.currentPessoa.next(msg);
  }

  listar(){
    return this.http.get(`${this.apiURL}/cursos`);
  }

  atualizar(data: Object) {
    return this.http.put(`${this.apiURL}/pessoa`, data);
  }

  criar(data : Object) {
    return this.http
      .post(`${this.apiURL}/pessoa`, data)
  }
}
