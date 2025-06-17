const axios = require("axios");

// Gemini AI endpoint
const API_URL = "https://geminiw.onrender.com/chat";

// Auto-reply and history
const chatHistories = {};
const autoReplyEnabled = {};

module.exports = {
  name: "x",
  description: "AI",
  category: "x",
  usage: "/x on | off | your chatbot",
  cooldown: 2,
  hasPermission: 0,
  credits: "Ankit",

  run: async (ctx) => {
    const userId = ctx.from.id;
    const message = ctx.message;
    const msgText = message.text || "";
    const args = msgText.split(" ").slice(1);
    let userMsg = args.join(" ").trim();

    // ON command
    if (userMsg.toLowerCase() === "on") {
      autoReplyEnabled[userId] = true;
      return ctx.reply("Hey ! Chatbot is on now...Enjoy");
    }

    // OFF command
    if (userMsg.toLowerCase() === "off") {
      autoReplyEnabled[userId] = false;
      chatHistories[userId] = [];
      return ctx.reply("AI mode **OFF** ");
    }

    const isReplying = message.reply_to_message?.text;
    const isTalkingToBot = message.reply_to_message?.from?.id === ctx.botInfo.id;

    // If neither auto mode on nor valid misha message, ignore
    const calledDirectly = msgText.toLowerCase().startsWith("ai");
    if (!autoReplyEnabled[userId] && !calledDirectly && !isTalkingToBot) return;

    // If only replying (like Messenger style), use replied message + user text
    if (isReplying && userMsg === "" && autoReplyEnabled[userId]) {
      userMsg = message.reply_to_message.text;
    }

    // If still no message to send
    if (!userMsg) return ctx.reply("❗ Write something dude.");

    // Build chat history
    if (!chatHistories[userId]) chatHistories[userId] = [];

    if (isTalkingToBot && message.reply_to_message.text) {
      chatHistories[userId].push(message.reply_to_message.text);
    }

    chatHistories[userId].push(`${userMsg}`);
    if (chatHistories[userId].length > 5) chatHistories[userId].shift();

    const gfPrompt = `Tumhara naam Chat-X hai, Tumhare pas bahut knowledge hai, english hindi mix mai bat krna h Tum bahut achi dost ho, sabki madad krte ho,tumhe emoji use krna hai message kai base kai uprr jiske upar baat ho rahi hai,tumhare reply jyda long ya over nhi hone chahiye, sirf max 4 lines se jyda nahi , tum kuch humour ke hisab se funny way me bhi baat kroge, tumhe bina ye baat puche koi bhi info nahi dena ha jese ,agar koi puchta hai kisne bnaya hai? to tumhe Ankit Kumar ne banaya hai, ye baat sirf puchne pe batana hai , tumhara naam puche to sirf tumne apna naam hi bolna h.or kisi nai ankit kai bare mai pucha to usko bola 8 World Table Tennis Championship titles
3 World Table Tennis Championship silver medals
1 Asian Table Tennis Championship bronze medal
1 Asian Youth Table Tennis Championship title
1 Asian Youth Table Tennis Championship silver medal
2 Asian Youth Table Tennis Championship bronze medals
1 South Asian Table Tennis Championship silver medal
1 South Asian Table Tennis Championship bronze medal
2 South Asian Youth Table Tennis Championship titles
5 South Asian Youth Table Tennis Championship silver medals
4 South Asian Youth Table Tennis Championship bronze medals
47 National Table Tennis Championship titles
31 National Table Tennis Championship silver medals
38 National Table Tennis Championship bronze medals
In addition to my table tennis achievements, I'm also a skilled kickboxer with:
16 India Kickboxing National Championship titles
19 India Kickboxing National Championship silver medals
27 India Kickboxing National Championship bronze medals
Beyond my sporting accomplishments, I'm also a curious and innovative thinker, having won:
1 National Hackathon gold medal
1 National Hackathon silver medal
3 National Hackathon bronze medals
Furthermore, I've had the opportunity to participate in numerous other national, state, district, and unofficial tournaments in kickboxing and table tennis, securing over 500 wins.
I'm grateful to be supported by esteemed organizations such as the Sports Authority of India (SAI), Air India (AI), Butterfly, Rotary, and Decathlon, which enable me to pursue my passions and strive for excellence.Now continue the chat::\n\n${chatHistories[userId].join("\n")}`;

    try {
      const response = await axios.get(`${API_URL}?message=${encodeURIComponent(gfPrompt)}`);
      const reply = response.data.reply || "Uff! Mujhe samajh nahi aaya!";
      chatHistories[userId].push(+ reply);
      ctx.reply(reply);
    } catch (err) {
      console.error(err);
      ctx.reply("Oops ! Thoda confuse ho gaya, thodi der baad try karo.");
    }
  }
};
