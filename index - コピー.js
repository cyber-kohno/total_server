const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.urlencoded({extended: true}));
app.use(express.json()); 


app.listen(5022, () => console.log('Example app listening on port 5022!'));

app.post('/update', (req, res) => {
  const body = req.body;
  console.log(body);
  const db = new sqlite3.Database(`${__dirname}/database/${body.databaseName}.db`);
  db.serialize(() => {
    db.run(body.sql);
    res.json({result: 'successful'});
  });
  db.close();
});

app.post('/select', (req, res) => {
  const body = req.body;
  console.log(body);
  const db = new sqlite3.Database(`${__dirname}/database/${body.databaseName}.db`);
  db.serialize(() => {
    db.all(req.body.sql, (err, rows) => {
      console.log(err);
      res.json(rows);
    });
  });
  db.close();
});

app.post('/mail', (req, res) => {
    console.log(req.body);
    const transporter = nodemailer.createTransport({
        host: '127.0.0.1',
        port: 1025
    });
    transporter.sendMail(req.body, (error, info) => {
        if (error) {
            console.log(error); // エラー情報
        } else {
            console.log(info);  // 送信したメールの情報
        }
    });
});