import express from 'express'
import Link from '../Models/Link.js'
import { customAlphabet } from "nanoid";


const router=express.Router()

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nano = customAlphabet(alphabet, 7);

const validCode=(code)=>{
    return /^[A-Za-z0-9]{6,8}$/.test(code);
}


router.post("/links", async (req, res) => {
  try {
    const { targetLink, code,  } = req.body;

    if (!targetLink) return res.status(400).json({ error: "targetLink is required" });

    if (code && !validCode(code)) {
      return res.status(400).json({ error: "Invalid code format" });
    }

    if (code) {
      const existingLink = await Link.findOne({ code });
      if (existingLink) {
        return res.status(409).json({ error: "Custom code already exists. Please enter a different code." });
      }
    }

    const shortCode = code || nano();

    const link = await Link.create({ code: shortCode, targetLink });
    const tinyLink = `${process.env.PUBLIC_DOMAIN || `http://localhost:${process.env.PORT || 5000}`}/${shortCode}`;

    console.log("Created link:", link);
    return res.status(201).json({ code: shortCode, tinyLink, targetLink: link.targetLink });
  } catch (err) {
    console.error("POST /api/links error:", err);
    if (err.code === 11000) {
      return res.status(409).json({ error: "Code already exists" });
    }
    return res.status(500).json({ error: "Server error" });
  }
});

router.get('/links',async(req,res)=>{
  try {
    const links = await Link.find().sort({ createdAt: -1 }).lean();
        return res.json({ links });

  } catch (error) {
    console.error("Get all links error:", error);
    return res.status(500).json({ error: "Failed to fetch links" });
  }

})

router.get('/links/:code',async(req,res)=>{
    const {code}=req.params;
    if(!code) return res.status(400).json({error:"Code is required"})
    try {
        const link=await Link.findOne({code:code})
        if(!link) return res.status(404).json({error:"Link not found"}) 
        return res.json({
            code:link.code,
            targetLink:link.targetLink,
            clicks:link.clicks,
            createdAt:link.createdAt,
            lastClickedAt:link.lastClickedAt
        })
    } catch (error) {
        console.error("GET /api/links/:code error:", error);
        return res.status(500).json({error:"Server error"})
    } 
})


router.delete('/links/:code', async (req, res) => {
  const { code } = req.params; 
  if (!code) return res.status(400).json({ error: "Code is required" });

  try {
    const deleted = await Link.findOneAndDelete({ code: code });
    if (!deleted) return res.status(404).json({ error: "Link not found" });

    return res.status(200).json({ success: true, deleted: { code: deleted.code, targetLink: deleted.targetLink } });
  } catch (err) {
    console.error("DELETE /api/links/:code error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});


router.get('/:code', async (req, res) => {
  const { code } = req.params;
  if (!code) return res.status(400).json({ error: "Code is required" });

  try {
    const link = await Link.findOneAndUpdate(
      { code: code },
      { $inc: { clicks: 1 }, $set: { lastClickedAt: new Date() } },
      { new: true }
    );

    if (!link) return res.status(404).json({ error: "Link not found" });
    return res.redirect(302, link.targetLink);

  } catch (error) {
    console.error("GET /:code redirect error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});





export default router
