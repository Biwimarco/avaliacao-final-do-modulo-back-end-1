import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(express.json());

app.listen(8080, (req, res) => console.log("Server on!"));

const users = [];

// criar conta
app.post("/createAccount", (req, res) => {
  const emailRepeat = users.some((user) => user.name === body.name);
  if (emailRepeat) {
    return res.status(400).json({
      message: `Already existing E-mail!`,
    });
  }

  const { name, email, password } = req.body;

  const user = {
    id: uuidv4.v4(),
    name,
    email,
    password,
    messages: [],
  };
  users.push(user);

  return res.status(201).json({
    message: `User successfully created!`,
  });
});



// Aplicação Lista de Recados

// ● Vamos criar um back-end que contém
// as seguintes funcionalidades:
// ○ Criação de conta
// ○ Login
// ○ CRUD* de recados

// ● Dados de um usuário:
// ○ Identificador
// ○ Nome
// ○ E-mail
// ○ Senha

// O que vamos fazer?

// ● Dados de um recado:
// ○ Identificador
// ○ Título
// ○ Descrição

// Regras
// ● Não pode ter mais de um usuário
// com o mesmo e-mail

// ● O login deve ser feito com e-mail e
// senha

// ● Cada recado deve ser de um único
// usuário.
