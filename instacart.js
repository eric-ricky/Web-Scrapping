import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { launch } from "puppeteer";
import db from "./firebase/config.js";

const slugify = (letter) => letter.toLowerCase().split(" ").join("-");

const colRef = collection(db, "products");

(async () => {
  console.log("running...");
  try {
    // ==== STARTING TO BROWSE
    const browser = await launch({
      headless: false,
      defaultViewport: false,
    });
    console.log("Browser Launched!!");
    const page = await browser.newPage();
    console.log("opened page!");

    //change the defualt wait and navigation time
    page.setDefaultTimeout(1000000);
    page.setDefaultNavigationTimeout(1000000);

    await page.goto(`https://www.instacart.com/store/sprouts/storefront`);
    console.log(`loaded page!!`);

    let products = [];

    // SELECT NEXT BTN
    // await page.waitForSelector(
    //   "#store-wrapper > div > div:nth-child(2) > div.css-1u2t8o9 > div.css-o7y5g8 > div > div:nth-child(2) > button"
    // );
    // const button = await page.$(
    //   "#store-wrapper > div > div:nth-child(2) > div.css-1u2t8o9 > div.css-o7y5g8 > div > div:nth-child(2) > button"
    // );

    let j = 0;

    // while (j < 4) {
    //   console.log("WHILE J ==========", j);

    //   if (j !== 0) {
    //     await button.evaluate((b) => b.click());

    //     await new Promise((r) => setTimeout(r, 5000));
    //   }

    const productsHandles = await page.$$(
      "#store-wrapper > div > div:nth-child(10) > div:nth-child(2) > div > div > ul > div"
    );

    let i = 0;
    for (const productHandle of productsHandles) {
      console.log(`=========== Iteration ${i}`);
      const image = await page.evaluate(
        (el) =>
          el
            .querySelector(
              "li > div > div > div > a > div > div > div > div > img"
            )
            ?.getAttribute("srcset"),
        productHandle
      );

      const name = await page.evaluate(
        (el) =>
          el.querySelector("li > div > div > div > a > div:nth-child(2) > h3")
            ?.textContent,
        productHandle
      );

      const price = await page.evaluate(
        (el) =>
          el.querySelector(
            "li > div > div > div > a > div:nth-child(2) > div.css-1abd9id-ItemBCardDetailsSection > div > div.css-1q578vm-PriceIa > span.screen-reader-only"
          )?.textContent,
        productHandle
      );

      const units = await page.evaluate(
        (el) =>
          el.querySelector(
            "li > div > div > div > a > div:nth-child(2) > div.css-1301wpr-Size > div"
          )?.textContent || "",
        productHandle
      );

      console.log("image ==>", image?.split(":")[0]);
      console.log("name ==>", name);
      console.log("price ==>", price);

      if (image && name && price) {
        const productPrice = +price.split("$")[1];
        const currency = "$";
        const salesPrice = (productPrice - 0.2 * productPrice).toFixed(2);
        const category = slugify("Dairy");
        const slug = slugify(name);
        const description = `${name} is a recipe ready. Our family farmers loves ${name} and are passionate about creating a healthier world through organic food and farming.`;

        const product = {
          name,
          image,
          slug,
          category,
          price: productPrice,
          salesPrice,
          currency,
          units,
          description,
          countInStock: 50,
          createdAt: serverTimestamp(),
        };

        // adding product to firestore
        await addDoc(colRef, product);

        products.push(product);
      }
      console.log("=== end");
      i++;
    }

    // console.log("===END WHILE");

    //   j++;
    // }

    console.log("PRODUCTS ====>", products.length);
  } catch (error) {
    console.log("Something went wrong!!", error);
  }
})();
