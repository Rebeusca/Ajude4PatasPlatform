var express = require("express");
const alunoService = require("../services/alunos.services");
var router = express.Router();

router.get("/listar", function (request, response, next) {
  response.json(alunoService.listar());
});

router.post("/criar", function (request, response, next) {
  const alunoResposta = alunoService.criar(request.body);
  response.json(alunoResposta);
});
module.exports = router;

router.get("/recuperar/:id", function (request, response, next) {
  const aluno = alunoService.recuperar(request.params.id);
  response.json(aluno);
});

router.put("/atualizar/:id", function (request, response, next) {
  const alunoAtualizado = alunoService.atualizar(
    request.params.id,
    request.body
  );
  response.json(alunoAtualizado);
});

router.delete("/apagar/:id", function (request, response, next) {
  const novoArray = alunoService.apagar(request.params.id);
  response.json(novoArray);
});
