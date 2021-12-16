const express = require("express");
const { check, validationResult } = require('express-validator');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const Restaurant = require('./models/restaurant');
const Menu = require('./models/menu');
const MenuItem = require('./models/menuItem');
const {sequelize} =require('./db'); 
const initialiseDb = require('./initialiseDb');
initialiseDb();

//SEQUELIZE-
//const {sequelize, Sauce} = require('./models');

const app = express();
const port = 3000;


// SERVE- static assets from the public/ folder
app.use(express.static('public'));

app.use(express.json())
app.use(express.urlencoded({extended:true}))
//
//CONFIGURES-  handlebars library to work well w/ Express + Sequelize model
const handlebars = expressHandlebars({
    handlebars : allowInsecurePrototypeAccess(Handlebars)
})

//ADD CODE -
//Tell this express app we're using handlebars

app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars')

const seedDb = async () => {
    
//    await sequelize.sync({ force: true });

    const restaurant = [
        {name : 'Kentucky Fried Chicken', image : '/https://c.tenor.com/ovcgHfY5OxkAAAAM/kfc-fried-chicken.gif'},
        {name : 'Raising Canes', image: '/https://www.google.com/imgres?imgurl=https%3A%2F%2Fc.tenor.com%2FHFRK8nxr3owAAAAC%2Fraising-canes-chicken-tenders.gif&imgrefurl=https%3A%2F%2Ftenor.com%2Fes%2Fver%2Fraising-canes-chicken-tenders-chicken-fingers-fast-food-raising-canes-chicken-fingers-gif-21771825&tbnid=mK9ulj9cAafJwM&vet=12ahUKEwjfrNGA7eT0AhV1ATQIHZjnDiQQMygAegQIARAY..i&docid=wyS6hlKM8MDa7M&w=498&h=278&itg=1&q=raising%20canes%20gif&ved=2ahUKEwjfrNGA7eT0AhV1ATQIHZjnDiQQMygAegQIARAY'},
        {name : 'Wendys', image: '/https://c.tenor.com/PJGYNaVduOkAAAAM/wendys.gif'}
    ]
    restaurant
    const restaurantPromises = restaurant.map(restaurant => Restaurant.create(restaurant))
    await Promise.all(restaurantPromises)
    console.log("db populated!")

}
//seedDb();
//STOP ADD CODE

const restaurantChecks = [
    check('name').not().isEmpty().trim().escape(),
    check('image').isURL(),
    check('name').isLength({ max: 50 })
]

app.get('/restaurants', async (req, res) => {
    const restaurants = await Restaurant.findAll();
    //res.json(restaurants);
    res.render('restaurants',{restaurants});

});

app.get('/restaurant-data', async (req,res) => {
    const restaurants = await Restaurant.findAll();
    res.json({restaurants})
})

app.get('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {include: {
            model: Menu,
            include: MenuItem
        }
    });
    res.render('onerestaurant',{restaurant});
});

app.get('/menu/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {include: {
            model: Menu,
            include: MenuItem
        }
    });
    res.json(restaurant)
});

app.post('/restaurants', restaurantChecks, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await Restaurant.create(req.body);
    res.sendStatus(201);
});

app.delete('/restaurants/:id', async (req, res) => {
    await Restaurant.destroy({
        where: {
            id: req.params.id
        }
    });
    res.sendStatus(200);
});

app.put('/restaurants/:id', restaurantChecks, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update(req.body);
    res.sendStatus(200);
});

app.patch('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update(req.body);
    res.sendStatus(200);
});


app.get('/new-restaurant',async(req,res)=>{
    const restaurantAlert=""
    res.render('newrestaurant',{restaurantAlert})
});

app.post('/new-restaurant',async(req,res)=>{
    const newRestaurant=await Restaurant.create(req.body)
    let restaurantAlert = `${newRestaurant.name} added to your database`
    const foundRestaurant=await Restaurant.findByPk(newRestaurant.id)
    if(foundRestaurant){
        res.render('newrestaurant',{restaurantAlert})
    }else{
        restaurantAlert='Failed to add Restaurant'
        res.render('newrestaurant',{restaurantAlert})
    }
    
    })

//DELETE method, restaurant/:id path => Deletes a restaurant from db.sqlite
app.delete('/restaurant/:id', async (req,res)=>{
    const deletedRestaurant = await Restaurant.destroy({
        where: {id:req.params.id}
    })
    const restaurant = await Restaurant.findAll();
    res.render('reataurant', {restaurant})
})
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});