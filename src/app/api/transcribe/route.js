import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

const geminiApiKey = process.env.GEMINI_API_KEY;


export const POST = async (req) => {
  const formData = await req.formData();
// //   console.log("🚀 ~ POST ~ formData:")
  const body = Object.fromEntries(formData);
  console.log("🚀 ~ POST ~ body:", body)
//   const keyValue = {
//     file : body
//   }
  const file = body.file || null;
// const file = formData.get("file")

  if (file) {
    //   console.log("🚀 ~ POST ~ file:", file)
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR);
    }

    fs.writeFileSync(path.resolve(UPLOAD_DIR, body.file.name), buffer);
  } else {
    return NextResponse.json({
      success: false,
    });
  }

  // process the file
  //   const data = fs.readFileSync(`${UPLOAD_DIR}/${file.name}`)
  
  const filePath = `${UPLOAD_DIR}/${file.name}`;
  
  const data = await generateAudio(filePath);
  return NextResponse.json({
      success: true,
      name: data,
    });
};

const ai = new GoogleGenAI({
  apikey: geminiApiKey,
});

async function generateAudio(filePath) {
  try {
    const image = await ai.files.upload({
      file: filePath,
    });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        createUserContent([
          "You are speech to text ai assistant you task is to simpily generate text that has been recoginized in the audio file do not add any extra text.",
          createPartFromUri(image.uri, image.mimeType),
        ]),
      ],
    });
    return response.text;
  } catch (error) {
    console.log(error);

    return "Error occured";
  }
}
