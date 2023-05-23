const {
    collection,
    serverTimestamp,
    addDoc,
    doc,
    getDoc,
  } = require("firebase/firestore");
  const puppeteer = require("puppeteer");
  const { db } = require("./firebase/config");
  
  const password = "@ahrk5CQdw6sM";
  const email = "ericricky200@gmail.com";
  
  const rand = (max) => Math.floor(Math.random() * max + 1);
  const categories = [
    { num: 3, category: "academic" },
    { num: 4, category: "article" },
    { num: 5, category: "transcription" },
    { num: 6, category: "others" },
  ];
  
  (async () => {
    console.log("running...");
    try {
      // fetching user
      const userDocRef = doc(db, "users", "XS1RK7XPkreilL0o8ZYzsk5fomw1");
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists) return console.log("User does not exit!!");
      const { displayName, createdAt: joined } = userSnapshot.data();
      console.log(displayName, joined);
  
      // ==== STARTING TO BROWSE
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
  
      await page.goto(`https://accountsplace.co.ke/login`);
      console.log(`loaded page!!`);
  
      //⛵⛵⛵⛵⛵⛵⛵ logging in ⛵⛵⛵⛵⛵⛵⛵
      console.log("<=========== logging in...");
      await page.waitForSelector("#email");
      await page.type("#email", email);
      await page.type("#password", password);
  
      const loginBtn = await page.$(
        "#wrapper > div.main-container > div > div > div > div.card.card-default > div.card-body > form > div:nth-child(4) > button"
      );
      await loginBtn.evaluate((b) => b.click());
      await page.waitForNavigation();
      const logo = await page.$(
        "#wrapper > div.header > nav > div > div.navbar-identity > a"
      );
      await logo.evaluate((l) => l.click());
      console.log("navigating to home");
      await page.waitForNavigation();
      console.log("logged in=============>");
  
      //⛵⛵⛵⛵⛵⛵⛵ Starting loop ⛵⛵⛵⛵⛵⛵⛵
      for (const { category, num } of categories) {
        console.log(`============= category ${category} =============`);
  
        await page.waitForSelector(
          `#wrapper > div.main-container > div > div:nth-child(1) > div > div:nth-child(${num}) > a`
        );
        const categoryBtn = await page.$(
          `#wrapper > div.main-container > div > div:nth-child(1) > div > div:nth-child(${num}) > a`
        );
        await categoryBtn.evaluate((b) => b.click());
  
        await page.waitForNavigation();
  
        await page.waitForSelector("#allListingList");
        console.log(`category ${category} loaded!"`);
  
        const listingHandles = await page.$$("#allListingList .item-list");
  
        for (const listingHandle of listingHandles) {
          const title = await page.evaluate(
            (el) =>
              el
                .querySelector("div > div.col-md-7.add-desc-box > div > h3 > a")
                ?.textContent.trim(),
            listingHandle
          );
          const link = await page.evaluate(
            (el) =>
              el.querySelector("div > div.col-md-7.add-desc-box > div > h3 > a")
                ?.href,
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
          const sellerId = "XS1RK7XPkreilL0o8ZYzsk5fomw1";
          const impressions = 0;
          const createdAt = serverTimestamp();
  
          const listing = {
            title,
            link,
            description,
            rating,
            category,
            currency,
            price,
            impressions,
            sellerId,
            createdAt,
          };
          listings.push(listing);
          console.log("done-");
        }
  
        if (num !== 6) {
          const logo = await page.$(
            "#wrapper > div.header > nav > div > div.navbar-identity > a"
          );
          await logo.evaluate((l) => l.click());
          console.log("navigating to home");
          await page.waitForNavigation();
        }
  
        console.log(
          `============= total of ${listings.length} listings =============`
        );
      }
  
      listings.forEach((l) => console.log(l.link));
  
      // ⛵⛵⛵⛵⛵⛵⛵ Adding to Firebase + phone ⛵⛵⛵⛵⛵⛵⛵
      for (const listing of listings) {
        if (!listing.link) return console.log("listing has no link!");
  
        console.log(`Routing to ${listing.link}`);
        await page.goto(listing.link);
        console.log("loadeddddd page============");
        await page.waitForSelector(
          "#wrapper > div.main-container > div:nth-child(2) > div > div.col-md-3.page-sidebar-right > aside > div.card.card-user-info.sidebar-card > div.card-content > div.ev-action > a.btn.btn-info.btn-block"
        );
  
        const phoneBtn = await page.$(
          "#wrapper > div.main-container > div:nth-child(2) > div > div.col-md-3.page-sidebar-right > aside > div.card.card-user-info.sidebar-card > div.card-content > div.ev-action > a.btn.btn-info.btn-block"
        );
        const phone = await phoneBtn.evaluate((p) => p.href.split(":")[1]);
  
        const sellerInfo = {
          phone,
          email: "",
          displayName,
          joined,
        };
        const list = listings.filter((l) => l.link === listing.link)[0];
  
        const {
          title,
          category,
          description,
          createdAt,
          currency,
          price,
          impressions,
          rating,
          sellerId,
        } = list;
  
        const payload = {
          title,
          category,
          description,
          createdAt,
          currency,
          price,
          impressions,
          rating,
          sellerId,
          sellerInfo,
        };
        console.log(payload);
        await addDoc(colRef, payload);
  
        console.log("PHONE====>", phone);
        console.log("=============================================");
      }
  
      console.log(`==== Added    ${listings.length} items to firebase ===`);
    } catch (error) {
      console.log("Something went wrong!!", error);
    }
  })();
  