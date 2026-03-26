const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function inspect() {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    
    const idToCheck = '69c29bd16d539b47c02550bd';
    const user = await mongoose.connection.db.collection('users').findOne({ 
        _id: new mongoose.Types.ObjectId(idToCheck) 
    });
    
    if (user) {
        console.log("USER_FOUND:", user.name, user.email);
    } else {
        console.log("USER_NOT_FOUND");
    }
    
    process.exit(0);
}

inspect();
