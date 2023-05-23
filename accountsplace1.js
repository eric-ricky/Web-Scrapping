const { collection, serverTimestamp, addDoc } = require("firebase/firestore");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { db } = require("./firebase/config");

const rand = (max) => Math.floor(Math.random() * max + 1);
const categories = ["Transcription", "Academic", "Article", "Other"];

const pages = [1, 2];

(async () => {
  console.log("running...");
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
    });
    console.log("launched!!");

    const page = await browser.newPage();
    console.log("opened page!");

    //change the defualt wait and navigation time
    await page.setDefaultTimeout(1000000);
    await page.setDefaultNavigationTimeout(1000000);

    let listings = [];
    const colRef = collection(db, "listings");

    for (const p of pages) {
      console.log(`============= page ${p} =============`);
      p === 1
        ? await page.goto(`https://accountsplace.co.ke/`)
        : await page.goto(`https://accountsplace.co.ke/?page=${p}`);

      console.log(`Page ${p} loaded!"`);

      const listingHandles = await page.$$("#allListingList .item-list");

      for (const listingHandle of listingHandles) {
        const title = await page.evaluate(
          (el) =>
            el
              .querySelector("div > div.col-md-7.add-desc-box > div > h3 > a")
              ?.textContent.trim(),
          listingHandle
        );
        const description = await page.evaluate(
          (el) =>
            el
              .querySelector(
                "div > div.col-md-2.no-padding.photobox > div > h3"
              )
              ?.textContent.trim(),
          listingHandle
        );
        const rating = await page.evaluate(
          (el) =>
            el
              .querySelector(
                "div > div.col-md-2.no-padding.photobox > div > h4:nth-child(3)"
              )
              ?.textContent.trim()
              .split(":")[1],
          listingHandle
        );
        const price = await page.evaluate(
          (el) =>
            el
              .querySelector("div > div.col-md-3.text-right.price-box > h2")
              ?.textContent.trim()
              .split(" ")[1],
          listingHandle
        );
        const currency = await page.evaluate(
          (el) =>
            el
              .querySelector("div > div.col-md-3.text-right.price-box > h2")
              ?.textContent.trim()
              .split(" ")[0],
          listingHandle
        );
        const sellerId = "4Q9lITKHJ1TAZ71m2SyeFUMgDdS2";
        const category = categories[rand(3)];
        const sellerInfo = {
          phone: "0710293845",
          email: "james@gmail.com",
        };
        const screenshots = [
          "https://firebasestorage.googleapis.com/v0/b/freelancers-project.appspot.com/o/Images%2FListings%2FScreenshots%2F1669148466780-bm2.JPG?alt=media&token=f43190d0-597d-46ce-9fc1-6bdd4104caa2",
          "https://firebasestorage.googleapis.com/v0/b/freelancers-project.appspot.com/o/Images%2FListings%2FScreenshots%2F1669148478630-bm1.JPG?alt=media&token=e28c85c1-4f5e-4ec1-9669-0374b30438f3",
        ];
        const impressions = 0;
        const createdAt = serverTimestamp();

        const listing = {
          title,
          description,
          rating,
          category,
          currency,
          price,
          screenshots,
          impressions,
          sellerId,
          sellerInfo,
          createdAt,
        };
        listings.push(listing);

        // adding to firebase
        await addDoc(colRef, listing);
      }

      console.log(listings.length);
    }

    console.log(`==== Added    ${listings.length} items to firebase ===`);
  } catch (error) {
    console.log("Something went wrong!!", error);
  }
})();
