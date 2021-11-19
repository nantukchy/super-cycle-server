const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId =require('mongodb').ObjectId;
const cors =require('cors');
require('dotenv').config();

const app =express()
const port =process.env.PORT || 5000;



// middleweare
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cpjqh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
	try{
		await client.connect();
		// console.log('database connected');

		const database = client.db('superCycle');
		const productsCollection =database.collection('products');
		const ordersCollection =database.collection('orders');
		const reviewCollection =database.collection('review');
		const usersCollection = database.collection('users');


		//get api
		app.get("/products", async(req, res)=>{
			const cursor = productsCollection.find({});
			const products = await cursor.toArray();
			res.send(products);
		})

		// show single product

			app.get("/products/:id", async(req, res)=>{
			const id = req.params.id;
			const query ={_id: ObjectId(id)};
			const product = await productsCollection.findOne(query);
			res.json(product);
		});


		// post api
		app.post("/products", async(req, res)=>{
			const product = req.body;
			console.log('post hitted', product)
			
			const result =await productsCollection.insertOne(product);
			console.log(result);
			res.json(result);
		});

		// add orders addOrders

		app.post("/addOrders", async(req, res)=>{
			const order = req.body;
			// console.log('order collection ok', order)
			const result =await ordersCollection.insertOne(order);
			// console.log(result);
			res.json(result);
		});

		app.get("/myOrder/:email", async(req, res)=>{
			// console.log(req.params.email;
			// const order = req.body;
			// console.log('order collection ok', order)
			const result = await ordersCollection.find({email: req.params.email}).toArray();
			// res.send(result)
			// console.log(result);
			res.json(result);
		});

		  //Delete API
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.json(result);
            console.log('delete delete de')
        });

        //delete order
         app.delete("/deleteOrder/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id)};
            const result = ordersCollection.deleteOne(query);
            res.json(result);
            console.log('delete product de')
        });



         // // post review
		app.post("/review", async(req, res)=>{
			const review = req.body;
			console.log('review', review)
			
			const result =await reviewCollection.insertOne(review);
			console.log(result);
			res.json(result);
		});
		//  show review
		app.get("/review", async(req, res)=>{
			const cursor = reviewCollection.find({});
			const review = await cursor.toArray();
			res.send(review);
		})
		 app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

   

	}
	finally{
		// await client.close();
	}
}
run().catch(console.dir);




app.get('/', (req, res)=>{
	res.send('this is super cycle server')
})
app.listen(port, ()=>{
	console.log(`this is runing server cycle port:${port}`)
})