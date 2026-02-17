import { getUserFromToken } from "../../lib/auth";

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ message: "OPENAI_API_KEY is not configured." }, { status: 500 });
    }

    const body = await request.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ message: "Missing messages." }, { status: 400 });
    }

    const user = getUserFromToken();
    const trimmed = messages
      .slice(-10)
      .map((msg) => ({
        role: msg.role,
        content: typeof msg.content === "string" ? msg.content.slice(0, 2000) : ""
      }))
      .filter((msg) => msg.content);

    const systemPrompt = `
You are the Maya Bliss Tours AI assistant.
Keep answers concise, friendly, and focused on Bhutan travel planning.
If asked about bookings, encourage using the inquiry form.
If asked about visas, seasons, or SDF, provide helpful high-level guidance.
`;

    const payload = {
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt.trim() },
        ...trimmed
      ],
      temperature: 0.6,
      user: user?.id ? String(user.id) : undefined
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenAI API error:", errorBody);
      return Response.json({ message: "AI request failed." }, { status: 500 });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "Thanks! How else can I help?";

    return Response.json({ reply }, { status: 200 });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ message: "AI request failed." }, { status: 500 });
  }
}
