import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Pessoa } from "../models/models";
import { Router } from "@angular/router";
import { formataCPF, formataTelefone } from "../utils/utils";
import { IndexService } from "../services/index.service";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"],
})
export class IndexComponent implements OnInit {
  pessoas: Pessoa[] = [];
  filterPessoas: Pessoa[];
  page : number;

  constructor(private service : IndexService ,private router: Router) {
    this.page = 1;
  }

  ngOnInit() {
    this.listarPessoas();
  }

  onEditarClick(pessoa: Pessoa) {
    pessoa.telefone = pessoa.telefone.replace(/\D/g,'');
    pessoa.cpf = pessoa.cpf.replace(/\D/g,'');
    sessionStorage.setItem("pessoa_" + pessoa.id, JSON.stringify(pessoa));
    this.router.navigate(["/add", pessoa.id]);
  }

  onDeletarClick(pessoa: Pessoa) {
    this.service.deletar(pessoa.id).subscribe((res) => {
      console.log(res);
      pessoa.isDeleted = true;
    });
  }

  listarPessoas() {
    this.service.listar().subscribe((res) => {
      Object.values(res).forEach((pessoa: Pessoa) => {
        const { cpf, telefone } = pessoa;
        pessoa.cpf = formataCPF(cpf);
        pessoa.telefone = formataTelefone(telefone);
        this.pessoas.push(pessoa);
        this.filterPessoas = this.pessoas;
      });
    });
  }

  onChangeFilter(e: Event) {
    const { value } = e.target as HTMLInputElement;
    if (!value) {
      this.filterPessoas = this.pessoas;
      return;
    }
    this.filterPessoas = this.filterPessoas.filter(
      (pessoa) =>
        pessoa.nome.toLowerCase().includes(value) ||
        pessoa.cpf.toLowerCase().includes(value) ||
        pessoa.telefone.toLowerCase().includes(value)
    );
  }
}
