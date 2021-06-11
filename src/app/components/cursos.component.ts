import { Component, OnInit } from "@angular/core";
import { Curso } from "../models/models";
import { CreateService } from "../services/create.service";

@Component({
  selector: "app-cursos",
  templateUrl: "./cursos.component.html",
  styleUrls: ["./cursos.component.css"],
})
export class CursosComponent implements OnInit {
  cursos: Curso[];
  page: number;
  novoCursoNome : string;
  cursoEditadoNome : string;

  constructor(private service: CreateService) {
    this.cursos = [];
    this.page = 1;
    this.cursoEditadoNome = '';
  }

  ngOnInit() {
    this.listarCursos();
  }

  listarCursos() {
    this.service
      .listar()
      .subscribe((res) =>
        Object.values(res).forEach((curso : Curso) => {
          curso.isEditando = false;
          this.cursos.push(curso);
        })
      );
  }

  onNovoCursoNomeChange(e : Event){
    const { value } = e.target as HTMLInputElement;
    if (!value) return;
    this.novoCursoNome = value;
  }

  onAddCurso() {
    this.service
      .criarCurso({ nome: this.novoCursoNome })
      .subscribe((res) => {
        this.cursos.push({ nome: this.novoCursoNome });
      });
  }

  onEditarClick(cursoIndex : number) {
    this.cursos[cursoIndex].isEditando = true;
  }

  onCancelarClick(cursoIndex : number) {
    this.cursos[cursoIndex].isEditando = false;
  }

  onNomeChange(e : Event){
    const { value } = e.target as HTMLInputElement;
    if (!value) return;
    this.cursoEditadoNome = value;
  }

  onConfirmarClick(id: number, cursoIndex : number) {
    this.service
      .atualizarCurso({ nome: this.cursoEditadoNome, id })
      .subscribe((res) => {
        console.log(res);
        this.cursos[cursoIndex].isEditando = false;
        this.cursos[cursoIndex].nome = this.cursoEditadoNome;
      });
  }
}
