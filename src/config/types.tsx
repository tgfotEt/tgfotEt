export type MCQ = {
    question: string;
    choices: string[];
    answer: number | number[];
};

export const isMCQ = (obj: any): boolean => {
    return obj && 'question' in obj && 'choices' in obj && 'answer' in obj &&
        typeof obj['question'] === 'string' &&
        Array.isArray(obj['choices']) &&
        obj['choices'].every((choice: any) => typeof choice === 'string') &&
        (typeof obj['answer'] === 'number' || (Array.isArray(obj['answer']) &&
        obj['answer'].every((answer: any) => typeof answer === 'number')));
};

export type FRQ = {
    question: string;
    answer: string;
};

export const isFRQ = (obj: any): boolean => {
    return obj && 'question' in obj && 'answer' in obj &&
        typeof obj['question'] === 'string' &&
        typeof obj['answer'] === 'string';
};

export type FillIn = {
    sentence: string;
};

export const isFillIn = (obj: any): boolean => {
    return obj && 'sentence' in obj && typeof obj['sentence'] === 'string';
};

export type Translate = {
    source: string;
    target: string;
};

export const isTranslate = (obj: any): boolean => {
    return obj && 'source' in obj && 'target' in obj &&
        typeof obj['source'] === 'string' &&
        typeof obj['target'] === 'string';
};

export type Mixed = {
    prompt: string;
    subquestions: [MCQ | FRQ][];
};

export const isMixed = (obj: any): boolean => {
    return obj && 'prompt' in obj && 'subquestions' in obj &&
        typeof obj['prompt'] === 'string' &&
        Array.isArray(obj['subquestions']) &&
        obj['subquestions'].every((subquestion: any) => isMCQ(subquestion) || isFRQ(subquestion));
}

export type Question = MCQ | FRQ | FillIn | Translate | Mixed;

export const isQuestion = (obj: any): boolean => {
    return isMCQ(obj) || isFRQ(obj) || isFillIn(obj) || isTranslate(obj) || isMixed(obj);
};

export type QuestionBank = {
    title: string;
    description: string;
    questions: Question[];
};

export const isQuestionBank = (obj: any): boolean => {
    return obj && 'title' in obj && 'description' in obj && 'questions' in obj &&
        typeof obj['title'] === 'string' &&
        typeof obj['description'] === 'string' &&
        obj['title'].length > 0 && obj['title'].length <= 100 &&
        obj['description'].length <= 1000 &&
        Array.isArray(obj['questions']) &&
        obj['questions'].every((question: any) => isQuestion(question)) &&
        obj['questions'].length > 0 && obj['questions'].length <= 500;
}

export type QuestionBankMetaData = {
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    authorid: string;
    authorname: string;
    downloads: number;
};

export type QuestionProgress = {
    solved: number;
    fingerprint: string;
    individualProgress?: number[];
};

export type QuestionBankProgress = {
    qbid: string;
    lastUsed: Date;
    progress: QuestionProgress[];
};

export type UserData = {
    qbp: QuestionBankProgress[];
};
