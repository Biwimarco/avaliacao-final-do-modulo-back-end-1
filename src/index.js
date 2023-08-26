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

  return !name || !email || !password
    ? res.status(400).json({ message: `Fill in the requested fields!` })
    : (() => {
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
      })();
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

  confirmMessages(userId, title, description, res);
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

  const myMessages = user.messages.filter(
    (message) => message.userId === userId
  );

  res.status(200).json({ myMessages });
});

app.put("/updateMessages/:messageId", (req, res) => {
  const { messageId } = req.params;
  const { userId, title, description } = req.body;

  confirmMessages(userId, title, description, res);
  const user = findUserById(userId, res);
  const findMsgIndex = findMessageIndex(user, messageId, res)

  user.messages[findMsgIndex].title = title;
  user.messages[findMsgIndex].description = description;

  res.status(200).json({
    message: `Updated message!`,
  });
});

app.delete("/deleteMessages/:messageId", (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.body;

  const user = findUserById(userId, res);

  const messageToDelete = user.messages.find((message) => message.id === messageId);

  if (!messageToDelete) {
    res.status(404).json({
      message: `Message not found!`,
    })
    return 
  }

  user.messages = user.messages.filter((message) => message.id !== messageId)

  res.status(200).json({
    message: "Message deleted successfully!",
    deletedMessage: messageToDelete
  })  
})

function findUserById(userId, res) {
  const user = users.find((user) => user.id === userId);

  if (!user) {
    res.status(404).json({
      message: `User not found!`,
    });
    return null;
  }
  return user;
}

function checkLogin(email, password, res) {
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    res.status(400).json({
      message: `Incorrect email or password!`,
    });
    return null;
  }
  return user;
}

function confirmMessages(userId, title, description, res) {
  if (!userId || !title || !description) {
    res.status(400).json({
      message: `Fill in the requested fields!`,
    });
    return null;
  }
}

function findMessageIndex(user, messageId, res) {
  const messageIndex = user.messages.findIndex(
    (message) => message.id === messageId
  );

  if (messageIndex === -1) {
     res.status(404).json({
      message: `Message not found!`,
    });
    return null;
  }
  return messageIndex
}