import fs from "node:fs";

const path = "docs/configuration.md";
let text = fs.readFileSync(path, "utf8");

if (!text.includes("| portrait_pairing")) {
  const anchor = "| image_fit_portrait               | How to adjust a media item in portrait mode to fit the available space (cover or contain).             | contain    |\n";
  if (!text.includes(anchor)) throw new Error("image_fit_portrait documentation anchor not found");
  text = text.replace(
    anchor,
    anchor +
      "| portrait_pairing                 | Display two portrait images side-by-side when possible. Currently supported for Home Assistant Media Source images. Pair selection follows `media_order`: adjacent pairs for `sorted`, random partners for `random`, and deterministic partners for `random_but_synced`. | false |\n" +
      "| portrait_pairing_fit             | How portrait images in a pair fill their half of the screen (`cover` or `contain`).                    | contain    |\n"
  );
}

const exampleAnchor = "  image_fit_landscape: cover\n";
if (!text.includes("  portrait_pairing: true\n")) {
  if (!text.includes(exampleAnchor)) throw new Error("extended example anchor not found");
  text = text.replace(
    exampleAnchor,
    exampleAnchor + "  portrait_pairing: true\n  portrait_pairing_fit: cover\n"
  );
}

fs.writeFileSync(path, text);
console.log("Applied portrait pairing documentation updates");
