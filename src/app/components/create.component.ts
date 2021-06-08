import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
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
export class CreateComponent implements OnInit, OnDestroy {
  cursos: Curso[];
  cursosSelecionados: Set<Curso>;
  pessoa: Pessoa;
  pessoaForm : FormGroup;
  nomeAntigo: string;
  aparecerMsg: boolean;
  message: string;
  pessoaSubscription: Subscription;

  constructor(private service: CreateService, private route: ActivatedRoute) {
    this.aparecerMsg = false;
    this.cursos = [];
    this.cursosSelecionados  = new Set();
    this.pessoaForm = new FormGroup({
      nome: new FormControl("", Validators.required),
      telefone: new FormControl("", [Validators.required, this.verificarTel.bind(this)]),
      cpf: new FormControl("", [Validators.required, this.verificarCpf.bind(this)]),
    });
  }

  ngOnInit() {
    this.getCursos();
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.pessoaSubscription = this.service.sharedPessoa.subscribe(
        (pessoa) => (this.pessoa = JSON.parse(pessoa))
      );
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
  ngOnDestroy() {
    if(this.pessoaSubscription)
    this.pessoaSubscription.unsubscribe();
  }

  onSubmit() {
    console.log(this.pessoaForm.getRawValue());
    const { nome, telefone, cpf } = this.pessoaForm.getRawValue();
    if(nome == '' || telefone == '' || cpf == '') return;
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
          console.log('');
          return;
        }
        console.log(pessoa);
        const { id }: any = pessoa;
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

  verificarCpf(control : FormControl) : {[validacao : string] : boolean}{
    if(control.value && !validaCpf(control.value)){
      return {'cpfInvalido' : true};
    }
    return null;
  }
  verificarTel(control : FormControl) : {[validacao : string] : boolean}{
    if(control.value && !validaTelefone(control.value)){
      return {'telInvalido' : true};
    }
    return null;
  }
}
