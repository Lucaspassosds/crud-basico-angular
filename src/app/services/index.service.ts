import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class IndexService {
  readonly apiURL: string;
  constructor(private http: HttpClient) {
    this.apiURL = "http://localhost:8080/api";
  }

  deletar(id : Number){
    return this.http.delete(`${this.apiURL}/pessoa/${id}`)
  }

  listar(){
    return this.http.get(`${this.apiURL}/pessoas`);
  }


}
