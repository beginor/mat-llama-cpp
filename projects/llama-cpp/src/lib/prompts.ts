export async function fetchPrompt<TPrompt extends Prompt>(
    url: string
): Promise<TPrompt> {
    const res = await fetch(url);
    const prompt = await res.json() as TPrompt;
    if (prompt.system?.startsWith('/')) {
        const res2 = await fetch(prompt.system);
        const text = await res2.text();
        prompt.system = text.trim();
    }
    return prompt;
}

export interface Prompt {
    system?: string;
}

export interface InstructPrompt extends Prompt {
    instruction: string;
    responsePrefix: string;
    stops: string[];
}

export interface ChatPrompt extends Prompt {
    messages: ChatMessage[];
}

export interface ChatMessage {
    role: Role;
    content: string;
    timestamp?: number;
}

export type Role = 'user' | 'assistant' | 'system';

export interface PromptFormatter {

    formatChat(chat: ChatPrompt): string;

    formatInstruct(instruct: InstructPrompt): string;

    stopAt(): string[];

}
