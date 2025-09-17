// import { fetcher } from "../helper/fetcher";
const fetcher = require('../helper/fetcher')
const fs = require('fs').promises
const read = require('../helper/fileHelper');
const fss = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const appKey = "DsGV2EVu8pDQHvVs"; // delayed app key

exports.integratedLotusBookLogin = (req, res, next) => {
  const body = {
    // username: '12poo',
    // password: 'Abcd3333'
    username: 'ne666',
    password: 'Abcd5555'
    // username: 'lotus247i5',
    // password: 'Coldpink74'
  }
  fetcher('https://admin.lotusbook247.com/api/auth/login', 'POST', body)
//    fetcher('https://admin.lotus247.com/api/auth/login', 'POST', body)
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



// exports.integratedLotusBookBetList = async (req, res, next) => {
//   try {
//     const creds = await read('auth.json');

//     const apiUrl = `https://admin.lotusbook247.com/api/agency/${creds.name}/report/order-list-json?type=matched&sportId=4&marketType=MATCH_ODDS&providerId=-1&providerType=EXCHANGE&page=1&token=${creds.authorization}`;
//     // const apiUrl = `https://admin.lotusbook247.com/api/agency/N5043O/report/order-list-json?type=matched&from=1757701800450&to=1757874599450&sportId=-1&marketType=ALL&option=regular&providerType=ALL&betStatus=ALL&whiteLabelSkinId=allSkins&providerId=-1&page=1&token=${creds.authorization}`;
//     // const apiUrl = `https://admin.lotusbook247.com/api/agency/${creds.name}/report/order-list-json?type=matched&from=1757701800450&to=1757874599450&sportId=4&option=regular&betStatus=ALL&whiteLabelSkinId=allSkins&marketType=MATCH_ODDS&providerId=-1&providerType=EXCHANGE&page=1&token=${creds.authorization}`;
// //    const apiUrl =    `https://admin.lotus247.com/api/agency/XN/report/order-list?type=matched&from=1757874600316&to=1757960999316&sportId=4&marketType=MATCH_ODDS&whiteLabelSkinId=allSkins&providerId=-1&page=1`
   
//    const data = await fetcher(apiUrl, 'GET');
// //    const data = await fetcher(apiUrl, 'GET', null, {
// //    Authorization: creds.authorization
// // });

//     const latestBets = data?.response?.result?.pageRows || [];
//     console.log(latestBets,"latest")

//     // Load existing file or fallback to empty array
//     let existingBets = [];
//     try {
//       const fileContent = await fs.readFile('bets.json', 'utf8');
//       existingBets = JSON.parse(fileContent);
//     } catch (err) {
//       console.warn('No existing bets.json found or error reading:', err.message);
//     }

//     // Create a map of existing bets by some unique ID (e.g., betId)
//     const existingMap = new Map(existingBets.map(b => [b.apolloBetId, b]));

//     // Merge logic
//     const mergedBets = latestBets.map(bet => {
//       const existing = existingMap.get(bet.apolloBetId);
//       return {
//         ...bet,
//         placed: existing?.placed || false,
//         read: existing?.read || false
//       };
//     });

//     // Save updated bets
//     await fs.writeFile('bets.json', JSON.stringify(mergedBets, null, 2));
//     console.log('✅ bets.json updated');

//     // Identify new bets to place
//     const newUnplacedBets = mergedBets.filter(bet => !bet.placed);
//     let fakeData = [
//   {
//     "apolloBetId": "2509171930202702",
//     "betPlacedDate": 1758137420000,
//     "marketId": "1.247884981",
//     "marketType": "MatchOdds",
//     "oddsType": "DECIMAL",
//     "marketName": "Match Odds",
//     "marketTime": 1758132000000,
//     "eventTypeId": "4",
//     "eventName": "Barbados Royals W v Guyana Amazon Warriors W",
//     "eventId": "34741211",
//     "competitionName": "Women's Caribbean Premier League",
//     "selectionId": "47674067",
//     "selectionName": "Barbados Royals W",
//     "side": 0,
//     "agentPosition": 0,
//     "averagePrice": 1.87,
//     "userName": "N5043V01M0002",
//     "loginName": "pre505",
//     "oneClick": 0,
//     "inPlay": 1,
//     "price": 1.86,
//     "lastMatchedDate": 1758137425000,
//     "betStatus": 1,
//     "invalid": 0,
//     "placedOn": "M",
//     "priceBreakdown": null,
//     "line": 0,
//     "exchangeRate": 1.49,
//     "whitelabel": "Lotus",
//     "sma": "net504",
//     "ma": "12bhomi",
//     "agent": "ne666",
//     "betPlacedType": 1,
//     "orderStatus": 1,
//     "smaId": 478611,
//     "cashout": null,
//     "sizeRemaining": 0,
//     "sizeMatched": 300,
//     "sizeLapsed": 0,
//     "sizeCancelled": 0,
//     "sizeVoided": 0,
//     "sizeTotal": 300,
//     "profitLoss": 261,
//     "liability": null,
//     "isMicroBetting": false,
//     "sportName": "Cricket",
//     "marketBettingType": "ODDS",
//     "marketLineType": null,
//     "placed": false,
//     "read": false
//   },
//   {
//     "apolloBetId": "2509171855054188",
//     "betPlacedDate": 1758135305000,
//     "marketId": "1.247884981",
//     "marketType": "MatchOdds",
//     "oddsType": "DECIMAL",
//     "marketName": "Match Odds",
//     "marketTime": 1758132000000,
//     "eventTypeId": "4",
//     "eventName": "Barbados Royals W v Guyana Amazon Warriors W",
//     "eventId": "34741211",
//     "competitionName": "Women's Caribbean Premier League",
//     "selectionId": "47674067",
//     "selectionName": "Barbados Royals W",
//     "side": 1,
//     "agentPosition": 0,
//     "averagePrice": 1.53,
//     "userName": "N5043V01M0002",
//     "loginName": "pre505",
//     "oneClick": 0,
//     "inPlay": 1,
//     "price": 1.57,
//     "lastMatchedDate": 1758135310000,
//     "betStatus": 1,
//     "invalid": 0,
//     "placedOn": "M",
//     "priceBreakdown": null,
//     "line": 0,
//     "exchangeRate": 1.49,
//     "whitelabel": "Lotus",
//     "sma": "net504",
//     "ma": "12bhomi",
//     "agent": "ne666",
//     "betPlacedType": 1,
//     "orderStatus": 1,
//     "smaId": 478611,
//     "cashout": null,
//     "sizeRemaining": 0,
//     "sizeMatched": 600,
//     "sizeLapsed": 0,
//     "sizeCancelled": 0,
//     "sizeVoided": 0,
//     "sizeTotal": 600,
//     "profitLoss": 600,
//     "liability": 318,
//     "isMicroBetting": false,
//     "sportName": "Cricket",
//     "marketBettingType": "ODDS",
//     "marketLineType": null,
//     "placed": false,
//     "read": false
//   }
// ]

//     // if (newUnplacedBets.length > 0) {
//     //   console.log(`🚀 Found ${newUnplacedBets.length} unplaced bet(s), triggering placement...`);
//     // //   await exports.loginToSite(newUnplacedBets);
//     // await exports.integratedBetfairOrder(newUnplacedBets);
//     //   await new Promise(r => setTimeout(r, 3000));
//     //   // Mark them as placed after successful automation
//     //   const finalBets = mergedBets.map(bet => ({
//     //     ...bet,
//     //     placed: newUnplacedBets.some(newBet => newBet.betId === bet.betId) ? true : bet.placed
//     //   }));

//     //   await fs.writeFile('bets.json', JSON.stringify(finalBets, null, 2));
//     //   console.log('✅ Placed bets marked as placed');
//     // }

//     if (fakeData.length > 0) {
//         for(let i=0;i<fakeData.length;i++){
//           const  {marketId, selectionId,side,sizeTotal} = fakeData[i];
//           await exports.integratedBetfairOrder({marketId, selectionId,side,sizeTotal}).then(response => console.log(response)).catch(err => console.error(err,"in ERR"));
//         }
//     }

//     res.status(200).send(mergedBets);
//   } catch (err) {
//     console.error('❌ Error in BetList:', err);
//     next(err);
//   }
// };

async function getSessionTokenFromFile() {
    try {
        const filePath = path.join(process.cwd(), "BetfairAuth.json");
        const fileContents = await fs.readFile(filePath, "utf-8");
        const { sessionToken } = JSON.parse(fileContents);
        if (!sessionToken) throw new Error("No session token found in auth.json");
        return sessionToken;
    } catch (err) {
        console.error("Failed to read session token from file:", err.message);
        throw err;
    }
}

exports.integratedBetfairLogin = async (req, res) => {
    try {
        const username = "u3613129050@gmail.com"; // replace
        const password = "bet365@123"; // replace

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultTimeout(60000); // increase timeout globally (slow VPN)
        page.setDefaultNavigationTimeout(60000);

        await page.goto("https://www.betfair.com/exchange/plus/", {
            waitUntil: "domcontentloaded", // faster + less likely to hang
        });
        // await page.goto("https://www.betfair.com/exchange/plus/", { waitUntil: "networkidle2" });

        // Function to continuously dismiss banner if it appears
        const dismissBanner = async () => {
            const banner = await page.$("#onetrust-banner-sdk, #onetrust-button-group-parent");
            if (banner) {
                console.log("Cookie banner detected — dismissing...");
                const btn = await page.$("#onetrust-reject-all-handler");
                if (btn) {
                    await page.evaluate((b) => b.click(), btn);
                    //   await page.waitForTimeout(500); // wait for banner to disappear
                    await new Promise(resolve => setTimeout(resolve, 100));
                    console.log("Banner dismissed.");
                }
            }
        };

        // Wait for username input & repeatedly check for banner
        await page.waitForSelector("#ssc-liu", { timeout: 20000 });
        await dismissBanner();

        // Type username char-by-char, checking banner in between
        for (const char of username) {
            await page.type("#ssc-liu", char, { delay: 100 });
            await dismissBanner();
        }

        // Type password char-by-char, checking banner in between
        for (const char of password) {
            await page.type("#ssc-lipw", char, { delay: 100 });
            await dismissBanner();
        }

        // Ensure login button is visible and clickable
        const loginButton = await page.$("#ssc-lis");
        if (!loginButton) throw new Error("Login button not found");
        await page.evaluate((btn) => btn.scrollIntoView({ block: "center" }), loginButton);

        // Retry clicking login button if necessary
        let clicked = false;
        for (let i = 0; i < 3; i++) {
            try {
                await page.evaluate((btn) => btn.click(), loginButton);
                clicked = true;
                break;
            } catch {
                console.log("Retrying login click...");
                // await page.waitForTimeout(500);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        if (!clicked) throw new Error("Failed to click login button");
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // // Wait for navigation
        // await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 50000 });
        // await new Promise(resolve => setTimeout(resolve, 500));
        //  await dismissBanner();
        try {
            await Promise.race([
                page.waitForSelector("#ssc-myacc", { timeout: 25000 }).catch(() => null),
                page.waitForSelector(".ssc-logout", { timeout: 25000 }).catch(() => null),
            ]);
            console.log("✅ Login successful (post-login element found).");
        } catch {
            console.warn("⚠️ Could not detect post-login element, continuing anyway...");
        }

        await dismissBanner(); // cleanup again if needed

        // Extract ssoid cookie
        const cookies = await page.cookies();
        await dismissBanner();
        const ssoidCookie = cookies.find((c) => c.name === "ssoid");
        await dismissBanner();
        const sessionToken = ssoidCookie?.value;

        await browser.close();

        if (!sessionToken) throw new Error("Failed to retrieve ssoid from cookies");

        await fs.writeFile("BetfairAuth.json", JSON.stringify({ sessionToken }, null, 2), "utf-8");
        console.log("Session token saved to auth.json");

        res.send({
            message: "Session token retrieved successfully",
            sessionToken,
        });
    } catch (err) {
        console.error("Puppeteer login error:", err.message);
        res.status(500).send("Failed to get session token");
    }
};

// exports.integratedBetfairOrder = async(req, res, next) => {
//     try {
//         const sessionToken = await getSessionTokenFromFile();
//         console.log(req,"req.bodies")
//         const {marketId, selectionId,side,sizeTotal} = req;

//         // 5️⃣ Place a mock order
//         const placeOrderUrl = "https://api.betfair.com/exchange/betting/rest/v1.0/placeOrders/";
//         const orderBody = {
//           marketId: marketId,
//           instructions: [
//             {
//               selectionId: selectionId,
//               side: side === 0 ? "LAY" : "BACK", // 0 for BACK, 1 for LAY
//               orderType: "LIMIT",
//               limitOrder: {
//                 size: sizeTotal/100, // stake
//                 price: 500,
//                 persistenceType: "LAPSE"
//               }
//             }
//           ],
//           customerRef: "mock-order-001"
//         };

//         // const orderBody = {
//         //     marketId: marketId, // the MATCH_ODDS market ID
//         //     instructions: [
//         //         {
//         //             selectionId: selectionId, // runner ID (home/draw/away)
//         //             side: "BACK",             // BACK or LAY
//         //             orderType: "MARKET_ON_CLOSE",
//         //             marketOnCloseOrder: {
//         //                 liability: 10.0         // total stake for LAY, ignored for BACK
//         //             }
//         //         }
//         //     ],
//         //     customerRef: "mock-market-on-close"
//         // };

//         const orderResponse = await fetch(placeOrderUrl, {
//             method: "POST",
//             headers: {
//                 "X-Application": appKey,
//                 "X-Authentication": sessionToken,
//                 "Content-Type": "application/json",
//                 Accept: "application/json"
//             },
//             body: JSON.stringify(orderBody)
//         });

//         const orderText = await orderResponse.text();
//         if (!orderResponse.ok) throw new Error(orderText);
//         const orderResult = JSON.parse(orderText);

//         // ✅ Return full flow result
//         res.send({
//             message: "Full flow completed successfully (mock order)",
//             event: targetEvent,
//             orderResult
//         });
//     } catch (err) {
//         console.error("Full flow error:", err.message);
//         res.status(500).send({ error: err.message });
//     }
// };



// import fs from "fs/promises";
// import fetcher from "../utils/fetcher.js";
// import { integratedBetfairOrder } from "./integratedBetfair.js";

// exports.integratedLotusBookBetList = async (req, res, next) => {
//   try {
//     const creds = await read("auth.json");
//     const apiUrl = `https://admin.lotusbook247.com/api/agency/${creds.name}/report/order-list-json?type=matched&sportId=4&marketType=MATCH_ODDS&providerId=-1&providerType=EXCHANGE&page=1&token=${creds.authorization}`;
    
//     const data = await fetcher(apiUrl, "GET");
//     const latestBets = data?.response?.result?.pageRows || [];

//     // Load existing file
//     let existingBets = [];
//     try {
//       const fileContent = await fs.readFile("bets.json", "utf8");
//       existingBets = JSON.parse(fileContent);
//     } catch (err) {
//       console.warn("No existing bets.json found, starting fresh.");
//     }

//     const existingMap = new Map(existingBets.map(b => [b.apolloBetId, b]));

//     // Merge with existing
//     const mergedBets = latestBets.map(bet => {
//       const existing = existingMap.get(bet.apolloBetId);
//       return {
//         ...bet,
//         placed: existing?.placed || false,
//         success: existing?.success ?? null, // can be true/false/null
//         read: existing?.read || false
//       };
//     });

//     // Find bets that are not yet placed
//     const unplacedBets = mergedBets.filter(bet => !bet.placed);

//     if (unplacedBets.length > 0) {
//       console.log(`🚀 Found ${unplacedBets.length} unplaced bet(s), placing on Betfair...`);
//     }

//     for (const bet of unplacedBets) {
//       try {
//         const result = await integratedBetfairOrder({
//           marketId: bet.marketId,
//           selectionId: bet.selectionId,
//           side: bet.side,
//           sizeTotal: bet.sizeTotal
//         });

//         // Update bet with result
//         bet.placed = true;
//         bet.success = result?.orderResult?.instructionReports?.every(r => r.status === "SUCCESS");

//         console.log(
//           `✅ Bet ${bet.apolloBetId} placed on Betfair: ${bet.success ? "SUCCESS" : "FAILURE"}`
//         );
//       } catch (err) {
//         bet.placed = true;
//         bet.success = false;
//         console.error(`❌ Failed to place bet ${bet.apolloBetId}:`, err.message);
//       }
//     }

//     // Save updated bets
//     await fs.writeFile("bets.json", JSON.stringify(mergedBets, null, 2));
//     console.log("✅ bets.json updated with placement results");

//     res.status(200).send(mergedBets);
//   } catch (err) {
//     console.error("❌ Error in BetList:", err);
//     if (typeof next === "function") return next(err);
//     res.status(500).send({ error: err.message });
//   }
// };


// import fs from "fs/promises";

exports.integratedLotusBookBetList = async (req, res, next) => {
  try {
    const creds = await read("auth.json");

    const apiUrl = `https://admin.lotusbook247.com/api/agency/${creds.name}/report/order-list-json?type=matched&sportId=4&marketType=MATCH_ODDS&providerId=-1&providerType=EXCHANGE&page=1&token=${creds.authorization}`;
    const data = await fetcher(apiUrl, "GET");

    const latestBets = data?.response?.result?.pageRows || [];
    console.log(`📥 Received ${latestBets.length} bets from API`);

    // 1️⃣ Load existing file
    let existingBets = [];
    try {
      const fileContent = await fs.readFile("bets.json", "utf8");
      existingBets = JSON.parse(fileContent);
    } catch {
      console.warn("⚠️ No existing bets.json found, starting fresh.");
    }

    // 2️⃣ Merge new bets into existing
    const existingMap = new Map(existingBets.map(b => [b.apolloBetId, b]));

    for (const bet of latestBets) {
      if (!existingMap.has(bet.apolloBetId)) {
        existingBets.push({
          ...bet,
          placed: false,   // default for new bets
          success: null,   // success will be true/false after placing
        });
        console.log(`➕ Added new bet: ${bet.apolloBetId}`);
      }
    }

    // 3️⃣ Save merged list back to file
    await fs.writeFile("bets.json", JSON.stringify(existingBets, null, 2));
    console.log(`✅ bets.json updated. Total bets stored: ${existingBets.length}`);

    // 4️⃣ Identify bets that are not yet placed
    const unplacedBets = existingBets.filter(b => !b.placed);

    for (const bet of unplacedBets) {
      try {
        const result = await integratedBetfairOrder({
          marketId: bet.marketId,
          selectionId: bet.selectionId,
          side: bet.side,
          sizeTotal: bet.sizeTotal
        });

        // Mark as placed regardless of success/failure
        bet.placed = true;
        bet.success = result?.status === "SUCCESS";

        console.log(
          `🎯 Bet ${bet.apolloBetId} => placed=${bet.placed}, success=${bet.success}`
        );
      } catch (err) {
        bet.placed = true;
        bet.success = false;
        console.error(`❌ Failed placing bet ${bet.apolloBetId}:`, err.message);
      }
    }

    // 5️⃣ Save again with updated placed/success flags
    await fs.writeFile("bets.json", JSON.stringify(existingBets, null, 2));
    console.log("✅ Updated placed/success flags in bets.json");

    res.status(200).send(existingBets);
  } catch (err) {
    console.error("❌ Error in BetList:", err);
    next(err);
  }
};



// Instead of req/res/next, make it a utility function
 async function integratedBetfairOrder({ marketId, selectionId, side, sizeTotal }) {
  const sessionToken = await getSessionTokenFromFile();

  const placeOrderUrl = "https://api.betfair.com/exchange/betting/rest/v1.0/placeOrders/";
  const orderBody = {
    marketId,
    instructions: [
      {
        selectionId,
        side: side === 0 ? "LAY" : "BACK",
        orderType: "LIMIT",
        limitOrder: {
          size: sizeTotal / 100,
          price: 500,
          persistenceType: "LAPSE"
        }
      }
    ],
    customerRef: `lotus-${Date.now()}`
  };

  const orderResponse = await fetch(placeOrderUrl, {
    method: "POST",
    headers: {
      "X-Application": appKey,
      "X-Authentication": sessionToken,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(orderBody)
  });

  const orderText = await orderResponse.text();
  if (!orderResponse.ok) throw new Error(orderText);

  return JSON.parse(orderText);
}
