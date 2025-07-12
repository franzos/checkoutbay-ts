#!/usr/bin/env -S guix shell pnpm node awscli -- bash

set -e

export VITE_API_BASE_URL="https://api.checkoutbay.com/v1"
export VITE_SHOP_ID="1fcd41d5-f5d5-4c1a-929b-c83f316ee9d3"

pnpm run build || exit 1

# Prompt the user which folder to upload
FOLDER_NAME="./dist"
AWS_BUCKET_URL="s3://s2.checkoutbay.com"
PROFILE_NAME="rusty"
CLOUDFRONT_ID="E255A0CQD7YHZV"

echo "Using AWS profile: $PROFILE_NAME"
echo "Uploading folder: $FOLDER_NAME"
echo "Destination: $AWS_BUCKET_URL"

# Upload the folder to S3 using AWS CLI
aws s3 sync $FOLDER_NAME $AWS_BUCKET_URL --profile $PROFILE_NAME

# Invalidate CloudFront (Uncomment if you need this)
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*" --profile $PROFILE_NAME

# Clear env variable
unset VITE_API_BASE_URL
unset VITE_SHOP_ID