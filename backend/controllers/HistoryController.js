const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
let client;

async function getClient() {
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
    }
    return client;
}

async function fetchUserHistory(userId) {
    try {
        const client = await getClient();
        const db = client.db("plant_disease_detection");
        const collection = db.collection("UserHistory");

        console.log(`Fetching history for user ID: ${userId}`);
        const data = await collection.findOne({ "_id.user_id": userId });

        if (!data) throw new Error(`No history found for user ID ${userId}`);
        console.log("dia report",data);
        return {
            username: data._id.username,
            location: data._id.location,
            diagnoses: data.diagnoses.map(diagnosis => ({
                diagnosis_date: new Date(diagnosis.diagnosis_date).toLocaleDateString(),
                disease_name: diagnosis.disease_name,
                confidence_score: diagnosis.confidence_score,
                image_url: diagnosis.image_url,
                location_detected: diagnosis.location_detected,
                reported: diagnosis.reported || false, // Include the reported status
            })),
        };
    } catch (error) {
        console.error("Error in fetchUserHistory:", error);
        throw error;
    }
}

module.exports = { fetchUserHistory };
