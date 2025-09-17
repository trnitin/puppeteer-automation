// import { fetcher } from "../helper/fetcher";
const fetcher = require('../helper/fetcher')
const fs = require('fs').promises
const read = require('../helper/fileHelper');
const fss = require('fs');
const puppeteer = require('puppeteer');

exports.setLotusLogin = (req, res, next) => {
  const body = {
    // username: '12poo',
    // password: 'Abcd3333'
    // username: 'ne666',
    // password: 'Abcd5555'
    username: 'lotus247i5',
    password: 'Coldpink74'
  }
  // fetcher('https://admin.lotusbook247.com/api/auth/login', 'POST', body)
   fetcher('https://admin.lotus247.com/api/auth/login', 'POST', body)
    .then(async (resp) => {
      console.log(resp, "resp")
      const filePath = 'auth.json';
      const userData = {
        "name": resp.response.result.user.name,
        "authorization": resp.header,
      }
      authorization = resp.header;
      try {
        await fs.writeFile(filePath, JSON.stringify(userData));
        console.log('File has been written successfully using promises.');
        res.status(200).send({ message: resp.response, header: resp.header })
      } catch (err) {
        console.error('Error writing file:', err);
      }
    }).catch((err) => {
      console.log(err, "errs")
    })
}



exports.LotusBetList = async (req, res, next) => {
  try {
    const creds = await read('auth.json');

    // const apiUrl = `https://admin.lotusbook247.com/api/agency/${creds.name}/report/order-list-json?type=matched&sportId=4&marketType=MATCH_ODDS&providerId=-1&providerType=EXCHANGE&page=1&token=${creds.authorization}`;
    // const apiUrl = `https://admin.lotusbook247.com/api/agency/N5043O/report/order-list-json?type=matched&from=1757701800450&to=1757874599450&sportId=-1&marketType=ALL&option=regular&providerType=ALL&betStatus=ALL&whiteLabelSkinId=allSkins&providerId=-1&page=1&token=${creds.authorization}`;
    // const apiUrl = `https://admin.lotusbook247.com/api/agency/${creds.name}/report/order-list-json?type=matched&from=1757701800450&to=1757874599450&sportId=4&option=regular&betStatus=ALL&whiteLabelSkinId=allSkins&marketType=MATCH_ODDS&providerId=-1&providerType=EXCHANGE&page=1&token=${creds.authorization}`;
   const apiUrl =    `https://admin.lotus247.com/api/agency/XN/report/order-list?type=matched&from=1757874600316&to=1757960999316&sportId=4&marketType=MATCH_ODDS&whiteLabelSkinId=allSkins&providerId=-1&page=1`
   
  //  const data = await fetcher(apiUrl, 'GET');
   const data = await fetcher(apiUrl, 'GET', null, {
   Authorization: creds.authorization
});

    const latestBets = data?.response?.result?.pageRows || [];
    console.log(latestBets,"latest")

    // Load existing file or fallback to empty array
    let existingBets = [];
    try {
      const fileContent = await fs.readFile('bets.json', 'utf8');
      existingBets = JSON.parse(fileContent);
    } catch (err) {
      console.warn('No existing bets.json found or error reading:', err.message);
    }

    // Create a map of existing bets by some unique ID (e.g., betId)
    const existingMap = new Map(existingBets.map(b => [b.apolloBetId, b]));

    // Merge logic
    const mergedBets = latestBets.map(bet => {
      const existing = existingMap.get(bet.apolloBetId);
      return {
        ...bet,
        placed: existing?.placed || false,
        read: existing?.read || false
      };
    });

    // Save updated bets
    await fs.writeFile('bets.json', JSON.stringify(mergedBets, null, 2));
    console.log('✅ bets.json updated');

    // Identify new bets to place
    const newUnplacedBets = mergedBets.filter(bet => !bet.placed);

    if (newUnplacedBets.length > 0) {
      console.log(`🚀 Found ${newUnplacedBets.length} unplaced bet(s), triggering placement...`);
      await exports.loginToSite(newUnplacedBets);
      await new Promise(r => setTimeout(r, 3000));
      // Mark them as placed after successful automation
      const finalBets = mergedBets.map(bet => ({
        ...bet,
        placed: newUnplacedBets.some(newBet => newBet.betId === bet.betId) ? true : bet.placed
      }));

      await fs.writeFile('bets.json', JSON.stringify(finalBets, null, 2));
      console.log('✅ Placed bets marked as placed');
    }

    res.status(200).send(mergedBets);
  } catch (err) {
    console.error('❌ Error in BetList:', err);
    next(err);
  }
};



let browser = null;
let page = null;
let loggedIn = false;

// Helper sleep function
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function startBrowserAndLogin() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    page = await browser.newPage();
  }

  if (!loggedIn) {
    await page.goto('https://www.lotus7book.com/d/index.html#/home', { waitUntil: 'networkidle2' });

    // Handle New Version modal
    await sleep(500);
    const newVersionModal = await page.$('.new-version');
    if (newVersionModal) {
      console.log('🟡 Clicking "Later" on New Version modal...');
      await page.click('.new-version .later');
      await sleep(300);
    }

    // Login steps
    await page.waitForSelector('.login', { visible: true });
    await page.click('.login');

    await page.waitForSelector('#modal-component-wrap', { visible: true });
    await page.type('input[placeholder="User Name"]', 'ssy2', { delay: 100 });
    await page.type('input[placeholder="Password"]', 'Pave@1877', { delay: 100 });
    await page.click('button.btn-login');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    loggedIn = true;
    console.log('✅ Logged in successfully');
  }
}

async function navigateToCricket() {
  await page.waitForSelector('nav.sport-menu', { visible: true });
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('nav.sport-menu a'));
    const cricketLink = links.find(link => link.textContent.trim() === 'Cricket');
    if (cricketLink) cricketLink.click();
  });
  await page.waitForSelector('tr.ng-scope', { visible: true });
}

exports.loginToSite = async (bets) => {
  try {
    await startBrowserAndLogin();
    await navigateToCricket();

    for (const bet of bets) {
      const eventName = bet.eventName.trim();
      const selection = bet.selectionName.trim();
      const stakeAmount = bet.sizeMatched.toString();
      const side = bet.side === 0 ? 'back' : 'lay';
      // const side = bet.side === 0 ? 'lay' : 'back';


      console.log(`🟢 Attempting bet for: ${eventName} - ${selection} [${side}]`);

      // const matchClicked = await page.evaluate((eventName, side) => {
      //   const rows = Array.from(document.querySelectorAll('tr.ng-scope'));
      //   for (const row of rows) {
      //     const matchLink = row.querySelector('a.event-name');
      //     if (!matchLink) continue;
      //     const text = matchLink.textContent.trim();
      //     console.log(matchLink,"matchLink");
      //     if (text.toLowerCase().includes(eventName.toLowerCase())) {
      //       const buttons = row.querySelectorAll(`td.${side}`);
      //       if (buttons.length > 0) {
      //         buttons[0].click();
      //         return true;
      //       }
      //     }
      //   }
      //   return false;
      // }, eventName, side);

      // const eventName = "Trinbago Knight Riders v Guyana Amazon Warriors";
      // const selectionName = "Guyana Amazon Warriors W";

      function normalize(str) {
        return str.toLowerCase().replace(/\b(women|w)\b/gi, '').trim();
      }

      const parts = eventName.split('v').map(p => normalize(p));
      const selNameNorm = normalize(selection);

      console.log(parts);         // ['trinbago knight riders', 'guayana amazon warriors']
      console.log(selNameNorm);   // 'guayana amazon warriors'
      let partIndex = -1;  // -1 means not found

      if (parts[0].includes(selNameNorm)) {
        partIndex = 0;
      } else if (parts[1].includes(selNameNorm)) {
        partIndex = 1;
      }

      console.log('Selection appears in part:', partIndex);


      const matchClicked = await page.evaluate((parts, side, partIndex) => {
        const rows = Array.from(document.querySelectorAll('tr.ng-scope'));
        for (const row of rows) {
          const matchLink = row.querySelector('a.event-name');
          if (!matchLink) continue;

          const text = matchLink.textContent.trim().toLowerCase();

          if (!(text.includes(parts[0]) && text.includes(parts[1]))) continue;

          // Get all back and lay buttons in order
          const buttons = row.querySelectorAll('td.back, td.lay');

          console.log(`🟠 Found ${buttons.length} buttons for match "${text}"`);

          // Calculate which button index to click based on side and partIndex
          // buttons layout: [back1, lay1, back2, lay2]
          // side=0 (back), side=1 (lay)
          // partIndex=0 or 1

          let buttonIndex;
          if (partIndex === 0) {
            buttonIndex = side === 0 ? 1 : 0;
          } else if (partIndex === 1) {
            buttonIndex = side === 0 ? 3 : 2;
          } else {
            console.log('⚠️ Invalid partIndex:', partIndex);
            return false;
          }

          if (buttons[buttonIndex]) {
            buttons[buttonIndex].click();
            console.log(`🟢 Clicked button[${buttonIndex}] for "${text}"`);
            return true;
          } else {
            console.log(`⚠️ Button[${buttonIndex}] not found for "${text}"`);
          }
        }
        console.log(`🔴 No match found for parts: ${parts.join(' v ')}`);
        return false;
      }, parts, side, partIndex);



      if (!matchClicked) {
        console.log(`❌ Could not find match for: ${eventName}`);
        continue;
      }

      console.log(`✅ Clicked ${side} for ${eventName}`);

      await page.waitForSelector('.betslip.ng-isolate-scope.has-bets', { visible: true });

      // Clear stake input
      await page.evaluate(() => {
        const input = document.querySelector('input[name^="stakeRef_"]');
        if (input) input.value = '';
      });

      await page.type('input[name^="stakeRef_"]', stakeAmount, { delay: 100 });
      await sleep(2000);

      // Click "Place Bet"
      await page.click('button[type="submit"].apl-btn-primary');

      // Try to detect confirmation modal
      let confirmationVisible = false;
      try {
        await page.waitForSelector('.confirmation-content', { visible: true, timeout: 4000 });
        confirmationVisible = true;
      } catch (e) {
        console.log(`⚠️ Bet failed for: ${selection} @ ${bet.price}. Attempting to clean up...`);

        // Look for error or fail messages
        const errorVisible = await page.$('.fail-messages, .error');
        if (errorVisible) {
          const removeBtn = await page.$('button.apl-btn-remove');
          if (removeBtn) {
            await removeBtn.click();
            console.log(`🧹 Removed failed bet from slip: ${selection}`);
            await sleep(2000);
          }
        }

        continue; // Move to next bet
      }

      if (confirmationVisible) {
        await page.click('.confirmation-content button.apl-btn-update');
        await sleep(2000);
        console.log(`💰 Bet placed: ${selection} @ ${bet.price} for ${stakeAmount}`);
      }

      // Wait before moving to next bet
      await sleep(2000);
    }

    console.log('✅ All bets attempted.');

  } catch (err) {
    console.error('❌ Puppeteer error:', err.message);
  }
};

exports.closeBrowser = async () => {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
    loggedIn = false;
    console.log('🛑 Browser closed');
  }
};

