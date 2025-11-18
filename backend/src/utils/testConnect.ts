// Quick test for Connect-Web endpoint
import http from 'http';

const data = JSON.stringify({
  userId: "691caa0f9cf3ff72e6cd1209",
  limit: 3
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/connect/recommendations.RecommendationService/GetRecommendations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});

req.write(data);
req.end();
