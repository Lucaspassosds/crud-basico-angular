import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Curso, Pessoa } from "../models/models";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.css"],
})
export class CreateComponent implements OnInit {
  readonly apiURL: string;
  cursos: Curso[] = [];
  cursosSelecionados: Set<Curso> = new Set();
  pessoa: Pessoa;
  pessoaForm = new FormGroup({
    nome: new FormControl(""),
    telefone: new FormControl(""),
    cpf: new FormControl(""),
  });
  nomeAntigo : string;
  aparecerMsg : boolean;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.apiURL = "http://localhost:8080/api";
    this.aparecerMsg = false;
    this.getCursos();
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.pessoa = JSON.parse(sessionStorage.getItem("pessoa_" + id));
      console.log(this.pessoa);
      this.cursosSelecionados = new Set(this.pessoa.cursos);
      this.pessoaForm.patchValue({
        nome: this.pessoa.nome,
        telefone: this.pessoa.telefone,
        cpf: this.pessoa.cpf,
        id,
      });
    }
  }

  ngOnInit() {}

  onSubmit() {
    const { nome, telefone, cpf } = this.pessoaForm.getRawValue();
    const cursosPessoa = Array.from(this.cursosSelecionados);
    this.nomeAntigo = nome;
    this.pessoaForm.reset();
    this.cursosSelecionados.clear();
    if (this.pessoa) {
      const { id } = this.pessoa;
      return this.http
        .put(`${this.apiURL}/pessoa`, {
          id,
          nome,
          telefone,
          cpf,
          cursos: cursosPessoa,
        })
        .subscribe((pessoa) => {
          console.log(pessoa);
          sessionStorage.setItem('pessoa_' + id, JSON.stringify(pessoa));
          this.aparecerMsg = true;
        });
    }
    return this.http
      .post(`${this.apiURL}/pessoa`, {
        nome,
        telefone,
        cpf,
        cursos: cursosPessoa,
      })
      .subscribe((pessoa) => {
        console.log(pessoa);
        const { id } : any = pessoa;
        sessionStorage.setItem('pessoa_' + id, JSON.stringify(pessoa));
        this.aparecerMsg = true;
      });
  }

  getCursos() {
    this.http.get(`${this.apiURL}/cursos`).subscribe((res) => {
      Object.values(res).forEach((pessoa) => this.cursos.push(pessoa));
    });
  }

  selecionarCurso(curso: Curso) {
    if (!this.cursosSelecionados.has(curso)) {
      return this.cursosSelecionados.add(curso);
    }
    return this.cursosSelecionados.delete(curso);
  }

  verificarCurso(curso : Curso) : boolean{
    return Array.from(this.cursosSelecionados).some(val => val.nome === curso.nome);
  }

  sumirMsg(){
    this.aparecerMsg = false;
  }
}
