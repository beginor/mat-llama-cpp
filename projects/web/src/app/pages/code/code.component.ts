import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    InstructPrompt, ChatMessage, LlamaService, PromptService
} from 'llama-cpp';

import {
    ChatMessageListComponent
} from '../../components/chat-message-list/chat-message-list.component';
import {
    ChatInputComponent, ChatInput
} from '../../components/chat-input/chat-input.component';
import { UIState } from '../../components/ui-state';

@Component({
    selector: 'app-code',
    standalone: true,
    imports: [
        ChatMessageListComponent,
        ChatInputComponent
    ],
    templateUrl: './code.component.html',
    styleUrl: './code.component.css'
})
export class CodeComponent {

    public messages: ChatMessage[] = [];

    public answer = '';

    public state: UIState = 'idle';
    public input: ChatInput = { text: '' };

    private instPrompt!: InstructPrompt;

    constructor(
        route: ActivatedRoute,
        private llamaService: LlamaService,
        private promptService: PromptService,
    ) {
        route.params.subscribe(params => {
            const prompt = params['prompt'] as string;
            this.instPrompt = {
                system: '',
                instruction: '',
                responsePrefix: '',
                stops: [],
            };
            this.promptService.loadPrompt<InstructPrompt>(`/prompts/${prompt}.json`).then(result => {
                Object.assign(this.instPrompt, result);
                this.input.text = result.instruction;
            }).catch(ex => {
                console.error(ex);
            });
            this.messages = [];
        });
    }

    public async onInputTextChange(text: string): Promise<void> {
        this.state = 'busy';
        this.instPrompt.instruction = text;
        this.messages.push(
            { role: 'user', content: text, timestamp: Date.now() }
        );
        this.input.text = '';

        const model = this.llamaService.model;
        const { formatter } = this.promptService.getFormatter(model);
        const prompt = formatter.formatInstruct(this.instPrompt);
        const options = this.llamaService.createCompletionOptions({
            stream: true,
            prompt: prompt,
            cache_prompt: true,
            n_predict: 2048,
            temperature: 0.5,
            stop: [...this.instPrompt.stops, ...formatter.stopAt()]
        });

        const textStream = this.llamaService.streamCompletion(options);

        for await (const textPart of textStream) {
            this.answer += textPart;
        }
        const fullAnswer = this.answer;
        this.answer = '';

        const message: ChatMessage = {
            role: 'assistant',
            content: fullAnswer,
            timestamp: Date.now()
        };

        this.messages.push(message);

        this.state = 'idle';
    }

}
