require('dotenv').config();

console.log('=== Checking MONGODB_URI ===');
console.log('Type of MONGODB_URI:', typeof process.env.MONGODB_URI);
console.log('Length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 'undefined');
console.log('First 20 chars:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) : 'undefined');
console.log('Full URI (masked):', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/mongodb\+srv:\/\/[^:]+:([^@]+)@/, 'mongodb+srv://username:***@') : 'undefined');

// Check if it starts correctly
if (process.env.MONGODB_URI) {
  const uri = process.env.MONGODB_URI;
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.log('\n❌ ERROR: URI does not start with mongodb:// or mongodb+srv://');
    console.log('Actual start:', uri.substring(0, Math.min(20, uri.length)));
  } else {
    console.log('\n✅ URI starts correctly');
  }
} else {
  console.log('\n❌ ERROR: MONGODB_URI is undefined or empty');
}