export default async function handler(req, res) {
    console.log("📡 Called /api/celebrities");
  
    if (req.method === 'GET') {
      return res.status(200).json([{ name: 'Hardcoded John', shoeSize: 10 }]);
    }
  
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  