import express from 'express';
import { ProductManager } from './productManager.js';

// instancio la clase para crear el documento donde se guardaran los productos.
const products = new ProductManager("./src/products.json");

//incializo el modulo de express.
const app = express();

//creacion de los endpoints.
app.get('/products', async (req, res) => {
    const { limit } = req.query;

    //Traigo los productos del products.json de forma asincrónica. 
    try{
        const response = await products.getProducts();

        //condicional que determina los productos a mostrar dependiendo si hay limite o no. 
        if (limit && response.length > limit) {
            let newResponse = response.splice(0, limit);
            res.json({newResponse, "cantidad":newResponse.length});
        } else {
            res.json({response, "cantidad": response.length});
        }

    } catch{
        console.log("No se puede traer los productos.")
    }
})

app.get('/products/:pid', async (req, res) => {

    const {pid} = req.params;

    // traigo los productos del archivo json
    const response = await products.getProducts();

    //filtro el producto cuyo id es igual al id del parámetro. Hay que parsearlo porque el parámetro viene en STRING. 
    const product = await response.filter(product => product.id === parseInt(pid));

    //condicional para determinar si hay coincidencia o no de acuerdo al id pasado por parámetro. 
    if(!product || product.length === 0) {
        res.json({response: "el ID indicado no existe."})
    } else {
        res.json({product})
    }
})

//el servidor se aloja en el puerto 8080. 
app.listen(8080, () => {
    console.log("El servidor esta escuchando al puerto 8080");
})