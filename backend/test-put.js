const http = require('http');

const data = JSON.stringify({
  id: 1,
  company_name: 'TEST SMR TRADING',
  address: 'Test Addr',
  phone: '123',
  email: 'test@test.com',
  gstin: '33TEST',
  state: 'Test',
  state_code: '33',
  bank_name: 'Test Bank',
  account_name: 'Test Acc',
  account_number: '123',
  ifsc_code: 'TEST',
  branch: 'Test Branch',
  terms_conditions: 'test'
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/settings',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer test' // Wait, I don't have a valid token
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(res.statusCode, body));
});

req.write(data);
req.end();
