import {
    InstructPrompt, ChatPrompt, Role, ChatMessage, PromptFormatter
} from '../prompts';

const bos = '<s>';
const system = '<|system|>';
const user = '<|user|>';
const assistant = '<|assistant|>';
const end = '<|end|>';
const newLine = '\n';

export class Phi3Formatter implements PromptFormatter {

    public formatChat(chat: ChatPrompt): string {
        const prompt = this.createPrompt();
        if (chat.system) {
            this.addMessage(prompt, { role: 'system', content: chat.system });
        }
        for (const message of chat.messages) {
            this.addMessage(prompt, message);
        }
        return this.checkAndReturn(prompt);
    }

    public formatInstruct(instruct: InstructPrompt): string {
        const prompt = this.createPrompt();
        if (instruct.system) {
            this.addMessage(
                prompt,
                { role: 'system', content: instruct.system }
            );
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
        return [end];
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
                prompt.push(system);
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
        prompt.push(end);
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
            else if (prompt[i] === system) {
                return 'system';
            }
        }
        return undefined;
    }

}
