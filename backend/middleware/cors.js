export default function handleCors(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return false;
    }
  
    return true;
  }
  