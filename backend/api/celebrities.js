// api/celebrities.js (TEMP TEST)
export default function handler(req, res) {
    console.log("🔍 Celebrities endpoint hit!");
    res.status(200).json([
      { name: "Hardcoded John", shoeSize: 10 }
    ]);
  }