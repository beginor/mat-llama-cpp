import {
    InstructPrompt, ChatPrompt, Role, ChatMessage, PromptFormatter
} from '../prompts';

const beginOfText = '<|begin_of_text|>';
const startHeaderId = '<|start_header_id|>';
const endHeaderId = '<|end_header_id|>';
const eotId = '<|eot_id|>';
const newLine = '\n';

/**
 *  Meta Llama 3 prompt formatter.
 */
export class Llama3Formatter implements PromptFormatter {

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
        return [eotId];
    }

    private createPrompt(): string[] {
        const prompt: string[] = [];
        prompt.push(beginOfText);
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
        prompt.push(startHeaderId);
        prompt.push(role);
        prompt.push(endHeaderId);
        prompt.push(newLine);
        prompt.push(newLine);
    }

    private addMessageContent(prompt: string[], content: string): void {
        prompt.push(content.trim());
    }

    private addMessageFooter(prompt: string[]): void {
        prompt.push(eotId);
        prompt.push(newLine);
    }

    private findLastRole(prompt: string[]): Role | undefined {
        let lastRoleIndex = -1;
        for (let i = prompt.length - 1; i >= 0; i--) {
            if (prompt[i] === endHeaderId) {
                lastRoleIndex = i - 1;
                break;
            }
        }
        if (lastRoleIndex == -1) {
            return undefined;
        }
        return prompt[lastRoleIndex] as Role;
    }

}
