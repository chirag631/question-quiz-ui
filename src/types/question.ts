export interface Question {
    id: number;
    question: string;
    options: string[],
    answer: string
}
export interface Answer {
    questionId: number;
    selected: string | null
}
/* 
 {
        id: 3,
        question: 'question 3',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4',],
        answer: 'Option 3'
    },

*/