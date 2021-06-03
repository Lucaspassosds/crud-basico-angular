import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class CreateService {
  readonly apiURL: string;

  private currentPessoa = new BehaviorSubject("");
  sharedPessoa = this.currentPessoa.asObservable();

  constructor(private http: HttpClient) {
    this.apiURL = "http://localhost:8080/api";
  }

  setPessoa(pessoaJson: string) {
    this.currentPessoa.next(pessoaJson);
  }

  listar() {
    return this.http.get(`${this.apiURL}/cursos`);
  }

  atualizar(data: Object) {
    return this.http.put(`${this.apiURL}/pessoa`, data);
  }

  criar(data: Object) {
    return this.http.post(`${this.apiURL}/pessoa`, data);
  }
}
