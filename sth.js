(async () => {
  let i = 0;
  while (i < 4) {
    console.log("====== start");
    if (i !== 0) {
      await new Promise((r) => setTimeout(r, 2000));
      console.log("clicking btn=====");
    }
    console.log(i);

    console.log("===== end");

    i++;
  }
})();
