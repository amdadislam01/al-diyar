const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function inspect() {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    
    // Check for user ID 69c3a35607b36f8664654992
    const userId = '69c3a35607b36f8664654992';
    const conversations = await mongoose.connection.db.collection('conversations').find({ 
        participants: new mongoose.Types.ObjectId(userId) 
    }).toArray();
    
    if (conversations.length > 0) {
        console.log("FOUND_CONVS:", conversations.length);
        conversations.forEach(c => {
            console.log("ID:", c._id.toString(), "PARTICIPANTS:", c.participants.map(p => p.toString()).join(", "));
        });
    } else {
        console.log("NO_CONVERSATIONS_FOUND_FOR_USER");
    }
    
    process.exit(0);
}

inspect();
