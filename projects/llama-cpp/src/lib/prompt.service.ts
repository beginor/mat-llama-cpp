import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';

import { Prompt, PromptFormatter } from './prompts';
import { formatters } from "./formatters";

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
        if (model.indexOf('phind-codellama') > -1) {
            formatter = 'markdown';
            isKnownModel = true;
        }
        else if (model.indexOf('codellama') > -1
            || model.indexOf('llama-2') > -1
            || model.indexOf('llama2') > -1
            || model.indexOf('mistral') > -1
        ) {
            formatter = 'llama2';
            isKnownModel = true;
        }
        else if (model.indexOf('llama-3') > -1
            || model.indexOf('llama3') > -1
        ) {
            formatter = 'llama3';
            isKnownModel = true;
        }
        else if (model.indexOf('qwen') > -1
            || model.indexOf('yi') > -1
        ) {
            formatter = 'chatml';
            isKnownModel = true;
        }
        else if (model.indexOf('gemma-2') > -1) {
            formatter = 'gemma2';
            isKnownModel = true;
        }
        else if (model.indexOf('phi-3') > -1) {
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
