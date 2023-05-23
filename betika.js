const puppeteer = require("puppeteer");

const nums = [
  "0746933464",
  "0769296863",
  "0795007857",
  "0794278007",
  "0792766158",
  "0791891870",
  "0769575138",
  "0796398934",
  "0769636589",
  "0799248490",
  "0745837240",
  "0792217033",
  "0768592295",
  "0790668681",
  "0768038521",
  "0798115135",
  "0793800662",
  "0796459880",
  "0112245079",
  "0757193879",
  "0705376293",
  "0796667107",
  "0792116841",
  "0743755245",
  "0757452753",
  "0792219837",
  "0759247183",
  "0795079201",
  "0758508308",
  "0792749367",
  "0759245546",
  "0794613391",
  "0793475399",
  "0792512729",
  "0796128340",
  "0795202354",
  "0796369461",
  "0793037015",
  "0797854539",
  "0792120367",
  "0799687933",
  "0757430866",
  "0706594254",
];

// "0795202354",
// "0796369461",
// "0793037015",
// "0797854539",
// "0792120367",
// "0799687933",
const nums2 = ["0757430866", "0706594254"];
const code = "mh23rb";
// https://www.betsafe.co.ke/

async function start() {
  console.log("started");

  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
    });
    console.log("launched!!");
    const page = await browser.newPage();

    //change the defualt wait time
    await page.setDefaultTimeout(1000000);

    //change the defualt naviagation wait time
    await page.setDefaultNavigationTimeout(1000000);

    for (const [i, num] of nums.entries()) {
      await page.goto("https://www.betika.com/en-ke/login?next=%2F");
      console.log(`loaded page!!`);

      console.log("logging in...");
      await Promise.all([
        page.waitForSelector(
          "div.input__container.session__form__input.session__form__phone > input"
        ),
        page.waitForSelector(
          "div.session__form > div.session__form__button__container > button"
        ),
      ]);
      await page.type(
        "div.input__container.session__form__input.session__form__phone > input",
        `${num}`
      );
      await page.type(
        "div.session__form > div.session__form__password__container > div > input",
        `12345`
      );
      await Promise.all([
        page.click(
          "div.session__form > div.session__form__button__container > button"
        ),
        page.waitForNavigation(),
      ]);
      console.log(`logged in!!`);

      console.log("loading slip...");
      await page.goto("https://www.betika.com/en-ke/betslip");
      console.log(`loaded page!!`);

      //  await page.waitForTimeout(5000);

      // if (i === 0) {
      console.log(`typing code...`);
      await Promise.all([
        page.waitForSelector(
          "div.betslip > div > div > div:nth-child(3) > div > input"
        ),
        page.waitForSelector(
          "div.betslip > div > div > div:nth-child(3) > div > button"
        ),
      ]);
      await page.type(
        "div.betslip > div > div > div:nth-child(3) > div > input",
        `${code}`
      );
      await page.click(
        "div.betslip > div > div > div:nth-child(3) > div > button"
      );
      console.log("loaded code!!");

      // await page.waitForTimeout(5000);

      // console.log("applying bonus...");
      // await page.goto("https://www.betika.com/en-ke/freebets");
      // await page.waitForTimeout(5000);

      // await page.evaluate(() => {
      //   document
      //     .querySelector(
      //       "body > div.app > main > div > div.mobile-router_view-container > div > div.freebets > div > div > div:nth-child(2) > div > div > div.promo__list__rewards__footer > button"
      //     )
      //     .click();
      // });
      // console.log("applied bonus!!!");

      // console.log("back to betslip..");
      // await page.goto("https://www.betika.com/en-ke/betslip");
      // console.log(`loaded page!!`);

      // await page.waitForTimeout(5000);

      // console.log("clicking submit...");
      // await page.evaluate(() => {
      //   document
      //     .querySelector(
      //       "body > div.app > main > div > div.mobile-router_view-container > div > div.betslip > div.betslip__details > div > div.betslip__details__buttons > button"
      //     )
      //     .click();
      // });
      // console.log("submitted!!");

      // clicking humbergur btn
      console.log("logging out...");
      await page.waitForSelector(
        "body > div.app > div:nth-child(5) > div > div > div:nth-child(4) > div.account__section > button"
      );
      const button = await page.$(
        "body > div.app > div:nth-child(5) > div > div > div:nth-child(4) > div.account__section > button"
      );

      await button.evaluate((b) => b.click());

      // clicking logout btn
      //   const text = await page.evaluate(() => {
      //     document
      //       .querySelector(
      //         "body > div.app > div:nth-child(5) > div > div > div:nth-child(4) > div.account__section > button"
      //       )
      //       .click();

      //     return "logging out...!!";
      //   });
      //   console.log(!!text ? `text ${text}` : "null");

      console.log("loged out!!");
      console.log(`--------- USER ${i + 1} END -----------`);
    }

    // await page.goto("https://www.betika.com/en-ke/login?next=%2F");
    console.log("END!!");

    // await page.screenshot({ path: "verbit.png" });

    // await browser.close();
  } catch (error) {
    console.log("something went wrong", error);
  }
}

start();
