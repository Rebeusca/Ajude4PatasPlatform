const AlunoModel = require("../models/aluno.models");

const alunos = require("../data/alunos");

class AlunoService {
  static listar() {
    return alunos;
  }

  static criar(alunoJson) {
    const novoAluno = new AlunoModel(
      id++,
      alunoJson.nome,
      alunoJson.curso,
      alunoJson.ira
    );
    alunos.push(novoAluno);
    return novoAluno;
  }

  static recuperar(id) {
    for (let i = 0; i < alunos.length; i++) {
      if (alunos[i].id === id) {
        return alunos[i];
      }
    }
    return null;
  }

  static atualizar(id, alunoJson) {
    for (let i = 0; i < alunos.length; i++) {
      if (alunos[i].id === id) {
        alunos[i].nome = alunoJson.nome;
        alunos[i].curso = alunoJson.curso;
        alunos[i].ira = alunoJson.ira;
        return alunos[i];
      }
    }
    return null;
  }

  static apagar(id) {
    for (let i = 0; i < alunos.length; i++) {
      if (alunos[i].id === id) {
        alunos.splice(i, 1);
        return alunos;
      }
    }
    return null;
  }
}

module.exports = AlunoService;
