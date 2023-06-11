
// Load User model
const User = require("../models/user");


module.exports = {

    subscribed:  async (req, res) => {
        const { userid, subscription_type } = req.body;
      
        try {
          let wordsLeft = 0;
      
          // Set the wordsLeft based on the subscription_type
          if (subscription_type === "Basic") {
            wordsLeft = 1000;
          } else if (subscription_type === "Standard") {
            wordsLeft = 10000;
          } else if (subscription_type === "Premium") {
            wordsLeft = 15000;
          } else {
            return res.status(400).json({ error: "Invalid subscription type" });
          }
          // Update the user's subscriptionStatus and wordsLeft in the database
          const updatedUser = await User.findByIdAndUpdate(
            userid,
            { subscriptionStatus: subscription_type, wordsLeft },
            { new: true }
          );
      
          if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
          }
      
          return res.status(200).json({ message: "Subscription updated successfully" });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ error: "Internal server error" });
        }
      }

}