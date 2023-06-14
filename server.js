const express = require("express");
// const multer = require('multer')
// const fs = require('fs')
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Configuration, OpenAIApi } = require("openai");

// Creating an instance of OpenAIApi with API key from the environment variables
const openai = new OpenAIApi(
  new Configuration({
    apiKey: `${process.env.OPENAI_API_KEY}`,
  })
  // new Configuration({ apiKey: `${process.env.OPENAI_API_KEY}`})
);

const app = express();
const db = require("./config/db");
const User = require("./models/user");
require("dotenv").config();
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`, // Replace with your front-end URL
    //     origin: 'http://localhost:3000', // Replace with your front-end URL
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../client/public"));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
app.use("/user", require("./routes/users"));
app.use("/doc", require("./routes/document"));
app.use("/subscription", require("./routes/subscription"));

const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`);

app.post("/create-checkout-session", async (req, res) => {
  const { priceid, subType } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.CLIENT_URL}/users/profile?type=${subType}`,
      // cancel_url:`${process.env.CLIENT_URL}/payments}`,
      line_items: [{ price: priceid, quantity: 1 }],
      mode: "subscription",
    });

    // res.status(200).json(session);
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    // res.status(500).send('Error creating checkout session.');

    res.status(500).json({ error: error.message });
  }
});

const countWords = (text) => text.trim().split(/\s+/).length;

let scenario = `You are a helpful assistant designed to explain complex documents to users. They will provide you with long passage of text,
and you will have to simplify them and explain to them in an easy to understand language with analogies and examples (if needed).\n`;

let GPT35Turbo = async (message) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: message,
  });

  return response.data.choices[0].message.content;
};

app.post("/users", async (req, res) => {
  const { userid } = req.body;
  try {
    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userData = {
      wordsLeft: user.wordsLeft,
      subscription: user.subscriptionStatus,
      name: user.name,
      email: user.email,
    };
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error retrieving users data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//! GPT-3.5 Turbo API

app.post("/api/v1/improve", async (req, res) => {
  try {
    const { text, lang, userid } = req.body;

    const GPT35TurboMessage = [
      {
        role: "system",
        content: scenario,
      },
      {
        role: "user",
        content: `Explain this document in ${lang} language, easily: \n ${text}`,
      },
    ];

    // Validate request body
    if (!text || !lang || !userid) {
      return res.status(400).send("Missing required fields");
    }

    // Find the user by ID
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the user has words left
    if (user.wordsLeft === 0 || user.wordsLeft < 0) {
      return res
        .status(403)
        .send(
          "No words left, switch to a paid plan or upgrade your existing plan!"
        );
    }



    // GPT35Turbo(GPT35TurboMessage).then((response) => {
    //   const wordsLeft = user.wordsLeft = countWords(response)
    //   console.log(wordsLeft)
    //   if (wordsLeft < 0) {
    //     return res.status(403).send("Not enough words left");
    //   }
    //   await User.findByIdAndUpdate(userid, { $set: { wordsLeft } });
    //   return res.status(200).send(response);
    // });
    GPT35Turbo(GPT35TurboMessage).then(async (response) => {
      const wordsLeft = user.wordsLeft - countWords(response);
      console.log(wordsLeft);
      if (wordsLeft < 0) {
        return res.status(403).send("Not enough words left");
      }
      await User.findByIdAndUpdate(userid, { $set: { wordsLeft } });
      return res.status(200).send(response);
    });
    

    // Update user's word count in the database

    // return res.send("Success");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error", err);
  }
});

app.post("/api/v2", (req, res) => {
  const { text, lang } = req.body;

  const GPT35TurboMessage = [
    {
      role: "system",
      content: scenario,
    },
    {
      role: "user",
      content: `Explain this document in ${lang} language, easily: \n ${text}`,
    },
  ];

  GPT35Turbo(GPT35TurboMessage).then((response) => {
    console.log(response);
    return res.status(200).send(response);
  });
});

app.listen(PORT, function () {
  console.log(`Server Runs Perfectly at http://localhost:${PORT}`);
});
