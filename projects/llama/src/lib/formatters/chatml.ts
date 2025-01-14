import {
    InstructPrompt, ChatPrompt, Role, ChatMessage, PromptFormatter
} from '../prompts';

const imStart = '<|im_start|>';
const imEnd = '<|im_end|>';
const newLine = '\n';

/**
 * Prompt formatter for ChatML
 */
export class ChatMLFormater implements PromptFormatter {

    public formatChat(chat: ChatPrompt): string {
        const prompt = this.createPrompt();
        //
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
        return [imEnd];
    }

    private createPrompt(): string[] {
        const prompt: string[] = [];
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
            this.addMessageFooter(prompt);
        }
        else {
            this.addMessageHeader(prompt, message.role);
            this.addMessageContent(prompt, message.content);
            this.addMessageFooter(prompt);
        }
    }

    private addMessageHeader(prompt: string[], role: Role): void {
        prompt.push(imStart);
        prompt.push(role);
        prompt.push(newLine);
    }

    private addMessageContent(prompt: string[], content: string): void {
        prompt.push(content.trim());
    }

    private addMessageFooter(prompt: string[]): void {
        prompt.push(imEnd);
        prompt.push(newLine);
    }

    private findLastRole(prompt: string[]): Role | undefined {
        let lastRoleIndex = -1;
        for (let i = prompt.length - 1; i >= 0; i--) {
            if (prompt[i] === imStart) {
                lastRoleIndex = i + 1;
                break;
            }
        }
        if (lastRoleIndex == -1) {
            return undefined;
        }
        return prompt[lastRoleIndex] as Role;
    }

}
