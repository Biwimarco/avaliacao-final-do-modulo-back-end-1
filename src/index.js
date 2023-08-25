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

  const user = checkLogin(email, password, res);

  res.status(200).json({
    message: `Welcome ${user.name}!`,
    userId: user.id,
  });
});

app.post("/createMessages", (req, res) => {
  const { userId, title, description } = req.body;

  const user = findUserById(userId, res);

  const addedMessage = {
    id: uuidv4(),
    title,
    description,
    userId,
  };

  user.messages.push(addedMessage);

  res.status(201).json({
    message: `Message successfully added!`,
    addedMessage,
  });
});

app.get("/readMessages/:userId", (req, res) => {
  const { userId } = req.params;

  const user = findUserById(userId, res);

  const myMessages = user.messages.filter((message) => message.userId === userId);

  res.status(200).json({ myMessages });
});

function findUserById(userId, res) {
  const user = users.find((user) => user.id === userId);

  if (!user) {
    res.status(404).json({
      message: `User not found.`,
    })
    return null
  }
  return user
}

function checkLogin(email, password, res) {
const user = users.find((user) => user.email === email && user.password === password);

  if (!user) {
    res.status(400).json({
      message: `Incorrect email or password`,
    });
    return null
  }
  return user
}