const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// مفتاح API الخاص بـ Paddle (يفضل مستقبلاً وضعه في متغيرات البيئة ENV)
const PADDLE_API_KEY = process.env.PADDLE_API_KEY || "pdl_live_apikey_01m6c0sjnaqfbjc3jpf34hgd39_mTvWYqxFy99RWBSAD40YX1_Apa";

app.use(express.json());

// الصفحة الرئيسية للموقع (Landing Page)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>Story Analyzer - منصة التحليل القانوني والمحاسبي</title>
            <style>
                body { font-family: sans-serif; text-align: center; padding: 50px; background: #f4f4f9; }
                h1 { color: #333; }
                p { color: #555; font-size: 18px; }
                .btn { background: #635bff; color: white; padding: 12px 25px; border: none; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px; cursor: pointer; }
            </style>
        </head>
        <body>
            <h1>مرحباً بك في منصة الخدمات القانونية والمحاسبية</h1>
            <p>السيستم متصل حالياً بنجاح مع Paddle ومستعد لإدارة عمليات الشراء والتنبيهات الأوتوماتيكية.</p>
            <br>
            <a href="#" class="btn">اشترك الآن (Paddle Checkout)</a>
        </body>
        </html>
    `);
});

// نقطة استقبال الدفع والأحداث الأوتوماتيكية (Webhook من Paddle)
app.post('/webhook/paddle', (req, res) => {
    const event = req.body;
    
    // التحقق من نوع الحدث في Paddle v2 (transaction.completed أو subscription.created)
    if (event && event.event_type) {
        console.log(`🔔 وصل إشعار جديد من Paddle: ${event.event_type}`);

        if (event.event_type === 'transaction.completed') {
            const customerEmail = event.data.customer?.email || 'عميل جديد';
            const totalPaid = event.data.details?.totals?.total || '0';
            const currency = event.data.currency_code || 'USD';

            console.log(`✅ تم استلام مبلغ ${totalPaid} ${currency} بنجاح من العميل: ${customerEmail}`);

            // هنا يتم تشغيل كود إرسال التنبيهات (التليجرام / الإيميل) وحفظ البيانات
        }
    }

    res.status(200).send({ status: 'success' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
