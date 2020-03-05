const express = require('express');
const bodyParser = require('body-parser');

const app = express();  // handles webserver functionality

app.use(bodyParser.urlencoded({extended: true}));  // makes every route handler use bodyParser

app.get('/', (req, res) => {  //req(uest) is information sent by user to server, res(ponse) is info sent from server to user
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email">
            <input name="password" placeholder="password">
            <input name="passwordConfirmation" placeholder="password confirmation">
            <button>Sign up</button>
        </form>
    </div>
    `);
});

app.post('/', (req, res) => {  //handles POST method from the form
    console.log(req.body);
    res.send("Account created");
});

app.listen(3000, () => {  // tells express to listen for incoming requests on port 3000
    console.log('Listening');
});