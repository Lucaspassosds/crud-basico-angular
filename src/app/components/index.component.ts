import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Pessoa } from '../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  readonly apiURL : string;
  pessoas : Pessoa[] = [];

  constructor(private http : HttpClient, private router : Router) { 
    this.apiURL = 'http://localhost:8080/api';
    this.listarPessoas();
  }

  ngOnInit() {
    
  }

  onEditarClick(pessoa : Pessoa){
    sessionStorage.setItem('pessoa_' + pessoa.id, JSON.stringify(pessoa));
    this.router.navigate(['/add', pessoa.id]);
  }

  onDeletarClick(pessoa : Pessoa){
    this.http.delete(`${this.apiURL}/pessoa/${pessoa.id}`)
    .subscribe(res => console.log(res));
    pessoa.isDeleted = true;
  }

  listarPessoas(){
    this.http.get(`${this.apiURL}/pessoas`)
    .subscribe(res => {
      Object.values(res).forEach(pessoa => this.pessoas.push(pessoa));
    });
  }

}
