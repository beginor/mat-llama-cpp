import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';

import { Prompt, PromptFormatter } from './prompts';
import { formatters } from './formatters';

@Injectable({
    providedIn: 'root'
})
export class PromptService {

    constructor(private http: HttpClient) { }

    public async loadPrompt<TPrompt extends Prompt>(
        url: string,
    ): Promise<TPrompt> {
        const prompt = await lastValueFrom(
            this.http.get<TPrompt>(url)
        );
        const system = prompt.system;
        if (!!system && (system.startsWith('http://') || system.startsWith('https://') || system.startsWith('/'))) {
            prompt.system = await lastValueFrom(
                this.http.get(system, { responseType: 'text' })
            );
        }
        return prompt;
    }

    public getFormatter(
        model: string
    ): FormatterInfo {
        let formatter: string;
        let isKnownModel: boolean;
        console.log(`Current model is: ${model}`);
        if (model.includes('phind-codellama')) {
            formatter = 'markdown';
            isKnownModel = true;
        }
        else if (model.includes('codellama')
            || model.includes('llama-2')
            || model.includes('llama2')
            || model.includes('mistral')
        ) {
            formatter = 'llama2';
            isKnownModel = true;
        }
        else if (model.includes('llama-3')
            || model.includes('llama3')
        ) {
            formatter = 'llama3';
            isKnownModel = true;
        }
        else if (model.includes('qwen')
            || model.includes('yi')
        ) {
            formatter = 'chatml';
            isKnownModel = true;
        }
        else if (model.includes('gemma-2')) {
            formatter = 'gemma2';
            isKnownModel = true;
        }
        else if (model.includes('phi-3')) {
            formatter = 'phi3';
            isKnownModel = true;
        }
        else {
            formatter = 'chatml';
            isKnownModel = false;
        }
        return {
            formatter: formatters[formatter],
            isKnownModel
        };
    }

}

export interface FormatterInfo {
    formatter: PromptFormatter;
    isKnownModel: boolean;
}
