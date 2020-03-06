const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();  // handles webserver functionality

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));  // makes every route handler use bodyParser
app.use(cookieSession({
    keys: ['fe12wo1ai5fwla5ke']  // used to encrypt cookies(anything random will do)
}));
app.use(authRouter);


app.listen(3000, () => {  // tells express to listen for incoming requests on port 3000
    console.log('Listening');
});