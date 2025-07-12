#!/usr/bin/env -S guix shell pnpm node awscli -- bash

set -e

export VITE_API_BASE_URL="https://api.checkoutbay.com/v1"
export VITE_SHOP_PREVIEW_BASE_URL="https://s1.checkoutbay.com/#/"
export VITE_SHOP_PREVIEW_BASE_URL_ALT="https://s2.checkoutbay.com/#/"
export VITE_STRIPE_PUBLIC_KEY="pk_live_51PS1UfB6bSjPIh6olwjbD0EDE8K2qoyTISQodeqKlDAJs1PISnHqwAu7yZ1Mkjek5Rfq2xqhoycsCCGUsSNfTRcZ00mE8xD0Jr"
export VITE_SENTRY_DSN="https://124996fa4729da1573f221b520451b4c@sentry.pantherx.dev/32"
export VITE_SENTRY_ENVIRONMENT="production"

pnpm run build || exit 1

# Prompt the user which folder to upload
FOLDER_NAME="./dist"
AWS_BUCKET_URL="s3://checkoutbay.com"
PROFILE_NAME="rusty"
CLOUDFRONT_ID="E2TIEDQ7LDZD0I"

echo "Using AWS profile: $PROFILE_NAME"
echo "Uploading folder: $FOLDER_NAME"
echo "Destination: $AWS_BUCKET_URL"

# Upload the folder to S3 using AWS CLI
aws s3 sync $FOLDER_NAME $AWS_BUCKET_URL --profile $PROFILE_NAME

# Invalidate CloudFront (Uncomment if you need this)
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*" --profile $PROFILE_NAME

# Clear env variable
unset VITE_API_BASE_URL
unset VITE_SHOP_PREVIEW_BASE_URL
unset VITE_SHOP_PREVIEW_BASE_URL_ALT
unset VITE_STRIPE_PUBLIC_KEY