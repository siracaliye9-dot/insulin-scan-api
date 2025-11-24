import express from "express";
import multer from "multer";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
const upload = multer();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    const imgBuffer = req.file.buffer;

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Bu qida etiketini oxu və 100 q KH dəyərini yaz." },
            { type: "image", image: imgBuffer }
          ]
        }
      ]
    });

    res.json({ answer: result.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.json({ answer: "Səhv baş verdi. Server cavab vermədi." });
  }
});

app.listen(3000, () => console.log("Server 3000 portunda işə düşdü"));
