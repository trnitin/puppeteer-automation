// import { fetcher } from "../helper/fetcher";
const fetcher = require('../helper/fetcher')
const fs = require('fs').promises
const read = require('../helper/fileHelper');
const fss = require('fs');
const puppeteer = require('puppeteer');

exports.setLogin = (req, res, next) => {
  const body = {
    // username: '12poo',
    // password: 'Abcd3333'
    username: 'ne666',
    password: 'Abcd5555'
    // username: 'lotus247i5',
    // password: 'Coldpink74'
  }
  fetcher('https://admin.lotusbook247.com/api/auth/login', 'POST', body)
  //  fetcher('https://admin.lotus247.com/api/auth/login', 'POST', body)
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


// exports.BetList = async (req, res, next) => {
//     try {
//         // Read the auth.json file to get the necessary credentials
//         const authData = await read('auth.json');

//         // Fetch the data from the external API
//         const data = await fetcher(`https://admin.lotusbook247.com/api/agency/${authData.name}/report/order-list-json?type=matched&sportId=4&marketType=MATCH_ODDS&providerId=-1&providerType=EXCHANGE&page=1&token=${authData.authorization}`, 'GET');

//         // Check if the fetch was successful and contains the expected data
//         if (data?.response?.result?.pageRows) {
//             const newData = data.response.result.pageRows.map((ele) => ({ ...ele, read: false }));

//             // Read the existing bets data
//             let existingBets = [];
//             try {
//                 const fileContent = await fs.readFile('bets.json', 'utf8');
//                 existingBets = JSON.parse(fileContent); // Parse existing bets
//             } catch (err) {
//                 console.error('Error reading bets.json, initializing with empty array:', err);
//             }

//             // Combine existing bets with new data
//             const updatedBets = [...existingBets, ...newData];

//             // Write the updated data back to the file
//             await fs.writeFile('bets.json', JSON.stringify(updatedBets, null, 2)); // Pretty-print JSON
//             console.log('File has been written successfully using promises.');

//             // Send the response back to the client
//             res.status(200).send(newData);
//         } else {
//             console.error('Unexpected data format:', data);
//             res.status(400).send({ error: 'Invalid data format from API.' });
//         }
//     } catch (err) {
//         console.error('Error in BetList function:', err);
//         res.status(500).send({ error: 'An error occurred while processing your request.' });
//     }
// };

// my original betlist with response
// exports.BetList = (req, res, next) => {
//     read('auth.json').then((resp) => {
//         return resp
//     })
//         .then((resps) => {
//             console.log(resps, "resps")
//             fetcher(`https://admin.lotusbook247.com/api/agency/${resps.name}/report/order-list-json?type=matched&sportId=4&marketType=MATCH_ODDS&providerId=-1&providerType=EXCHANGE&page=1&token=${resps.authorization}`, 'GET')
//                 .then(async (data) => {
//                     //console.log(data.response.result);
//                     // let existingBets = [];
//                     // try {
//                     //     const fileContent = await fs.readFile('bets.json', 'utf8');
//                     //     existingBets = await JSON.parse(fileContent); // Parse existing bets

//                     // } catch (err) {
//                     //     console.error('Error reading bets.json, initializing with empty array:', err);
//                     //     next(err)
//                     // }
//                     // const newData = data?.response.result.pageRows.map((ele,index) => {
//                     //     if(existingBets.length > 0){
//                     //         return {...ele,read:existingBets[index] ? existingBets[index].read : false}
//                     //     }
//                     //     return { ...ele, read: false }
//                     // })
//                     // try {
//                     //     await fs.writeFile('bets.json', JSON.stringify(newData));
//                     //     // console.log('File has been written successfully using promises.');
//                     // res.status(200).send(newData)
//                     // } catch (err) {
//                     //     console.error('Error writing file:', err);
//                     //     next(err)
//                     // }
//                     console.log(data?.response?.result?.pageRows, "Da")
//                     res.status(200).send(data?.response?.result?.pageRows)
//                 })
//         }).catch((err) => {
//             console.log(err)
//             next(err)
//         })
// }


// betlist to write to file
// exports.BetList = async (req, res, next) => {
//     try {
//         const resp = await read('auth.json');
//         const { name, authorization } = resp;

//         const data = await fetcher(
//             `https://admin.lotusbook247.com/api/agency/${name}/report/order-list-json?type=matched&sportId=4&marketType=MATCH_ODDS&providerId=-1&providerType=EXCHANGE&page=1&token=${authorization}`,
//             'GET'
//         );

//         const newBets = data?.response?.result?.pageRows || [];
//         console.log(newBets, "New Bets");

//         // Step 1: Read existing bets
//         let existingBets = [];
//         try {
//             const existing = await fs.readFile('bets.json', 'utf8');
//             existingBets = JSON.parse(existing);
//         } catch (err) {
//             console.warn('bets.json not found or unreadable. Initializing empty list.');
//             existingBets = [];
//         }

//         // Step 2: Create a Set of existing bet IDs
//         const existingIds = new Set(existingBets.map(bet => bet.id)); // or bet.orderId

//         // Step 3: Filter newBets to only include ones not already in existingBets
//         const uniqueNewBets = newBets
//             .filter(bet => !existingIds.has(bet.id)) // or bet.orderId
//             .map(bet => ({ ...bet, read: false }));

//         // Step 4: Merge and save
//         const updatedBets = [...uniqueNewBets, ...existingBets];

//         await fs.writeFile('bets.json', JSON.stringify(updatedBets, null, 2));

//         // Step 5: Send latest list as response
//         res.status(200).send(updatedBets);
//     } catch (err) {
//         console.error('Error in BetList:', err);
//         next(err);
//     }
// };




exports.updateClickedBets = (req, res, next) => {
  const id = req.body.id;
  read('bets.json').
    then((resp) => {
      return resp
    })
    .then((fileData) => {
      // console.log(fileData,"sad")
      const newData = fileData.map((ele) => {
        if (ele.apolloBetId === id) {
          ele.read = true
        }
        return ele
      })
      return newData
    })
    .then(async (response) => {
      // console.log(response, "ds")
      // await fs.writeFile('bets.json', JSON.stringify(response));
      fss.writeFile('bets.json', JSON.stringify(response), () => {
        // console.log('File has been written successfully using promises.');
        res.status(200).send(response)
      })
    })
    .catch((err) => {
      next(err)
    })
}


// exports.updateClickedBets = async (req, res, next) => {
//     try {
//         const id = req.body.id;

//         // Read the current bets data from the file
//         const fileData = await read('bets.json');

//         // Map through the file data and update the read property
//         const newData = fileData.map((ele) => {
//             console.log(ele,"s")
//             if (ele.apolloBetId === id) {
//                 ele.read = true; // Set read to true if IDs match
//             }
//             return ele;
//         });

//         // Write the updated data back to the file
//         await fs.writeFile('bets.json', JSON.stringify(newData, null, 2)); // Pretty-print JSON

//         console.log('File has been written successfully using promises.');
//         // res.status(200).send(newData); // Send the updated data back to the client
//     } catch (error) {
//         console.error('Error updating clicked bets:', error);
//         res.status(500).send({ error: 'An error occurred while updating bets.' });
//     }
// };



// exports.loginToSite = async (req, res, next) => {
//     const browser = await puppeteer.launch({
//         headless: false,             // Show the browser window
//         defaultViewport: null,       // Use full-size window
//         args: ['--start-maximized']
//     });
//     const page = await browser.newPage();

//     try {
//         await page.goto('https://www.lotus7book.com/d/index.html#/home');

//         // -------------------if newer version Modal pops up cancel and proceed to click login -----------------------------
//         await new Promise(resolve => setTimeout(resolve, 500));

//         // Check if the "New Version" modal is present
//         const newVersionModal = await page.$('.new-version');

//         if (newVersionModal) {
//             console.log('New Version modal detected, clicking "Later"...');

//             // Wait for the "Later" button inside the modal
//             await page.waitForSelector('.new-version .later', { visible: true });

//             // Click the "Later" button to dismiss
//             await page.click('.new-version .later');

//             // Wait briefly for modal to close
//             await new Promise(resolve => setTimeout(resolve, 300));
//         } else {
//             console.log('New Version modal not present, proceeding...');
//         }


//         // -------------------------clicking the login button and populating login fields and awaiting login to main page-----------------------

//         await page.waitForSelector('.login', { visible: true });

//         // Click the login button
//         await page.click('.login');

//         // Wait for modal to appear
//         await page.waitForSelector('#modal-component-wrap', { visible: true });

//         // Fill in username
//         await page.type('input[placeholder="User Name"]', 'ssy2');

//         // Fill in password
//         await page.type('input[placeholder="Password"]', 'Pave@1877');

//         // Optional: wait a bit for UI polish (e.g., animations)
//         //   await page.waitForTimeout(300);

//         // Click the login button
//         await page.click('button.btn-login');

//         console.log('Login submitted.');

//         // Optional: wait for navigation or check login success
//         await page.waitForNavigation({ waitUntil: 'networkidle0' });


//         // ----------------------------Clicking the cricket menu button on home page----------------------------------
//         // Wait for the menu to load
//         await page.waitForSelector('nav.sport-menu', { visible: true });

//         // Find and click the link with text 'Cricket'
//         const clicked = await page.evaluate(() => {
//             const links = Array.from(document.querySelectorAll('nav.sport-menu a'));
//             const cricketLink = links.find(link => link.textContent.trim() === 'Cricket');
//             if (cricketLink) {
//                 cricketLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                 cricketLink.click();
//                 return true;
//             }
//             return false;
//         });

//         if (clicked) {
//             console.log("✅ Clicked 'Cricket'");
//         } else {
//             console.log("❌ 'Cricket' link not found");
//         }

// //------------------now click the back or lay for the specific event -----------------------------
// // Wait for table to load
// await page.waitForSelector('tr.ng-scope', { visible: true });

// // Click the first BACK button for "Bangladesh v Sri Lanka"
// const clickedButton = await page.evaluate(() => {
//   const rows = Array.from(document.querySelectorAll('tr.ng-scope'));

//   for (const row of rows) {
//     const matchLink = row.querySelector('a.event-name');
//     if (matchLink && matchLink.textContent.trim() === 'Bangladesh v Sri Lanka') {
//       // Find all back buttons inside this row
//       const backButtons = row.querySelectorAll('td.back');
//       if (backButtons.length > 0) {
//         backButtons[0].click();  // Click the first "Back" button
//         return true;
//       }
//     }
//   }

//   return false;
// });


// // Step 2: Wait for the betslip to appear
// await page.waitForSelector('.betslip.ng-isolate-scope.has-bets', { visible: true });

// // Step 3: Fill in stake (e.g. 100)
// await page.type('input[name^="stakeRef_"]', '100');

// // Optional: wait for validation or any async updates
// // await page.waitForTimeout(500);
//  await new Promise(resolve => setTimeout(resolve, 500));

// // Step 4: Click the "Place bets" button
// await page.click('button[type="submit"].apl-btn-primary');

// await page.waitForSelector('.confirmation-content', { visible: true });

// // Step 5: Click "Confirm"
// await page.click('.confirmation-content button.apl-btn-update');

// // Optional: wait for success/failure feedback
// // await page.waitForTimeout(2000);
//  await new Promise(resolve => setTimeout(resolve, 2000));

// if (clickedButton) {
//   console.log("✅ Clicked BACK button for Bangladesh v Sri Lanka");
// } else {
//   console.log("❌ Could not find BACK button or match row");
// }

//         // res.send({
//         //   status: 'Logged in using Puppeteer',
//         //   html: content
//         // });
//     }
//     catch (error) {
//         // await browser.close();
//         console.error('Puppeteer error:', error);
//         // res.status(500).send('Login failed');
//     }
// }




// let browser = null;
// let page = null;
// let loggedIn = false;

// // Helper sleep function
// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// async function startBrowserAndLogin() {
//   if (!browser) {
//     browser = await puppeteer.launch({
//       headless: false,
//       defaultViewport: null,
//       args: ['--start-maximized']
//     });
//     page = await browser.newPage();
//   }

//   if (!loggedIn) {
//     await page.goto('https://www.lotus7book.com/d/index.html#/home', { waitUntil: 'networkidle2' });

//     // Handle New Version modal
//     await sleep(500);
//     const newVersionModal = await page.$('.new-version');
//     if (newVersionModal) {
//       console.log('🟡 Clicking "Later" on New Version modal...');
//       await page.click('.new-version .later');
//       await sleep(300);
//     }

//     // Login steps
//     await page.waitForSelector('.login', { visible: true });
//     await page.click('.login');

//     await page.waitForSelector('#modal-component-wrap', { visible: true });
//     await page.type('input[placeholder="User Name"]', 'darr30', { delay: 100 });
//     await page.type('input[placeholder="Password"]', 'Abcd@1234', { delay: 100 });
//     await page.click('button.btn-login');

//     await page.waitForNavigation({ waitUntil: 'networkidle2' });

//     loggedIn = true;
//     console.log('✅ Logged in successfully');
//   }
// }

// async function navigateToCricket() {
//   await page.waitForSelector('nav.sport-menu', { visible: true });
//   await page.evaluate(() => {
//     const links = Array.from(document.querySelectorAll('nav.sport-menu a'));
//     const cricketLink = links.find(link => link.textContent.trim() === 'Cricket');
//     if (cricketLink) cricketLink.click();
//   });
//   await page.waitForSelector('tr.ng-scope', { visible: true });
// }

// exports.loginToSite = async (bets) => {
//   try {
//     await startBrowserAndLogin();
//     await navigateToCricket();

//     for (const bet of bets) {
//       const eventName = bet.eventName.trim();
//       const selection = bet.selectionName.trim();
//       const stakeAmount = bet.sizeMatched.toString();
//       const side = bet.side === 0 ? 'back' : 'lay';

//       console.log(`🟢 Attempting bet for: ${eventName} - ${selection} [${side}]`);

//       const matchClicked = await page.evaluate((eventName, side) => {
//         const rows = Array.from(document.querySelectorAll('tr.ng-scope'));
//         for (const row of rows) {
//           const matchLink = row.querySelector('a.event-name');
//           if (!matchLink) continue;
//           const text = matchLink.textContent.trim();

//           if (text.toLowerCase().includes(eventName.toLowerCase())) {
//             const buttons = row.querySelectorAll(`td.${side}`);
//             if (buttons.length > 0) {
//               buttons[0].click();
//               return true;
//             }
//           }
//         }
//         return false;
//       }, eventName, side);

//       if (!matchClicked) {
//         console.log(`❌ Could not find match for: ${eventName}`);
//         continue;
//       }

//       console.log(`✅ Clicked ${side} for ${eventName}`);

//       await page.waitForSelector('.betslip.ng-isolate-scope.has-bets', { visible: true });

//       // Clear stake input
//       await page.evaluate(() => {
//         const input = document.querySelector('input[name^="stakeRef_"]');
//         if (input) input.value = '';
//       });

//       await page.type('input[name^="stakeRef_"]', stakeAmount, { delay: 100 });
//       await sleep(2000);

//       await page.click('button[type="submit"].apl-btn-primary');
//       await sleep(2000);
//       await page.waitForSelector('.confirmation-content', { visible: true });

//       await page.click('.confirmation-content button.apl-btn-update');

//       await sleep(2000);

//       console.log(`💰 Bet placed: ${selection} @ ${bet.price} for ${stakeAmount}`);
//     }

//     console.log('✅ All bets attempted.');

//   } catch (err) {
//     console.error('❌ Puppeteer error:', err.message);
//   }
// };

// // Optional: Add a function to close the browser when done with all bets/tests
// exports.closeBrowser = async () => {
//   if (browser) {
//     await browser.close();
//     browser = null;
//     page = null;
//     loggedIn = false;
//     console.log('🛑 Browser closed');
//   }
// };


exports.BetList = async (req, res, next) => {
  try {
    const creds = await read('auth.json');

    const apiUrl = `https://admin.lotusbook247.com/api/agency/${creds.name}/report/order-list-json?type=matched&sportId=4&marketType=MATCH_ODDS&providerId=-1&providerType=EXCHANGE&page=1&token=${creds.authorization}`;
    // const apiUrl = `https://admin.lotusbook247.com/api/agency/N5043O/report/order-list-json?type=matched&from=1757701800450&to=1757874599450&sportId=-1&marketType=ALL&option=regular&providerType=ALL&betStatus=ALL&whiteLabelSkinId=allSkins&providerId=-1&page=1&token=${creds.authorization}`;
    // const apiUrl = `https://admin.lotusbook247.com/api/agency/${creds.name}/report/order-list-json?type=matched&from=1757701800450&to=1757874599450&sportId=4&option=regular&betStatus=ALL&whiteLabelSkinId=allSkins&marketType=MATCH_ODDS&providerId=-1&providerType=EXCHANGE&page=1&token=${creds.authorization}`;
  //  const apiUrl =    `https://admin.lotus247.com/api/agency/XN/report/order-list?type=matched&from=1757874600316&to=1757960999316&sportId=4&marketType=MATCH_ODDS&whiteLabelSkinId=allSkins&providerId=-1&page=1`
   
   const data = await fetcher(apiUrl, 'GET');
//    const data = await fetcher(apiUrl, 'GET', null, {
//    Authorization: creds.authorization
// });

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

