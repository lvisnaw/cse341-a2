const express = require("express");
const app = express();
const port = 3000;


app.use('/', require('./routes'));

app.listen(process.env.PORT || port);
console.log("Web Server is listening on port " + (process.env.port || port));

// app.listen(port, () => {
//     console.log(`Running on port ${port}`);
// })