const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://surazbissoyi:daddymaterial2003@cluster0.wjsfmfo.mongodb.net/Orders?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Form data schema
const FormDataSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    what: String,
    when: Date,
    quantity: Number,
    address: String,
    street: String,
    city: String,
    zip: String,
    status: { type: String, default: 'Pending' } // Added status field with default value 'Pending'
});

const FormData = mongoose.model('FormData', FormDataSchema);

// Endpoint to handle form submissions
app.post('/submit-form', (req, res) => {
    const formData = new FormData(req.body);

    formData.save()
        .then(() => res.status(200).send('Form Data Saved'))
        .catch(err => res.status(400).send('Error saving form data: ' + err));
});

// Endpoint to get all the form submissions
app.get('/form-data', async (req, res) => {
    try {
        const formData = await FormData.find();
        res.json(formData);
    } catch (error) {
        res.status(500).send('Error retrieving data: ' + error);
    }
});

// Endpoint to fetch orders by phone number
app.get('/orders', (req, res) => {
    const phone = req.query.phone;
  
    FormData.find({ phone: phone })
        .then(orders => res.status(200).json(orders))
        .catch(err => res.status(400).send('Error fetching orders: ' + err));
});

// Endpoint to update order details
app.put('/update-order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const updateData = req.body;

        await FormData.findByIdAndUpdate(orderId, updateData);
        res.status(200).send('Order updated successfully');
    } catch (error) {
        res.status(400).send('Error updating order: ' + error);
    }
});

app.delete('/delete-order/:id', async (req, res) => {
    try {
        await FormData.findByIdAndDelete(req.params.id);
        res.status(200).send('Order deleted successfully');
    } catch (error) {
        res.status(400).send('Error updating order: ' + error);
    } 
})

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
