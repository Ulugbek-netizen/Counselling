#!/bin/bash
# Run this ONCE before your first once.sh run

echo "=== EduPath Project Setup ==="

# Initialize git if needed
if [ ! -d .git ]; then
  git init
  echo "✓ Git initialized"
fi

# Create .gitignore
cat > .gitignore << 'GITEOF'
node_modules/
.next/
.env.local
.env*.local
*.log
.DS_Store
.vercel
out/
GITEOF
echo "✓ .gitignore created"

# Ensure directories exist
mkdir -p issues/done
mkdir -p ralph
echo "✓ Directories ready"

# Check for required files
if [ ! -f ralph/prompt.md ]; then
  echo "✗ Missing ralph/prompt.md — copy from build kit"
  exit 1
fi

if [ ! -d issues ] || [ -z "$(ls issues/*.md 2>/dev/null)" ]; then
  echo "✗ Missing issues/ — copy from build kit"
  exit 1
fi

# Check for .env.local
if [ ! -f .env.local ]; then
  cat > .env.local << 'ENVEOF'
# Supabase (get from supabase.com → project → settings → API)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (get from dashboard.stripe.com → developers → API keys)
# Use test keys during development
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (get from resend.com → API keys)
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENVEOF
  echo "⚠ Created .env.local template — fill in your API keys before running"
else
  echo "✓ .env.local exists"
fi

# Check for Claude Code
if command -v claude &> /dev/null; then
  echo "✓ Claude Code installed"
else
  echo "✗ Claude Code not found — install with: npm install -g @anthropic-ai/claude-code"
fi

echo ""
echo "=== Setup complete ==="
echo "Next steps:"
echo "1. Create a Supabase project at supabase.com"
echo "2. Fill in .env.local with your API keys"
echo "3. Run: bash once.sh"
