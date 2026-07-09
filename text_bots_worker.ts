import mineflayer from "mineflayer"
console.log("Initializing bot engine...");

const bot = mineflayer.createBot({
  host: '127.0.0.1', // Ensure this points to your running ViaProxy or server
  port: 25568,        // Change to 25565 if connecting directly without proxy
  username: 'ConnectionTest',
  version: '1.21.11'   // Keep 1.21.1 if routing through ViaProxy
});

// This listener hooks into the network event loop and keeps Node.js alive
let clearToSpawnDirectly = false;

bot.once('login', () => {
  console.log("[Network] Handshake complete. Monitoring server auth prompts...");
  
  // Listen directly to raw chat packets from the server before spawning
  bot.on('message', (jsonMsg) => {
    const serverMessage = jsonMsg.toString().toLowerCase();

    // Check if the server is prompting a new user to register
    if (serverMessage.includes('register') || serverMessage.includes('/register')) {
      if (!clearToSpawnDirectly) {
        console.log("[Auth Detector] Server requested registration. Processing...");
        
        setTimeout(() => {
          bot.chat('/register Pass123 Pass123');
          console.log("[Packet Log] Registration packet injected.");
        }, 1500);
      }
    } 
    // Check if the server recognizes the account and wants a login command instead
    else if (serverMessage.includes('login') || serverMessage.includes('/login')) {
      console.log("[Auth Detector] Account already registered. Swapping to login profile...");
      clearToSpawnDirectly = true;
      
      setTimeout(() => {
        bot.chat('/login Pass123');
        console.log("[Packet Log] Login packet injected.");
      }, 1500);
    }
  });
});

// The core operational block triggers automatically once authentication passes
bot.once('spawn', () => {
  bot.chat('yall need to imporve your server protection');
  // Initialize your automated background routines here
  startSurvivalRoutines(bot);
  setTimeout(() => {
    bot.chat('yall need to imporve your server protection');
    console.log("[Packet Log] Broadcast message sent safely.");
  }, 1000);
});

function startSurvivalRoutines(bot:mineflayer.Bot) {
  // Keep the bot safely online for 15 seconds, then quit the test session
  setTimeout(() => {
    console.log("Session complete. Terminating connection cleanly...");
    bot.quit();
  }, 15000);
}

// Error diagnostic handlers
bot.on('error', (err:Error) => console.error(`[Network Error] ${err.message}`));