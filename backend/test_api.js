// Native global fetch is available in Node.js v18+

async function runTests() {
  console.log('--- STARTING HAPPYGSR BACKEND API INTEGRATION TESTS ---');

  const API_URL = 'http://localhost:5000/api';

  try {
    // 1. Test Health endpoint
    console.log('\n1. Testing Health Endpoint...');
    const healthRes = await fetch(`${API_URL}/health`);
    const healthData = await healthRes.json();
    console.log('Health status:', healthData);

    // 2. Test Products endpoint
    console.log('\n2. Testing Catalog Products Retrieval...');
    const productsRes = await fetch(`${API_URL}/products?category=laptop-grosir`);
    const products = await productsRes.json();
    console.log(`Retrieved ${products.length} laptop-grosir products.`);
    if (products.length > 0) {
      console.log('Sample product:', { id: products[0].id, title: products[0].title, price: products[0].price });
    }

    // 3. Test Login with seeded user
    console.log('\n3. Testing Member Login Auth...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPhone: 'member@happygsr.com',
        password: 'password123'
      })
    });
    
    if (!loginRes.ok) {
      const err = await loginRes.json();
      throw new Error(`Login failed: ${err.message}`);
    }

    const authData = await loginRes.json();
    const token = authData.token;
    console.log('Login successful! Welcome,', authData.user.name);
    console.log('Seeded Token Balance:', authData.user.token_balance, 'GSR');
    console.log('Referral Code:', authData.user.referral_code);

    // 4. Test profile fetching using token
    console.log('\n4. Testing Token Authorization (/me)...');
    const profileRes = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const profileData = await profileRes.json();
    console.log('Verified user profile:', profileData.user.name, '-', profileData.user.email);

    // 5. Test checkout creation (as logged-in user)
    console.log('\n5. Testing Checkout Order & WhatsApp Text Generation...');
    const checkoutRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test Budi',
        phone: '081234567890',
        address: 'Jl. Merdeka Raya No. 45, Jakarta',
        courier: 'JNE',
        items: [
          { id: 'H32', quantity: 2 },
          { id: 'CCTV-4CH', quantity: 1 }
        ],
        voucherCode: 'GSRWEB'
      })
    });

    if (!checkoutRes.ok) {
      const err = await checkoutRes.json();
      throw new Error(`Checkout failed: ${err.message}`);
    }

    const checkoutData = await checkoutRes.json();
    const createdOrderId = checkoutData.orderId;
    console.log('Order created successfully! Order ID:', createdOrderId);
    console.log('Total Payment:', checkoutData.totalAmount);
    console.log('WhatsApp Redirection URL:', checkoutData.whatsappUrl.substring(0, 100) + '...');

    // 6. Test Tracking order status
    console.log('\n6. Testing Order Live Tracking Status...');
    const trackingRes = await fetch(`${API_URL}/orders/track/${createdOrderId}`);
    const trackingData = await trackingRes.json();
    console.log('Tracking Result:', {
      orderId: trackingData.orderId,
      status: trackingData.status,
      paymentStatus: trackingData.paymentStatus,
      stepsCount: trackingData.trackingSteps.length
    });
    console.log('Latest Tracking Step:', trackingData.trackingSteps[0]);

    // 7. Test manual payment confirmation
    console.log('\n7. Testing Payment Confirmation...');
    const confirmRes = await fetch(`${API_URL}/orders/confirm-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: createdOrderId,
        senderName: 'Test Budi',
        amount: checkoutData.totalAmount
      })
    });
    const confirmData = await confirmRes.json();
    console.log('Payment confirmation submission status:', confirmData.message);

    // 8. Test commissions retrieval
    console.log('\n8. Testing Affiliate Commission Logs...');
    const commRes = await fetch(`${API_URL}/commissions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const commData = await commRes.json();
    console.log('Commissions list:', commData.commissions.length, 'records found.');
    console.log('Summary:', commData.summary);

    console.log('\n--- ALL BACKEND INTEGRATION TESTS COMPLETED SUCCESSFULLY! ---');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
  }
}

runTests();
