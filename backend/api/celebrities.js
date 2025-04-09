export default async function handler(req, res) {
    console.log("🧪 Test: /api/celebrities called");
  
    try {
      res.status(200).json({ status: "✅ Function works, DB skipped" });
    } catch (err) {
      console.error("💥 Unexpected error:", err);
      res.status(500).json({ error: "Internal error" });
    }
  }
  