const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function inspect() {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    
    // Check the user with the known ID
    const user = await mongoose.connection.db.collection('users').findOne({ 
        _id: new mongoose.Types.ObjectId('699dce80c7adc30306c1ffa5') 
    });
    
    if (user) {
        console.log("USER_FOUND:", user.name, user.email, "ROLE:", user.role);
    } else {
        console.log("USER_NOT_FOUND");
    }

    // List all users to see if we can find the logged in user
    const users = await mongoose.connection.db.collection('users').find({}).limit(10).toArray();
    console.log("RECENT_USERS:", users.map(u => ({ id: u._id.toString(), email: u.email })));
    
    process.exit(0);
}

inspect();
