const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.urlencoded({extended: true}));
app.use(express.json()); 


app.listen(5001, () => console.log('Example app listening on port 5001!'));

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
