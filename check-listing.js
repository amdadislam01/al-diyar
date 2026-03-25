const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function inspect() {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    
    const idToCheck = '69c29bd16d539b47c02550bd';
    const listing = await mongoose.connection.db.collection('listings').findOne({ 
        _id: new mongoose.Types.ObjectId(idToCheck) 
    });
    
    if (listing) {
        console.log("LISTING_FOUND:", listing.title, "BY:", listing.listedBy);
    } else {
        console.log("LISTING_NOT_FOUND");
    }
    
    process.exit(0);
}

inspect();
