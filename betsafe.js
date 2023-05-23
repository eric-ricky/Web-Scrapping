const puppeteer = require("puppeteer");
const card = ["0710752939", "0757430866", "0769108363", "0769414800"];
const cards = [
  "0710752939",
  "0716048460",
  "0768244565",
  "0769595742",
  "0768562998",
];
const code = "22238KM";

const isBonus = true;

const logout = async (page) => {
  const logoutBtn = await page.$(
    "#panelMenu > div > div > div.userSubMenu > ul > li:nth-child(9) > a"
  );
  await logoutBtn.evaluate((b) => b.click());
  await page.waitForNavigation();
};

async function start() {
  console.log("started betsafe");

  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
    });
    const page = await browser.newPage();

    console.log("launched!!");

    //change the defualt wait and navigation time
    await page.setDefaultTimeout(1000000);
    await page.setDefaultNavigationTimeout(1000000);

    for (const [i, card] of cards.entries()) {
      await page.goto("https://www.betsafe.co.ke/");
      console.log(`loaded page!!`);

      //========================= logging in
      console.log("logging in...");
      await page.waitForSelector(
        "#webHeader > div.login.guest > a.btnLoginPopup"
      );
      const loginModalBtn = await page.$(
        "#webHeader > div.login.guest > a.btnLoginPopup"
      );
      await loginModalBtn.evaluate((b) => b.click());

      await page.type("#w_w_cLogin_ctrlLogin_Username", `${card}`);
      await page.type("#w_w_cLogin_ctrlLogin_Password", `12345`);

      const loginBtn = await page.$("#w_w_cLogin_ctrlLogin_lnkBtnLogin");
      await loginBtn.evaluate((b) => b.click());
      await page.waitForNavigation();
      console.log("logged in");

      // ================================ loading betslip
      console.log("loading betslip...");
      await Promise.all([
        page.waitForSelector(
          "#panelMenu > div > div > div.userSubMenu > ul > li:nth-child(9) > a"
        ),
        page.waitForSelector("#w_w_ra_cCoupon_lnkLoadPrenotazione"),
      ]);
      await page.type("#w_w_ra_cCoupon_txtPrenotatore", `${code}`);
      const loadslipBtn = await page.$(
        "#w_w_ra_cCoupon_lnkLoadPrenotazione#w_w_ra_cCoupon_lnkLoadPrenotazione"
      );
      await loadslipBtn.evaluate((b) => b.click());
      await page.waitForSelector("#w_w_ra_cCoupon_lnkAvanti");
      console.log("betslip loaded");

      //==================================== placing bet
      console.log("placing bet...");
      if (isBonus) {
        // ===BONUS
        console.log("using bonus..");
        console.log("waiting for page reload...");
        await page.goto("https://www.betsafe.co.ke/");
        console.log("page loaded");
        const bonusBtn = await page.$(
          "#w_w_ra_cCoupon_lwFreeBet_ctrl0_radioFreeBet"
        );
        console.log("bonusBtn: ", bonusBtn);
        if (!bonusBtn) {
          //==================================== logging out
          console.log("logging out...");
          await logout(page);
          console.log("logged out");

          console.log(`--------- USER ${i + 1} END -----------`);

          continue;
        }
        await bonusBtn.evaluate((b) => {
          b?.click();
          console.log("bonus btn clicked~~");
        });
      } else {
        // === CASH
        console.log("using cash..");
        await page.waitForSelector("#w_w_ra_cCoupon_txtImporto");

        await page.evaluate(() => {
          document.querySelector("#w_w_ra_cCoupon_txtImporto").value = 49;
        });
      }
      const submitBtn = await page.$("#w_w_ra_cCoupon_lnkAvanti");
      console.log("submitBtn: ", submitBtn);
      await submitBtn.evaluate((b) => {
        b?.click();
        console.log("submit btn clicked~~");
      });

      await page.waitForSelector("#w_w_ra_cCoupon_lnkConferma");
      const placeBetBtn = await page.$("#w_w_ra_cCoupon_lnkConferma");
      console.log("placeBetBtn: ", placeBetBtn);
      // await placeBetBtn.evaluate((b) => b?.click());

      //==================================== logging out
      console.log("logging out...");
      await logout(page);
      console.log("logged out");

      console.log(`--------- USER ${i + 1} END -----------`);
    }

    console.log("============COMPLETED SUCCESSFULLY");
  } catch (error) {
    console.log("Something went wrong", error);
  }
}

start();
