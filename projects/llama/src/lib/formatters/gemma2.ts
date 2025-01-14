import {
    InstructPrompt, ChatPrompt, Role, ChatMessage, PromptFormatter
} from '../prompts';

const bos = '<bos>';
const eos = '<eos>';
const startOfTurn = '<start_of_turn>';
const endOfTurn = '<end_of_turn>';
const user = 'user';
const assistant = 'model';
const newLine = '\n';

export class Gemma2Formatter implements PromptFormatter {

    public formatChat(chat: ChatPrompt): string {
        const prompt = this.createPrompt();
        if (chat.system) {
            console.warn(`Gemma2 does not support system prompt! system prompt "${chat.system}" will be treated as user prompt!`);
            this.addMessageHeader(prompt, user);
            this.addMessageContent(prompt, chat.system);
            prompt.push(newLine);
            prompt.push(newLine);
        }
        for (const message of chat.messages) {
            this.addMessage(prompt, message);
        }
        return this.checkAndReturn(prompt);
    }

    public formatInstruct(instruct: InstructPrompt): string {
        const prompt = this.createPrompt();
        if (instruct.system) {
            console.warn(`Gemma2 does not support system prompt! system prompt "${instruct.system}" will be treated as user prompt!`);
            this.addMessageHeader(prompt, user);
            this.addMessageContent(prompt, instruct.system);
            prompt.push(newLine);
            prompt.push(newLine);
        }
        this.addMessage(
            prompt,
            { role: 'user', content: instruct.instruction }
        );
        this.addMessageHeader(prompt, 'assistant');
        prompt.push(instruct.responsePrefix);
        return prompt.join('');
    }

    public stopAt(): string[] {
        return [endOfTurn, eos]
    }

    private createPrompt(): string[] {
        const prompt: string[] = [];
        prompt.push(bos);
        return prompt;
    }

    private checkAndReturn(prompt: string[]): string {
        const lastRole = this.findLastRole(prompt);
        if (lastRole === 'assistant') {
            throw new Error('Invalid prompt!');
        }
        this.addMessageHeader(prompt, 'assistant');
        return prompt.join('');
    }

    private addMessage(prompt: string[], message: ChatMessage): void {
        const lastRole = this.findLastRole(prompt);
        if (lastRole == message.role) {
            this.addMessageContent(prompt, message.content);
            this.addMessageFooter(prompt, message.role);
        }
        else {
            this.addMessageHeader(prompt, message.role);
            this.addMessageContent(prompt, message.content);
            this.addMessageFooter(prompt, message.role);
        }
    }

    private addMessageHeader(prompt: string[], role: Role): void {
        prompt.push(startOfTurn);
        switch (role) {
            case 'user':
                prompt.push(user);
                prompt.push(newLine);
                break;
            case 'assistant':
                prompt.push(assistant);
                prompt.push(newLine);
                break;
            case 'system':
                console.warn('Gemma 2 does not support system role, role "system" will be treated as role "user" !');
                prompt.push(user);
                prompt.push(newLine);
                break;
            default:
                throw new Error(`Unknown role ${role} !`);
        }
    }

    private addMessageContent(prompt: string[], content: string): void {
        prompt.push(content.trim());
    }

    private addMessageFooter(prompt: string[], role: Role): void {
        prompt.push(endOfTurn);
        prompt.push(newLine);
    }

    private findLastRole(prompt: string[]): Role | undefined {
        for (let i = prompt.length - 1; i >= 0; i--) {
            if (prompt[i] === user) {
                return 'user';
            }
            else if (prompt[i] === assistant) {
                return 'assistant';
            }
            else if (prompt[i] === 'system') {
                return 'system';
            }
        }
        return undefined;
    }
}
