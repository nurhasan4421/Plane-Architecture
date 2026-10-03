import fs from "fs";

async function fetchIds() {
  const photoIds = [];
  let page = 1;
  while (photoIds.length < 500 && page <= 30) {
    try {
      const res = await fetch(`https://unsplash.com/napi/search/photos?query=architecture&per_page=30&page=${page}`);
      const data = await res.json();
      if (!data.results || data.results.length === 0) break;
      for (const item of data.results) {
        if (item.urls && item.urls.raw) {
          const match = item.urls.raw.match(/unsplash\.com\/(photo-[a-zA-Z0-9-]+)/);
          if (match) {
            photoIds.push(match[1]);
          } else {
            const premiumMatch = item.urls.raw.match(/unsplash\.com\/(premium_photo-[a-zA-Z0-9-]+)/);
            if (premiumMatch) {
              photoIds.push(premiumMatch[1]);
            }
          }
        }
      }
      console.log(`Fetched page ${page}, total valid ids: ${photoIds.length}`);
      page++;
    } catch (e) {
      console.error(e);
      break;
    }
  }

  fs.writeFileSync("scripts/real-unsplash-ids.json", JSON.stringify(photoIds, null, 2));
  console.log("Done");
}
fetchIds();
