import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from 'resend';
import twilio from 'twilio';

// Twilio and Resend setup - use null check to avoid crashing if env vars are missing
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

let twilioClient: any = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Global in-memory store for mock products
const mockProducts = Array.from({ length: 45 }, (_, i) => ({
  _id: `prod-${i + 1}`,
  category: ['Industrial Machinery', 'Raw Materials', 'Chemicals', 'Electronics'][i % 4],
  isGstVerified: i % 3 === 0,
  postedTimeAgo: `${(i % 24) + 1} hours ago`,
  imageUrl: `https://placehold.co/400x300/e2e8f0/475569?text=Product+${i + 1}`,
  title: `High Quality Industrial Product ${i + 1}`,
  location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'][i % 4],
  quantity: `${(i + 1) * 10} Metric Tons`,
  description: `This is a high-quality industrial product ${i + 1} suitable for various manufacturing processes. Supplied directly by verified manufacturers on the Made in India Hub.`,
  buyerName: `User ${i + 1}`,
  companyName: `Company ${i + 1} Pvt Ltd`,
  phone: `+91 98765 432${(i % 10).toString().padStart(2, '0')}`,
  email: `contact${i + 1}@company.com`,
  deliveryAddress: `Industrial Estate ${i + 1}, Sector ${i % 10}, India`
}));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/tenders/sync-cppp-gem", (req, res) => {
    // Mocking successful response
    res.json({
      success: true,
      tenders: [
        {
          id: "TND-12345",
          title: "Procurement of Heavy-Duty 33kV Electrical Step-Down Transformers",
          source: "CPPP",
          value: "1.85 CR",
          location: "Nagpur / Pune, MH",
          closingDate: "28-Aug-2026 05:00 PM"
        },
        {
          id: "TND-12346",
          title: "Supply, Commissioning and 3-Year Onsite AMC of Cloud-Ready Rack Server",
          source: "GeM",
          value: "92.5 LAKHS",
          location: "New Delhi, DL",
          closingDate: "02-Sep-2026 03:30 PM"
        }
      ]
    });
  });

  app.get("/api/products", (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const items = mockProducts.slice(startIndex, endIndex);

    res.json({
      items,
      totalPages: Math.ceil(mockProducts.length / limit),
      currentPage: page,
      totalItems: mockProducts.length
    });
  });

  app.post("/api/products", (req, res) => {
    const newReq = req.body;
    const newProduct = {
      _id: `prod-${Date.now()}`,
      category: newReq.category || 'Industrial Machinery',
      isGstVerified: newReq.is_gst_verified || false,
      postedTimeAgo: 'Just Now',
      imageUrl: newReq.image_url || 'https://placehold.co/400x300/e2e8f0/475569?text=New+Sell+Offer',
      title: newReq.title,
      location: newReq.location,
      quantity: newReq.quantity,
      description: newReq.description,
      buyerName: newReq.seller_name || 'Verified Seller',
      companyName: newReq.seller_company || 'N/A',
      phone: newReq.seller_phone || 'N/A',
      email: newReq.seller_email || 'N/A',
      deliveryAddress: newReq.location
    };
        
    // Add to the beginning of the list
    mockProducts.unshift(newProduct);
        
    res.json({ success: true, item: newProduct });
  });

  app.post("/api/requirements", (req, res) => {
    const newReq = req.body;
    const newProduct = {
      _id: `prod-${Date.now()}`,
      category: newReq.category || 'Industrial Machinery',
      isGstVerified: true,
      postedTimeAgo: 'Just Now',
      imageUrl: newReq.image_url || 'https://placehold.co/400x300/e2e8f0/475569?text=New+Requirement',
      title: newReq.title,
      location: newReq.location,
      quantity: newReq.quantity,
      description: newReq.description,
      buyerName: newReq.buyer_name || 'Verified Buyer',
      companyName: newReq.buyer_company || 'N/A',
      phone: newReq.buyer_phone || 'N/A',
      email: newReq.buyer_email || 'N/A',
      deliveryAddress: newReq.location
    };
    
    // Add to the beginning of the list
    mockProducts.unshift(newProduct);
    
    res.json({ success: true, item: newProduct });
  });

  app.post("/api/notify-registration", async (req, res) => {
    const { fullName, email, phone, role, companyName, gstNumber } = req.body;
    
    if (!resend) {
      console.log('Mock Registration Email Triggered:', req.body);
      return res.status(200).json({ success: true, message: 'Mock email sent (Missing RESEND_API_KEY)' });
    }

    try {
      const data = await resend.emails.send({
        from: 'Made in India Directory <notifications@madeinindia.directory>',
        to: [process.env.ADMIN_EMAIL || 'admin@madeinindia.directory'],
        subject: `🚨 New User Registration: ${fullName} (${role?.toUpperCase() || 'USER'})`,
        html: `
          <h2>New User Registration Intimation</h2>
          <p>A new user has registered on <strong>https://www.madeinindia.directory/</strong>.</p>
          <hr />
          <ul>
            <li><strong>Full Name:</strong> ${fullName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone Number:</strong> ${phone}</li>
            <li><strong>Account Type / Role:</strong> ${role}</li>
            <li><strong>Company Name:</strong> ${companyName || 'N/A'}</li>
            <li><strong>GST Number:</strong> ${gstNumber || 'N/A'}</li>
          </ul>
          <hr />
          <p><em>Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</em></p>
        `
      });

      return res.status(200).json({ success: true, id: data?.id });
    } catch (error: any) {
      console.error('Failed to send admin intimation email:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/notify-requirement", async (req, res) => {
    const { title, category, quantity, location, buyerPhone, buyerName, sellerPhones } = req.body;

    if (!twilioClient) {
      console.log('Mock WhatsApp Alert Triggered:', req.body);
      return res.status(200).json({ success: true, message: 'Mock WhatsApp alerts dispatched (Missing TWILIO credentials)' });
    }

    try {
      // 1. Send Auto WhatsApp Confirmation to the Buyer
      if (buyerPhone) {
        await twilioClient.messages.create({
          from: process.env.TWILIO_WHATSAPP_NUMBER,
          to: `whatsapp:+91${buyerPhone}`,
          body: `Hello ${buyerName},\nYour requirement for "${title}" (${quantity}) in ${location} has been successfully published on Made in India Hub!\n\nSellers will reach out to you shortly.`
        });
      }

      // 2. Broadcast WhatsApp/SMS Alert to Registered Sellers in the Category
      if (Array.isArray(sellerPhones) && sellerPhones.length > 0) {
        const broadcastPromises = sellerPhones.map((sellerPhone: string) => 
          twilioClient.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:+91${sellerPhone}`,
            body: `🔥 *NEW BUY LEAD ALERT*\n\n*Product:* ${title}\n*Quantity:* ${quantity}\n*Location:* ${location}\n\nView full contact details on https://www.madeinindia.directory/`
          })
        );
        await Promise.all(broadcastPromises);
      }

      return res.status(200).json({ success: true, message: 'WhatsApp alerts dispatched successfully' });
    } catch (error: any) {
      console.error('WhatsApp API dispatch failed:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/admin/manage", async (req, res) => {
    const { action, adminUserId, newPassword } = req.body;

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseServiceKey) {
        console.warn('Mock Admin Action:', action);
        return res.status(200).json({ success: true, message: `Mock success for action: ${action} (Missing SUPABASE_SERVICE_ROLE_KEY)` });
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Action 1: Change Admin Password
      if (action === 'CHANGE_PASSWORD') {
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
          adminUserId,
          { password: newPassword }
        );

        if (error) throw error;
        return res.status(200).json({ success: true, message: 'Admin password updated successfully.' });
      }

      // Action 2: Generate Demo Buyer & Seller Credentials
      if (action === 'CREATE_DEMO_USERS') {
        // Demo Seller Creation
        const { error: sellerError } = await supabaseAdmin.auth.admin.createUser({
          email: 'seller.demo@madeinindia.directory',
          password: 'DemoSeller123!',
          email_confirm: true,
          user_metadata: { full_name: 'Demo Seller', role: 'seller', company_name: 'Industrial Solutions Ltd' }
        });
        if (sellerError && !sellerError.message.includes('already exists')) throw sellerError;

        // Demo Buyer Creation
        const { error: buyerError } = await supabaseAdmin.auth.admin.createUser({
          email: 'buyer.demo@madeinindia.directory',
          password: 'DemoBuyer123!',
          email_confirm: true,
          user_metadata: { full_name: 'Demo Buyer', role: 'buyer', company_name: 'Global Procurements Corp' }
        });
        if (buyerError && !buyerError.message.includes('already exists')) throw buyerError;

        return res.status(200).json({
          success: true,
          message: 'Demo accounts created!',
          credentials: {
            seller: 'seller.demo@madeinindia.directory / DemoSeller123!',
            buyer: 'buyer.demo@madeinindia.directory / DemoBuyer123!'
          }
        });
      }

      return res.status(400).json({ message: 'Invalid action specified.' });
    } catch (error: any) {
      console.error('Admin management error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
