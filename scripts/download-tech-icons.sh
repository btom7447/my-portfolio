#!/bin/bash
# Downloads tech stack SVG icons from devicon CDN
# Run: bash scripts/download-tech-icons.sh

DIR="public/tech-icons"
BASE="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons"

mkdir -p "$DIR"

declare -A ICONS=(
  # Frontend
  ["react"]="react/react-original.svg"
  ["nextjs"]="nextjs/nextjs-original.svg"
  ["typescript"]="typescript/typescript-original.svg"
  ["javascript"]="javascript/javascript-original.svg"
  ["tailwindcss"]="tailwindcss/tailwindcss-original.svg"
  ["framermotion"]="framermotion/framermotion-original.svg"
  ["html"]="html5/html5-original.svg"
  ["css"]="css3/css3-original.svg"
  ["vue"]="vuejs/vuejs-original.svg"
  ["angular"]="angular/angular-original.svg"
  ["svelte"]="svelte/svelte-original.svg"
  # Backend
  ["nodejs"]="nodejs/nodejs-original.svg"
  ["express"]="express/express-original.svg"
  ["postgresql"]="postgresql/postgresql-original.svg"
  ["mongodb"]="mongodb/mongodb-original.svg"
  ["graphql"]="graphql/graphql-plain.svg"
  ["prisma"]="prisma/prisma-original.svg"
  ["firebase"]="firebase/firebase-original.svg"
  ["python"]="python/python-original.svg"
  ["django"]="django/django-plain.svg"
  # Mobile
  ["reactnative"]="react/react-original.svg"
  ["flutter"]="flutter/flutter-original.svg"
  ["swift"]="swift/swift-original.svg"
  ["kotlin"]="kotlin/kotlin-original.svg"
  # Tools
  ["git"]="git/git-original.svg"
  ["github"]="github/github-original.svg"
  ["figma"]="figma/figma-original.svg"
  ["vercel"]="vercel/vercel-original.svg"
  ["docker"]="docker/docker-original.svg"
  ["vscode"]="vscode/vscode-original.svg"
  ["npm"]="npm/npm-original-wordmark.svg"
  ["linux"]="linux/linux-original.svg"
  ["postman"]="postman/postman-original.svg"
)

for name in "${!ICONS[@]}"; do
  url="$BASE/${ICONS[$name]}"
  echo "Downloading $name..."
  curl -sL "$url" -o "$DIR/$name.svg"
done

echo "Done! Icons saved to $DIR/"
