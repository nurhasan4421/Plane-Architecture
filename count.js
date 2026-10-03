const fs = require("fs");
const content = fs.readFileSync("src/lib/projects-data.ts", "utf-8");
// Since it's a TS file with export, we can evaluate it roughly or use regex to count subcategory occurrences.
// Or better yet, we can use ts-node if available, or just parse the JSON roughly.
// Actually, let's just regex for 'subcategory: "(.*?)"'

const matches = [...content.matchAll(/subcategory:\s*"([^"]+)"/g)];
const counts = {};
for (const match of matches) {
  counts[match[1]] = (counts[match[1]] || 0) + 1;
}
console.log("Subcategory counts:");
console.table(counts);

const catMatches = [...content.matchAll(/category:\s*"([^"]+)"/g)];
const catCounts = {};
for (const match of catMatches) {
  catCounts[match[1]] = (catCounts[match[1]] || 0) + 1;
}
console.log("\nCategory counts:");
console.table(catCounts);

console.log("\nTotal projects: " + matches.length);
