const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  console.log("runnig...");
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
    });
    const page = await browser.newPage();
    await page.goto(
      "https://www.amazon.com/s?bbn=16225007011&rh=n%3A16225007011%2Cn%3A13896617011&dc&fst=as%3Aoff&pd_rd_r=f1a25667-3c32-4dab-85b8-0932ed498cef&pd_rd_w=8jK1c&pd_rd_wg=nAYk0&pf_rd_p=5b7fc375-ab40-4cc0-8c62-01d4de8b648d&pf_rd_r=88H4A8W2GHQJHTZXEG8W&qid=1602294815&rnid=16225007011&ref=pd_gw_unk"
    );

    let items = [];

    const productsHandles = await page.$$(
      ".s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
    );

    for (const productHandle of productsHandles) {
      const title = await page.evaluate(
        (el) => el.querySelector("h2 > a > span")?.textContent,
        productHandle
      );

      const price = await page.evaluate(
        (el) => el.querySelector(".a-price > .a-offscreen")?.textContent,
        productHandle
      );
      const img = await page.evaluate(
        (el) => el.querySelector(".s-image")?.getAttribute("src"),
        productHandle
      );

      if (title && img && price) {
        const data = {
          title,
          img,
          price,
        };
        items.push(data);

        fs.appendFile("products.csv", `${title},${price},${img}\n`, (err) => {
          if (err) throw err;
          console.log("Saved to products.csv!");
        });
      }
    }

    console.log(items);
  } catch (error) {
    console.log("Something went wrong!!", error);
  }
})();
