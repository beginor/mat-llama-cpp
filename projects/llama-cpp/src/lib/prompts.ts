import { CompletionOptions } from './models';

export interface ChatSession {
    options: CompletionOptions;
    systemPrompt?: string;
    userPrompt?: string;
    responsePrefix?: string;
    stops?: string[];
    history: ChatMessage[];
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
