export type Pessoa = {
    id?: Number,
    nome: string,
    cpf: string,
    telefone: string,
    cursos?: Array<Curso>, 
    isDeleted?: boolean,
}

export type Curso = {
    id?: Number, 
    nome: string,
    pessoas?: Array<Pessoa>,
    isEditando?: boolean,
    quantidadeAlunos?: Number,
}
  