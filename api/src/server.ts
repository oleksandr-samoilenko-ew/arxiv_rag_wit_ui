import express from 'express';
import { takeNotes } from 'notes/index.ts';
import { qaOnPaper } from 'qa/index.ts';

const main = () => {
    const app = express();
    const port = process.env.PORT || 8000;

    app.use(express.json());

    app.get('/', (_req, res) => {
        res.status(200).send('ok');
    });

    app.post('/take_notes', async (req, res) => {
        const { paperUrl, name, pagesToDelete } = req.body;
        const notes = await takeNotes(paperUrl, name, pagesToDelete);
        res.status(200).send(notes);
        return;
    });

    app.post('/qa', async (req, res) => {
        const { paperUrl, question } = req.body;
        const qa = await qaOnPaper(question, paperUrl);
        res.status(200).send(qa);
        return;
    });

    app.listen(port, () => {
        console.log(`Working on ${port}`);
    });
};

main();
