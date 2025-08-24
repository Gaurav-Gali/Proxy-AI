// app/api/ollama/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();

    if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

    try {
        const response = await fetch("http://localhost:11434/v1/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "qwen2.5-coder:1.5b",
                prompt,
                temperature: 0.2,
                max_tokens: 300,
            }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Ollama API error:", error);
        return NextResponse.json({ error: "Failed to query Ollama" }, { status: 500 });
    }
}
