-- CreateEnum
CREATE TYPE "Cargo" AS ENUM ('OPCAO_1', 'OPCAO_2', 'OPCAO_3', 'OPCAO_4');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turma" (
    "id" SERIAL NOT NULL,
    "nomeCurso" TEXT NOT NULL,
    "tokenAcesso" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Turma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QRCodeDia" (
    "id" SERIAL NOT NULL,
    "turmaId" INTEGER NOT NULL,
    "dataReferencia" TIMESTAMP(3) NOT NULL,
    "tokenQR" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QRCodeDia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participante" (
    "id" SERIAL NOT NULL,
    "turmaId" INTEGER NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "municipio" TEXT,
    "cargo" "Cargo",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" SERIAL NOT NULL,
    "participanteId" INTEGER,
    "facilitadorId" INTEGER,
    "turmaId" INTEGER NOT NULL,
    "dataCheckIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataReferencia" TIMESTAMP(3) NOT NULL,
    "ipAcesso" TEXT,
    "geolocalizacao" TEXT,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facilitador" (
    "id" SERIAL NOT NULL,
    "turmaId" INTEGER NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "email" TEXT,
    "whatsapp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facilitador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogAcesso" (
    "id" SERIAL NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" INTEGER NOT NULL,
    "acao" TEXT NOT NULL,
    "ipAcesso" TEXT,
    "geolocalizacao" TEXT,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogAcesso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoAlteracao" (
    "id" SERIAL NOT NULL,
    "participanteId" INTEGER NOT NULL,
    "campoAlterado" TEXT NOT NULL,
    "valorAntigo" TEXT,
    "valorNovo" TEXT,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoAlteracao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Turma_tokenAcesso_key" ON "Turma"("tokenAcesso");

-- CreateIndex
CREATE UNIQUE INDEX "QRCodeDia_dataReferencia_key" ON "QRCodeDia"("dataReferencia");

-- CreateIndex
CREATE UNIQUE INDEX "QRCodeDia_tokenQR_key" ON "QRCodeDia"("tokenQR");

-- CreateIndex
CREATE UNIQUE INDEX "QRCodeDia_turmaId_dataReferencia_key" ON "QRCodeDia"("turmaId", "dataReferencia");

-- CreateIndex
CREATE UNIQUE INDEX "CheckIn_participanteId_dataReferencia_key" ON "CheckIn"("participanteId", "dataReferencia");

-- CreateIndex
CREATE UNIQUE INDEX "CheckIn_facilitadorId_dataReferencia_key" ON "CheckIn"("facilitadorId", "dataReferencia");

-- AddForeignKey
ALTER TABLE "QRCodeDia" ADD CONSTRAINT "QRCodeDia_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participante" ADD CONSTRAINT "Participante_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "Participante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_facilitadorId_fkey" FOREIGN KEY ("facilitadorId") REFERENCES "Facilitador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facilitador" ADD CONSTRAINT "Facilitador_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoAlteracao" ADD CONSTRAINT "HistoricoAlteracao_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "Participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
