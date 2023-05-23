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

    await page.goto(
      `https://www.jumia.co.ke/kings-collection/?q=shoes+for+men`
    );
    console.log(`loaded page!!`);

    let products = [];

    const productsHandles = await page.$$(
      "#jm > main > div.aim.row.-pbm > div.-pvs.col12 > section > div > article"
    );

    let i = 0;
    for (const productHandle of productsHandles) {
      console.log(`=========== Iteration ${i}`);
      const image = await page.evaluate(
        (el) =>
          el.querySelector(
            "#jm > main > div.aim.row.-pbm > div.-pvs.col12 > section > div > article > a > div.img-c > img"
          )?.src,
        productHandle
      );

      const name = await page.evaluate(
        (el) =>
          el.querySelector(
            "#jm > main > div.aim.row.-pbm > div.-pvs.col12 > section > div > article > a > div.info > h3"
          )?.textContent,
        productHandle
      );

      const price = await page.evaluate(
        (el) =>
          el.querySelector(
            "#jm > main > div.aim.row.-pbm > div.-pvs.col12 > section > div > article > a > div.info > div"
          )?.textContent,
        productHandle
      );

      console.log("image ==>", image);
      console.log("name ==>", name);
      console.log("price ==>", price);

      if (image && name && price) {
        const numPrice = +price.split(" ")[1].split(",").join("");
        const salesPrice = (numPrice - 0.2 * numPrice).toFixed(2);
        const category = slugify("Casual Shoes");
        const brand = slugify("Casual Shoes");
        const slug = slugify(name);

        const product = {
          name,
          image,
          slug,
          category,
          brand,
          price,
          salesPrice,
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

    console.log("Products ===>", products);
    console.log("PRODUCTS ====>", products.length);
  } catch (error) {
    console.log("Something went wrong!!", error);
  }
})();
