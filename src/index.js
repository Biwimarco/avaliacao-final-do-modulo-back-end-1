import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(express.json());

app.listen(8080, () => console.log("Server on!"));

const users = [];

app.post("/createAccount", (req, res) => {
  const { name, email, password } = req.body;

  const emailRepeat = users.some((user) => user.email === email);
  if (emailRepeat) {
    return res.status(400).json({
      message: `Already existing E-mail!`,
    });
  }

  const user = {
    id: uuidv4(),
    name,
    email,
    password,
    messages: [],
  };
  users.push(user);

  return res.status(201).json({
    message: `User successfully created!`,
    user: user,
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);
  const checkPassword = users.some((user) => password === user.password);

  if (!user) {
    return res.status(400).json({
      message: `Incorrect email or password`,
    });
  }

  if (!checkPassword) {
    return res.status(400).json({
      message: `Incorrect email or password`,
    });
  }

  res.status(200).json({
    message: `Welcome ${user.name}!`,
    userId: user.id,
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
