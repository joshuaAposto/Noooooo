const axios = require("axios");
const FormData = require("form-data");
const { Readable } = require("stream");

const meta = {
    name: "openai-speech",
    version: "1.0.0",
    description: `Generate speech from text with different voices and vibes.
    Available Voices: 
    - Alloy
    - Ash
    - Ballad
    - Coral
    - Echo
    - Fable
    - Onyx
    - Nova
    - Sage
    - Shimmer
    - Verse
    
    Available Vibes:
    - Santa
    - True Crime Buff
    - Old-Timey
    - Robot
    - Eternal Optimist
    - Patient Teacher
    - Calm
    - NYC Cabbie
    - Dramatic`,
    author: "joshua Apostol",
    method: "get",
    category: "ai",
    path: "/openai-speech?text=&voice=&vibe=",
};

async function onStart({ req, res }) {
    const { text, voice, vibe } = req.query;

    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    const ai = new OpenAi();

    const result = await ai.generate({
        text,
        voice,
        vibe,
    });

    if (result.status) {
        res.json({
            status: result.status,
            audio: result.audio,
        });
    } else {
        res.status(result.code).json({
            error: result.error || "Error generating audio",
        });
    }
}

class OpenAi {
    constructor() {
        this.apiBase = "https://www.openai.fm/api/generate";
        this.voices = ["Alloy", "Ash", "Ballad", "Coral", "Echo", "Fable", "Onyx", "Nova", "Sage", "Shimmer", "Verse"];
        this.vibes = ["Santa", "True Crime Buff", "Old-Timey", "Robot", "Eternal Optimist", "Patient Teacher", "Calm", "NYC Cabbie", "Dramatic"];
        this.uploadUrl = "https://i.supa.codes/api/upload";
        this.default = {
            identity: "Professional speaker",
            affect: "Authoritative and friendly",
            tone: "Professional and easy to understand",
            emotion: "Confident and inspiring",
            pronunciation: "Clearly and firmly",
            pause: "Strategic pause for emphasis"
        };
    }

    isValid(input, prompt) {
        if (!input?.trim()) return "Input cannot be empty";
        const required = Object.keys(this.default);
        const missing = required.filter(p => !prompt?.[p]);
        return missing.length ? `Prompts ${missing.join(", ")} must be filled` : null;
    }

    async uploadMedia(buffer) {
        try {
            console.log("Uploading media...");
            const formData = new FormData();
            const stream = Readable.from(buffer);
            formData.append("file", stream, { filename: "audio.wav", contentType: "audio/wav" });

            const { data } = await axios.post(this.uploadUrl, formData, {
                headers: formData.getHeaders()
            });

            return data;
        } catch (error) {
            throw error;
        }
    }

    async generate({ text, prompt = this.default, voice = this.voices[3], vibe = this.vibes[0] }) {
        const error = this.isValid(text, prompt);
        if (error) return { status: false, code: 400, error };

        if (voice && !this.voices.includes(voice)) {
            return { status: false, code: 400, error: `Invalid voice: ${this.voices.join(", ")}` };
        }
        if (vibe && !this.vibes.includes(vibe)) {
            return { status: false, code: 400, error: `Vibe is invalid: ${this.vibes.join(", ")}` };
        }

        try {
            const formData = new FormData();
            formData.append("input", text);
            formData.append("prompt", Object.entries(prompt).map(([k, v]) => `${k}: ${v}`).join("\n"));
            formData.append("voice", (voice || this.voices[3]).toLowerCase());
            formData.append("vibe", vibe || this.vibes[0]);

            const { data } = await axios.post(this.apiBase, formData, {
                responseType: "arraybuffer",
                headers: formData.getHeaders()
            });

            const url = await this.uploadMedia(data);
            return {
                status: true,
                code: 200,
                audio: url.link
            };
        } catch (e) {
            return {
                status: false,
                code: e.response?.status || 500,
                error: e.response?.data?.toString()
            };
        }
    }
}

module.exports = { meta, onStart };
