import {
    InstructPrompt, ChatPrompt, Role, ChatMessage, PromptFormatter
} from '../prompts';

const bS = '<s>';
const bSys = '<<SYS>>';
const eSys = '<</SYS>>';
const bInst = '[INST]';
const eInst = '[/INST]';
const user = 'User: ';
const assistant = 'Assistant: ';
const newLine = '\n';
const space = ' ';

/**
 * Meta Llama 2 prompt formatter, can be used with Llama2 and codellama
 */
export class Llama2Formatter implements PromptFormatter {

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
        return [eInst];
    }

    private createPrompt(): string[] {
        const prompt: string[] = [];
        prompt.push(bS);
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
        prompt.push(bInst);
        prompt.push(space);
        switch (role) {
            case 'user':
                prompt.push(user);
                prompt.push(space);
                break;
            case 'assistant':
                prompt.push(assistant);
                prompt.push(space);
                break;
            case 'system':
                prompt.push(bSys);
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
        if (role === 'system') {
            prompt.push(newLine);
            prompt.push(eSys);
        }
        prompt.push(space);
        prompt.push(eInst);
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
            else if (prompt[i] === eSys) {
                return 'system';
            }
        }
        return undefined;
    }

}
