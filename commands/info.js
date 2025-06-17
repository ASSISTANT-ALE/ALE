const axios = require("axios");
const fs = require("fs");
const https = require("https");
const path = require("path");

module.exports = {
  name: "info",
  description: "Admin and Bot Information",
  category: "info",
  usage: "/inf",
  cooldown: 2,
  hasPermission: 0,
  credits: "Ankit Kumar",

  run: async (ctx) => {
    const botName = "Chat-X"; // Replace if dynamic
    const prefix = "/";
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const moment = require("moment-timezone");
    const timeNow = moment.tz("Asia/Kolkata").format("『D/MM/YYYY』 【HH:mm:ss】");

    const imageLinks = [
      "https://i.ibb.co/N2TPwKNF/image.jpg"
    ];
    const selectedImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];

    const caption = `🌹𝙰𝙳𝙼𝙸𝙽 𝙰𝙽𝙳 𝙱𝙾𝚃 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽 🇮🇳

☄️𝗕𝗢𝗧 𝗡𝗔𝗠𝗘☄️ ⚔ ${botName} ⚔

𝗢𝗪𝗡𝗘𝗥 ☞︎︎︎ Ankit Kumar☜︎︎︎✰

🄾🅆🄽🄴🅁 🄲🄾🄽🅃🄰🄲🅃 🄻🄸🄽🄺🅂➪ 
Telegram 👉https://t.me/xnkit69
Instagram 👉 https://instagram.com/aannkkittttt
Email 👉mailto:xnkitk69@gmail.com
🌸𝗕𝗼𝘁 𝗣𝗿𝗲𝗳𝗶𝘅🌸 ${prefix}
🥳 UPTIME: ${hours}h ${minutes}m ${seconds}s
🌪️ DATE: ${timeNow}
✅ Thanks for using my bot ❤ ${botName}`;

    const imagePath = path.join(__dirname, "cache", "info.js");
    const file = fs.createWriteStream(imagePath);

    https.get(selectedImage, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        ctx.replyWithPhoto({ source: imagePath }, { caption }).then(() => {
          fs.unlinkSync(imagePath);
        });
      });
    }).on("error", (err) => {
      ctx.reply("Image fetch failed, but here is the info:\n\n" + caption);
    });
  }
};
