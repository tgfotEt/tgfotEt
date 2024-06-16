# tgfotEt

A website to help you (and others) prepare for exams.
This README is for explaining how the website works and how to create your own question bank and upload it so everyone else can use it!

## The Website

Currently, the website features two question types:

- Fill in the blank
- Multiple choice (Single-select and Multi-select)

and I will be adding more types in the future, such as:

- Translation for sentences (that I promised [here](https://tgfotet.netlify.app))
- and more...

## Creating your own Question Bank

You will be uploading a json file as your Question Bank. If you aren't familiar with the json file format, you can search it up online.
Below is an example of how it should look like:
```json
{
    "title": "Your Title!",
    "description": "Your description...",
    "questions": [
        {
            "question":"Chicago is a",
            "choices":[
                "city",
                "state",
                "country",
                "continent"
            ],
            "answer": 0
        },
        {
            "question":"New York is a",
            "choices":[
                "city",
                "state",
                "country",
                "continent"
            ],
            "answer":[0, 1]
        },
        {
            "sentence":"The United States is a country."
        }
    ]
}
```
There are three questions in the Question Bank above. The first one is a single-select multiple choice problem. You must specify the question, choices, and answer (0-indexed). The second question is a multi-select multiple choice proble. The only difference between the two multiple choice problems is that you need to give a list for the answer of multi-select question. That also means that you can create multi-select multiple choice questions with only one correct answer. The third question is a fill in the blank problem. You don't need to specify where to put the blanks, the website is smart enough to deduce that.
Tools like ChatGPT are pretty good at formatting stuff like this, so you don't even need to type the json yourself. Just paste the example above to ChatGPT, give it your set of problems, and it will format it for you.
