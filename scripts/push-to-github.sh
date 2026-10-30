#!/bin/bash
# Pharma Star App Pro - Push to GitHub Repository
# Target: https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro
# Author: Pharmacist Dawid Aliyi (jaalibiddoo@gmail.com)

set -e

REPO_URL="https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro.git"
BRANCH="main"

echo "=================================================="
echo "🌟 Pharma Star App Pro - GitHub Push Utility"
echo "Target Repository: jaalibiddoo-spec/Pharma-Star-app-pro"
echo "Author: Pharmacist Dawid Aliyi"
echo "=================================================="

# Check if a PAT was passed as argument or via environment variable
TOKEN="${1:-$GITHUB_TOKEN}"

if [ -z "$TOKEN" ]; then
  echo ""
  echo "Usage:"
  echo "  bash scripts/push-to-github.sh <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>"
  echo ""
  echo "Or set the environment variable:"
  echo "  export GITHUB_TOKEN=\"your_token_here\""
  echo "  bash scripts/push-to-github.sh"
  echo ""
  echo "You can generate a token at: https://github.com/settings/tokens"
  echo "Required scopes: 'repo' (Full control of private repositories) or 'public_repo'"
  exit 1
fi

echo "📦 1. Staging and verifying local git commit..."
git add .
if git diff-index --quiet HEAD -- 2>/dev/null; then
  echo "   No uncommitted changes detected. Working tree clean."
else
  git commit -m "feat: complete Pharma Star App Pro workstation, website, and GitHub Actions CI/CD"
  echo "   Committed latest project files."
fi

echo "🚀 2. Pushing to branch '$BRANCH' on GitHub..."
# Push securely using PAT in temporary push URL without saving token to git config
git push "https://${TOKEN}@github.com/jaalibiddoo-spec/Pharma-Star-app-pro.git" "$BRANCH" --force

echo ""
echo "✅ SUCCESS! All files, workflows, and configurations have been pushed to:"
echo "   https://github.com/jaalibiddoo-spec/Pharma-Star-app-pro"
echo ""
echo "GitHub Actions will automatically:"
echo "  1. Run CI test & build verification (.github/workflows/ci.yml)"
echo "  2. Deploy the live web app to GitHub Pages (.github/workflows/pages.yml)"
echo "=================================================="
