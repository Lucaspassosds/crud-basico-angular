import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs/observable/of";
import { catchError } from "rxjs/operators";
import { Curso, Pessoa } from "../models/models";
import { CreateService } from "../services/create.service";
import { validaCpf, validaTelefone } from "../utils/utils";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.css"],
})
export class CreateComponent implements OnInit {
  cursos: Curso[] = [];
  cursosSelecionados: Set<Curso> = new Set();
  pessoa: Pessoa;
  pessoaForm = new FormGroup({
    nome: new FormControl(""),
    telefone: new FormControl(""),
    cpf: new FormControl(""),
  });
  nomeAntigo: string;
  aparecerMsg: boolean;

  constructor(private service: CreateService, private route: ActivatedRoute) {
    this.aparecerMsg = false;
  }

  ngOnInit() {
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

  onSubmit() {
    console.log(this.pessoaForm.getRawValue());
    const { nome, telefone, cpf } = this.pessoaForm.getRawValue();
    if (!validaTelefone(telefone)) {
      return alert("Telefone inválido!");
    }
    if (!validaCpf(cpf)) {
      return alert("CPF Inválido!");
    }
    const cursosPessoa = Array.from(this.cursosSelecionados);
    if (this.pessoa) {
      const { id } = this.pessoa;
      const data = {
        id,
        nome,
        telefone,
        cpf,
        cursos: cursosPessoa,
      };
      return this.service.atualizar(data).subscribe((pessoa) => {
        console.log(pessoa);
        sessionStorage.setItem("pessoa_" + id, JSON.stringify(pessoa));
        this.nomeAntigo = nome;
        this.aparecerMsg = true;
      });
    }
    const data = {
      nome,
      telefone,
      cpf,
      cursos: cursosPessoa,
    };
    return this.service
      .criar(data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            alert(error.error.message);
          }
          return of([]);
        })
      )
      .subscribe((pessoa) => {
        if (JSON.stringify(pessoa) === "[]") {
          return;
        }
        console.log(pessoa);
        const { id }: any = pessoa;
        sessionStorage.setItem("pessoa_" + id, JSON.stringify(pessoa));
        this.nomeAntigo = nome;
        this.pessoaForm.reset();
        this.cursosSelecionados.clear();
        this.aparecerMsg = true;
      });
  }

  getCursos() {
    this.service.listar().subscribe((res) => {
      Object.values(res).forEach((pessoa) => this.cursos.push(pessoa));
    });
  }

  selecionarCurso(curso: Curso) {
    if (!this.cursosSelecionados.has(curso)) {
      return this.cursosSelecionados.add(curso);
    }
    this.cursosSelecionados.delete(curso);
  }

  verificarCurso(curso: Curso): boolean {
    return Array.from(this.cursosSelecionados).some(
      (val) => val.nome === curso.nome
    );
  }

  sumirMsg() {
    this.aparecerMsg = false;
  }
}
