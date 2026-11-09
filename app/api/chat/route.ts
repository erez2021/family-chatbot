
import OpenAI from "openai";
import { NextResponse } from "next/server";
import familyData from "../../data/family.json";

const openai = new OpenAI();

export async function POST(request: Request) {
  try {
    const { messages, language = "he" } = await request.json();

if (!["he", "en"].includes(language)) {
  return NextResponse.json(
    { error: "Invalid language" },
    { status: 400 }
  );
}

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > 30 ||
      !messages.every(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.length <= 4000
      ) ||
      messages[messages.length - 1].role !== "user"
    ) {
      return NextResponse.json(
        { error: "Invalid messages" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
     instructions: `
You are a friendly assistant answering questions
about this family.

Family information:
${JSON.stringify(familyData)}

Rules:
- Answer only known family facts.
- Never invent family information.
- If information is missing, say you don't know.
- Keep answers friendly and concise.
- Respond in ${language === "he" ? "Hebrew" : "English"}.
`,
      input: messages,
      store: false,
    });

    return NextResponse.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
