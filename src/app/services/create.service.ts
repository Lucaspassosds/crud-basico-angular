import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { of } from "rxjs/observable/of";
import { catchError } from "rxjs/operators";
import { Curso, Pessoa } from "../models/models";

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

  atualizar(pessoa: Pessoa) {
    return this.http.put(`${this.apiURL}/pessoa`, pessoa);
  }

  criarPessoa(pessoa: Pessoa) {
    return this.http.post(`${this.apiURL}/pessoa`, pessoa)
    .pipe(
      catchError((res: HttpErrorResponse) => {
        if (res.status === 400) {
          alert(res.error.message);
        }
        return of([]);
      })
    );
  }

  criarCurso(curso: Curso) {
    return this.http.post(`${this.apiURL}/curso`, curso)
    .pipe(
      catchError((res: HttpErrorResponse) => {
        if (res.status === 400) {
          alert(res.error.message);
        }
        return of([]);
      })
    );
  }

  atualizarCurso(curso: Curso){
    return this.http.put(`${this.apiURL}/curso`, curso);
  }
}
