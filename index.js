const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const Ajv = require('ajv');
const ajv = new Ajv();
const cors = require('cors');
var db = require('./db.json');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('This is api for my blog')
});

app.get('/posts', (req, res) => {
  res.header("Content-Type",'application/json');
  res.json(db.posts);
});

app.post('/api/posts', (req, res) => {
  //console.log(req.body);
  //res.send(req.body);
  const schema = {
    type: "object",
    properties: {
      "title": {type: "string"},
      "author": {type: "string"},
      "text": {type: "string"}
    },
    patternProperties: {
      "id": {type: "string"}
    },
    required: ["title","author","text"],
    additionalProperties: false
  };
  const validate = ajv.compile(schema);
  
  const dataToSchema = req.body;

  const valid = validate(dataToSchema);
  if (!valid){
    console.log(validate.errors);
    res.status(404).send('You send bad json schema!');
  }else{
    res.status(200).send("Post be save to database!");
    savePost();
  };

  function savePost(){
      fs.readFile('db.json', 'utf8', function readFileCallback(err, data){
        if (err){
          console.log(err);
        } else {
        db = JSON.parse(data);
        db.posts.push(req.body);
        json = JSON.stringify(db);
        fs.writeFile('db.json', json, 'utf8', function(err){
        if(err){
          console.log(err);
        }
      });
    }});
  };
  
  })

app.listen(3001, () => {
  console.log('API is ready')
})