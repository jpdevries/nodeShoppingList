var express = require("express");

var Storage = function() {
  this.items = [];
  this.id = 0;
};

Storage.prototype.add = function(name) {
  var item = {name: name, id: this.id};
  this.items.push(item);
  this.id += 1;
  return item;
};

Storage.prototype.delete = function(itemID){
  var arrBack = this.items.splice((parseInt(itemID) + 1), this.items.length); //divide the items array
  this.items.pop(); //pop the value we want to delete off the end of the front half of the first array
  this.items = this.items.concat(arrBack); //glue the two arrays together sans deleted item
  for (var i=0; i<this.items.length; i++){ //reset the item ids to coincide with their index in the array
    this.items[i].id = i;
  };
  this.id = this.items.length; //set the id to the same as the length of the array so we can add/remove items
};

Storage.prototype.edit = function(id, name){
  this.items[id].name = name;
}

var storage = new Storage();
storage.add('Tomatoes');
storage.add('Parmesan');
storage.add('Peppers');

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response){
  response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response){
  if(!request.body){
    return response.sendStatus(400);
  };
  
  var item = storage.add(request.body.name);
  response.status(201).json(item);
});

app.delete('/items/:id', function(request, response){
  var id = request.params.id;
  storage.delete(id);
  response.status(201).json(id);
});

app.put('/items/:id', jsonParser, function(request, response){
  if(!request.body){
    return response.sendStatus(400);
  };
  var id = request.body.id;
  var name = request.body.name;
  storage.edit(id, name);
  response.status(200).json(id);
});



app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;