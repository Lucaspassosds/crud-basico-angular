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

  //isso aqui ficou muito feio
  listarCursos() {
    this.service
      .listar()
      .subscribe((res) =>
        Object.values(res).forEach((curso : Curso) => {
          curso.isEditando = false;
          this.service.getAlunosCurso(curso).subscribe((quantidade: number) => {
            curso.quantidadeAlunos = quantidade;
            this.cursos.push(curso);
          });
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
      .subscribe(() => {
        this.cursos.push({ nome: this.novoCursoNome });
      });
  }

  onNomeChange(e : Event){
    const { value } = e.target as HTMLInputElement;
    if (!value) return;
    this.cursoEditadoNome = value;
  }

  onConfirmarClick(id: number) {
    if(this.cursoEditadoNome === '') return alert('Preencha um nome para o curso!');
    this.service
      .atualizarCurso({ nome: this.cursoEditadoNome, id })
      .subscribe(() => {
        const curso = this.cursos.find(curso => curso.id === id);
        const index = this.cursos.indexOf(curso);
        this.cursos[index].isEditando = false;
        this.cursos[index].nome = this.cursoEditadoNome;
      });
  }
}
