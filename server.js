const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// GET endpoint
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Utility functions
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const parseFile = (fileBase64) => {
  if (!fileBase64) return { file_valid: false };
  try {
    const buffer = Buffer.from(fileBase64, 'base64');
    const mimeType = require('mime-types').lookup(buffer) || 'unknown';
    return {
      file_valid: true,
      file_mime_type: mimeType,
      file_size_kb: (buffer.length / 1024).toFixed(2),
    };
  } catch {
    return { file_valid: false };
  }
};

// POST endpoint
app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ is_success: false, error: 'Invalid data array' });
  }

  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => /^[A-Za-z]$/.test(item));
  const lowercaseAlphabets = alphabets.filter((item) => /^[a-z]$/.test(item));
  const highestLowercase = lowercaseAlphabets.sort().pop() || null;

  const { file_valid, file_mime_type, file_size_kb } = parseFile(file_b64);

  res.status(200).json({
    is_success: true,
    user_id: 'john_doe_17091999',
    email: 'john@xyz.com',
    roll_number: 'ABCD123',
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase,
    is_prime_found: numbers.some((num) => isPrime(parseInt(num, 10))),
    file_valid,
    file_mime_type,
    file_size_kb,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
