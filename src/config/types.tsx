export type MCQ = {
    question: string;
    choices: string[];
    answer: number | number[];
}

export type FRQ = {
    question: string;
    answer: string;
}

export type FillIn = {
    sentence: string;
}

export type Translate = {
    source: string;
    target: string;
}

export type Mixed = {
    prompt: string;
    subquestions: [MCQ | FRQ][];
}

export type Question = MCQ | FRQ | FillIn | Translate | Mixed;

export type QuestionBank = Question[];

export type QuestionBankInfo = {
    title: string;
    description: string;
    qbid: string;
    fingerprint: string;
}

export type QuestionProgress = {
    solved: number;
    fingerprint: string;
}

export type QuestionBankProgress = {
    qbid: string;
    progress: QuestionProgress[];
}
