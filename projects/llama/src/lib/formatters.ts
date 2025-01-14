import { PromptFormatter } from './prompts';
import { ChatMLFormater } from './formatters/chatml';
import { Llama2Formatter } from './formatters/llama2';
import { Llama3Formatter } from './formatters/llama3';
import { MarkdownFormatter } from './formatters/markdown';
import { Gemma2Formatter } from './formatters/gemma2';
import { Phi3Formatter } from './formatters/phi3';

export const formatters: Record<string, PromptFormatter> = {
    chatml: new ChatMLFormater(),
    llama2: new Llama2Formatter(),
    llama3: new Llama3Formatter(),
    markdown: new MarkdownFormatter(),
    gemma2: new Gemma2Formatter(),
    phi3: new Phi3Formatter(),
};
