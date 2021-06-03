import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Pessoa } from "../models/models";
import { Router } from "@angular/router";
import { formataCPF, formataTelefone } from "../utils/utils";
import { IndexService } from "../services/index.service";
import { CreateService } from "../services/create.service";
import { ModalDialogService } from "ngx-modal-dialog";
import { ModalComponent } from "./modal.component";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"],
})
export class IndexComponent implements OnInit {
  pessoas: Pessoa[];
  filterPessoas: Pessoa[];
  page: number;

  constructor(
    private create: CreateService,
    private service: IndexService,
    private router: Router,
    private modalService: ModalDialogService,
    private viewRef: ViewContainerRef
  ) {
    this.page = 1;
    this.pessoas = [];
  }

  ngOnInit() {
    this.listarPessoas();
  }

  onEditarClick(pessoa: Pessoa) {
    pessoa.telefone = pessoa.telefone.replace(/\D/g, "");
    pessoa.cpf = pessoa.cpf.replace(/\D/g, "");
    this.create.setPessoa(JSON.stringify(pessoa));
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

  openDeletarDialog(pessoa: Pessoa) {
    this.modalService.openDialog(this.viewRef, {
      title: `Tem certeza de que deseja deletar a pessoa ${pessoa.nome}?`,
      childComponent: ModalComponent,
      actionButtons: [
        { text: "Cancelar" }, // no special processing here
        {
          text: "Deletar",
          onAction: () => {
            this.onDeletarClick(pessoa);
            return true;
          },
          buttonClass: "btn btn-danger",
        },
      ],
    });
  }
}
