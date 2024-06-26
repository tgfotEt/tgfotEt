# [tgfotEt](https://tgfotet.web.app)

A website to help you (and others) prepare for exams.

This README is for explaining how the website works and how to create your own question bank and upload it so everyone else can use it!

## The Website

Currently, the website features three question types:

- Fill in the blanks
- Multiple choice (Single-select and Multi-select)
- Translation for sentences

I will be adding more features in the future, such as:

- 填充題
- Better mobile support
- and more...

## Usage

First, log in / sign up with your YPHS google account.

Go to Explore => Click on the question bank that you want to practice => Click Add to Saved.

Or, if you have already added it to your saved question banks, you can access it from the icon on the top left.

Then, you should be able to start!

Remember to save and quit to save your progress to your account.

You can also restart the progress of any Question Bank.

If you can't find the problems you want, it means that no one has created it yet. You can create one yourself!

## Creating your own Question Bank

Go to Profile => My Question Banks => Create your own question bank.

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
        },
        {
            "source":"芝加哥是一座城市。",
            "target":"Chicago is a city."
        },
        {
            "prompt":"設 x=1, y=2 。 請問：",
            "subquestions":[
                {
                    "question":"x+y=",
                    "choices":[
                        "1",
                        "2",
                        "3",
                        "4"
                    ],
                    "answer":2
                },
                {
                    "question":"x-y=",
                    "choices":[
                        "-1",
                        "-2",
                        "-3",
                        "-4"
                    ],
                    "answer":0
                }
            ]
        }
    ]
}
```

[Here](https://tgfotet.web.app/?p=qbdetail&id=ocyKeDa5SK5DvEdbAiK1) is the link to the example question bank.

There are six questions in the Question Bank above.

The first one is a single-select multiple choice problem. You must specify the question, choices, and answer (0-indexed).

The second question is a multi-select multiple choice problem. The only difference between the two multiple choice problems is that you need to give a list for the answer of the multi-select question. This also means that you can create multi-select multiple choice questions with only one correct answer.

The third question is a fill in the blanks problem. You don't need to specify where to put the blanks, the website is smart enough to deduce that.

The fourth question is a sentence translation problem. You have to specify the "source" sentence and the "target" sentence.

The fifth and sixth are both in a single question set. You have to specify the prompt and the subquestions. The subquestions can only be of type "fill in the blanks" or "multiple choice."

Tools like ChatGPT are pretty good at formatting stuff like this, so you don't even need to type the json yourself. Just paste the example above to ChatGPT, give it your set of problems, and it will format it for you.

### Important Notes:
- Your title must be between 1 and 100 characters long, inclusive.
- Your description must be between 1 and 1000 characters long, inclusive.
- The number of questions in your problem set must be between 1 and 500, inclusive.
- The total size of your json file must not exceed 100KB.
- Each question's format must follow one of the question types mentioned above.
- If any of the conditions above are not met, the website will return an error.
- Remember that everyone will be able to use your question bank after you upload it!

## Edit your Question Bank

To edit your question bank, go to your profile => Your Question Banks => Click the question bank you want to edit => Click Edit

Next, upload your updated question bank.

You don't need to specify which questions you modified / added / deleted, the website deduces that for you and updates others' progress only for the questions that are different.

## Delete your Question Bank

Currently, there is no way to delete your question bank from within the website.

If you really want it removed, just ask me and I'll remove it from the website.

## Contact

If you have found a bug, want a feature, or anything else, you can either open an issue on the tgfotEt github repository or contact at tgfotet@gmail.com

## Technical Details

This website uses the RTFM tech stack:

- React: for a dynamic single-page application
- TailwindCSS: for styling
- Firebase: for the backend
- Markdown: to write this README!

If you don't know what the above means, I would advise you to RTFM.

