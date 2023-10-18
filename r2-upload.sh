#!/bin/bash

for file in assets/country-flags/*; do
    filename=$(basename -- "$file")
    bucket_path="r2-auth-country/$filename"
    
    npx wrangler r2 object put $bucket_path --file $file --content-type image/png
done