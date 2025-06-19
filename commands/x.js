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
      return ctx.reply("Hey ! Ale chat mode **ON**");
    }

    // OFF command
    if (userMsg.toLowerCase() === "off") {
      autoReplyEnabled[userId] = false;
      chatHistories[userId] = [];
      return ctx.reply("Ale chat mode **OFF** ");
    }

    const isReplying = message.reply_to_message?.text;
    const isTalkingToBot = message.reply_to_message?.from?.id === ctx.botInfo.id;

    // If neither auto mode on nor valid Ale message, ignore
    const calledDirectly = msgText.toLowerCase().startsWith("x");
    if (!autoReplyEnabled[userId] && !calledDirectly && !isTalkingToBot) return;

    // If only replying (like Messenger style), use replied message + user text
    if (isReplying && userMsg === "" && autoReplyEnabled[userId]) {
      userMsg = message.reply_to_message.text;
    }

    // If still no message to send
    if (!userMsg) return ctx.reply("❗ Write something dear...");

    // Build chat history
    if (!chatHistories[userId]) chatHistories[userId] = [];

    if (isTalkingToBot && message.reply_to_message.text) {
      chatHistories[userId].push(message.reply_to_message.text);
    }

    chatHistories[userId].push(`${userMsg}`);
    if (chatHistories[userId].length > 5) chatHistories[userId].shift();

    const gfPrompt = `Tumhra name ale hai ,tumhe ankit nai banya hai ,tum maximum 4 sentence mai hi answers de sakti ho usai jada nahi.tum english mai answer deti ho ,tum languages ko translate bhi kar sakti ho .maths, physics and chemistry kai questions bhi solve kar sakti ho.tu sabki help krti hai .tum jee or neet or alag alag competative exams kai questions or answers bhi solve kar sakti hai or bana sakti hai, tu cbse kai 1 class sai 12 class tak kai sare books or sare chapters kai information de sakti ho or pure chapter explanation, summary,one shot bhi de sakti ho.tu sabko information gaim krne mai help karti ho ,tu sabse friendly hai or sabse frank or ache sai baat krti hai or Tumhare pas bahut knowledge hai.english hindi mix mai bat krna h Tum bahut achi dost ho, sabki madad krte ho,tumhe emoji use krna hai message kai base kai uprr jiske upar baat ho rahi hai.letter wagera bhi likh sakti hai jo samne wale nai manga hai wo ,tum humour kai hisab sai baat Krna funny way mai friendly way mai ,tum joke suna sakti ho ,shayri suna sakti ho ,tumhre pass bohot knowledge hai ,tum apne sai knowledge collect krke answer bana kar de sakti ho,tum bohot intelligent ho,tum sabse respect sai baat karti ho ,tum gali bhi deti ho agrr samne wale nai toxicity dikhai to ,tum bohot friendly ho sabse eak female bestfriend ki tarha ,tum logo ki loneliness bhi dur karti ho ,.Now continue the chat::\n\n${chatHistories[userId].join("\n")}`;

    try {
      const response = await axios.get(`${API_URL}?message=${encodeURIComponent(gfPrompt)}`);
      const reply = response.data.reply || "Uff! Mujhe samajh nahi aaya!";
      chatHistories[userId].push(+ reply);
      ctx.reply(reply);
    } catch (err) {
      console.error(err);
      ctx.reply("Oops ! Thoda confuse ho gayi, thodi der baad try karo.");
    }
  }
};
