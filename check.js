const fs = require("fs");
const content = fs.readFileSync("src/lib/projects-data.ts", "utf-8");
// Extract Unsplash IDs from URLs like https://images.unsplash.com/ID?...
const urls = content.match(/https:\/\/images\.unsplash\.com\/[a-zA-Z0-9_-]+/g) || [];
const uniqueUrls = new Set(urls);
console.log(`Total URLs found: ${urls.length}`);
console.log(`Unique URLs found: ${uniqueUrls.size}`);
if (urls.length !== uniqueUrls.size) {
  console.log("DUPLICATES FOUND!");
  const counts = {};
  for (const url of urls) {
    counts[url] = (counts[url] || 0) + 1;
    if (counts[url] > 1) {
      console.log(`Duplicate: ${url}`);
    }
  }
} else {
  console.log("No duplicate Unsplash URLs found.");
}
