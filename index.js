const express = require('express');

const app = express();  // handles webserver functionality

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
    req.on('data', (data) => {  // works like an event listener
        const parsed = data.toString('utf8').split('&'); //converts data from hex 
        const formData = {};
        for (let pair of parsed) {
            const [key, value] = pair.split('=');
            formData[key] = value;
        }
        console.log(formData);
    });
    res.send("Account created");
});

app.listen(3000, () => {  // tells express to listen for incoming requests on port 3000
    console.log('Listening');
});