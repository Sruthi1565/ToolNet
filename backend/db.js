const mongoose=require('mongoose');
mongoURI='mongodb+srv://sru15:tool1234@cluster0.zvell.mongodb.net/toolbank?'


const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
    const fetched_data=await mongoose.connection.db.collection("");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
  }
};

module.exports = mongoDB;
