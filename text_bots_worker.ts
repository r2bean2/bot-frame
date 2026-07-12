import mineflayer from 'mineflayer';
import { readTextToLineObjects } from './readTextToLineObjects.ts';

type MineflayerBot = any; 
console.log("Initializing bot engine...");

const bot = mineflayer.createBot({
  host: '127.0.0.1', // Ensure this points to your running ViaProxy or server
  port: 25568,        // Change to 25565 if connecting directly without proxy
  username: 'ConnectionTest',
  version: '1.21.11'   // Keep 1.21.11 if routing through ViaProxy
});
// This listener hooks into the network event loop and keeps Node.js alive
let clearToSpawnDirectly = false;

bot.once('login', () => {
  console.log("[Network] Handshake complete. Monitoring server auth prompts...");
  
  // Listen directly to raw chat packets from the server before spawning
  bot.on('message', (jsonMsg:any) => {
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
  // Initialize your automated background routines here
  setTimeout(() => {
    startSurvivalRoutines(bot);
  }, 10000);

});

function startSurvivalRoutines(bot: any) {
  console.log("func work");

  
  const lines: any[] = readTextToLineObjects('input.txt');
  let index = 0;
  
  function printNextLine() {
    if (index < lines.length) {
      const currentPayload = lines[index];
      
      if (currentPayload) {
        const textToSend = typeof currentPayload === 'object' ? currentPayload.line : currentPayload;      
        bot.chat(`[Bot] ${textToSend}`);
        console.log(`[Minecraft Send Log] Typed line: ${textToSend}`); 
      } 
      
      index++; 
      setTimeout(printNextLine, 1000); // 1-second delay per line
    } else {
      // FIX: The song is completely finished! Trigger a clean, safe exit sequence
      console.log(`[Routines] Finished printing all ${lines.length} lines. Initiating shutdown...`);
      
      // Send a final message, then wait 500ms for the packet buffer to flush before quitting
      bot.chat("[Bot] done now");
      
      setTimeout(() => {
        console.log("Session complete. Terminating connection cleanly...");
        bot.quit();
      }, 500);
    }
  } 

  // Remove the old 15-second setTimeout from here!
  // It is now handled automatically in the 'else' block above when index reaches lines.length.

  printNextLine(); 
}


// Error diagnostic handlers
bot.on('error', (err: Error) => console.error(`[Network Error] ${err.message}`));
