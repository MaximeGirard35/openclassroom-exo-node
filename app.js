const express = require('express');

const app = express();

const mongoose = require('mongoose');

const Product = require('./models/Product');

const mongooseCO = require('./co');

mongoose.connect(mongooseCO,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use(express.json());

  app.use((req, res, next) => {
    // Ceux qui peuvent se connecter à l'API sont tout le monde (*)
    res.setHeader('Access-Control-Allow-Origin', '*');
    // On autorise les headers
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Puis les types de réponse possiblelocalhost:8080
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  // GET
  app.get('/api/products', (req, res, next) => {
    Product.find()
  .then(products => res.status(200).json({products}))
  .catch(error => res.status(400).json({ error }));
});

// GET findOne
app.get('/api/products/:id', (req, res, next) => {
  // console.log(req.params);
  Product.findOne({ _id: req.params.id })
    .then(product => res.status(200).json(product))
    .catch(error => res.status(404).json({ error }));
});

// POST
app.post('/api/products', (req, res, next) => {
  delete req.body._id;
  const product = new Product({
    ...req.body
  });
  product.save()
    .then(product => res.status(201).json({ product }))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;