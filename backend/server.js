const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');

const authRoutes = require('./routes/authRoutes');  

const app = express();



// =========================
// MIDDLEWARES
// =========================


app.use(express.json());
app.use(cors());


// =========================
// ROUTES
// =========================

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);



// =========================
// MONGODB CONNECTION
// =========================

mongoose.connect('mongodb+srv://cloudadmin:CloudTasks2026!@cloudtasks-app.ha004mw.mongodb.net/cloudtasks?retryWrites=true&w=majority&appName=CloudTasks-App')

.then(() => {

    console.log('MongoDB conectado correctamente');

})

.catch((error) => {

    console.log(error);

});



// =========================
// SERVER
// =========================

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Servidor ejecutándose en puerto ${PORT}`);

});