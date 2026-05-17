// backend/src/controllers/chat.controller.js

const processChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMsg = message.toLowerCase();
    
    let botReply = "I'm the Robu AI Assistant! I can help you find components, check shipping, or answer basic electronics questions.";

    // --- SMART LOGIC RULES (Simulating an AI knowing your store) ---
    if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery')) {
      botReply = "We offer FREE shipping on all orders above ₹499! Standard delivery takes 2-4 business days anywhere in India.";
    } 
    else if (lowerMsg.includes('arduino')) {
      botReply = "We have the original Arduino Uno R3, Mega 2560, and Nano in stock! Check the 'Arduino' category on the homepage.";
    }
    else if (lowerMsg.includes('drone') || lowerMsg.includes('pixhawk')) {
      botReply = "Building a drone? I highly recommend checking out our Orange Pixhawk 6C and the Carbon Fiber Propellers.";
    }
    else if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
      botReply = "We have a 7-day return policy for defective items. Just keep the original packaging!";
    }
    else if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
      botReply = "Hello there, Maker! What are we building today?";
    }

    /* NOTE: If you want REAL AI later, you would delete the if/else above and do this:
      const aiResponse = await axios.post('https://api.openai.com/v1/chat/completions', { ... })
      botReply = aiResponse.data.message;
    */

    // Simulate AI "typing" delay to make it feel real
    setTimeout(() => {
      res.status(200).json({ success: true, reply: botReply });
    }, 800);

  } catch (error) {
    res.status(500).json({ success: false, reply: "Oops, my circuits got crossed. Please try again later!" });
  }
};

module.exports = { processChatMessage };