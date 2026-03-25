const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function inspect() {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    
    const conversationId = '69c29bd16d539b47c02550bd';
    const conversation = await mongoose.connection.db.collection('conversations').findOne({ 
        _id: new mongoose.Types.ObjectId(conversationId) 
    });
    
    if (!conversation) {
        console.log("NOT_FOUND");
    } else {
        console.log("CONV_ID:", conversation._id.toString());
        console.log("PARTICIPANTS:", conversation.participants.map(p => p.toString()).join(", "));
    }
    
    process.exit(0);
}

inspect();
