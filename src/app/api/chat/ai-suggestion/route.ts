import connectDb from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { messages, role } = await req.json();

        const lastMessageText = messages?.text || "Hello";

        const prompt = `
You are a professional delivery assistant chatbot.

Role: "${role}"
Last message: "${lastMessageText}"

Your task:
- If role is "user", generate 3 short WhatsApp-style reply suggestions that a user could send to the delivery boy.
- If role is "delivery-boy", generate 3 short WhatsApp-style reply suggestions that a delivery boy could send to the user.

Follow these strict rules:
- Replies must match the context of the last message.
- Keep replies short and human-like (maximum 10 words).
- Use emojis naturally (maximum one emoji per reply).
- No generic replies like "Okay" or "Thank you".
- Replies must be helpful, respectful, and related to delivery, status, help, or location.
- No numbering.
- No explanations.
- No extra text.

Output format:
Return exactly three comma-separated reply suggestions.
`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        })

        const data = await response.json();
        console.log("Gemini response:", JSON.stringify(data));

        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            return NextResponse.json({ suggestions: ["On my way! 🚗", "Almost there! 📍", "Need any help? 🤝"] }, { status: 200 });
        }

        const replyText = data.candidates[0].content.parts[0].text || ""
        const suggestions = replyText.split(",").map((line: string) => line.trim()).filter(Boolean)
        return NextResponse.json({ suggestions }, { status: 200 });

    } catch (error) {
        console.error("AI suggestion error:", error);
        return NextResponse.json({ suggestions: ["On my way! 🚗", "Almost there! 📍", "Need any help? 🤝"] }, { status: 200 });
    }
}