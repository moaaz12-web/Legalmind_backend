const { Configuration, OpenAIApi } = require("openai");
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;
const express = require("express");
const cors = require("cors");
const app = express();
require("./config/db");
app.use(express.json());
app.use(cookieParser());
require("./models/user");
require("dotenv").config();
app.use("/user", require("./routes/users"));
app.use("/doc", require("./routes/document"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../client/public"));
app.use("/subscription", require("./routes/subscription"));
app.use(cors({origin: 'http://localhost:3000',methods: "GET,POST,PUT,DELETE,OPTIONS", credentials: true}));


let GPT35Turbo = async (message) => {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: message,
    });
    return response.data.choices[0].message.content;
};



//! GPT-3.5 Turbo AP
app.post("/api/v1/improve", (req, res) => {
  const { text, lang, userid } = req.body;
  const GPT35TurboMessage = [{
    role: "system",  
    content: `You are a helpful assistant designed to explain complex documents to users. They will provide you with long passage of text, 
       and you will have to simplify them and explain to them in an easy to understand language with analogies and examples (if needed).\n Explain this document in ${lang} language, easily: \n ${text}`,
}];
    // GPT35Turbo(GPT35TurboMessage).then((response) => {
    //     console.log(response);
    //     return res.send("IMPROVED TEXT");
    //   }).catch((err) => {
    //     console.log(err);
    //     return res.send("ERROR");
    //   });

    res.send("BACKEND RESP")
  });

app.listen(PORT, function () {
    console.log(`Server Runs Perfectly at http://localhost:${PORT}`);
});
