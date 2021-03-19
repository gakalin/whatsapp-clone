const express = require('express');
const app = express();

require('dotenv').config();
require('./routes')(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
    console.log(`service started on port ${process.env.PORT}`);
})