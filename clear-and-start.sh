#!/bin/bash
echo "🧹 Czyszczenie projektu..."

# Usuń cache
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

echo "✅ Cache wyczyszczony"
echo ""
echo "🚀 Uruchom teraz:"
echo "npx expo start --clear"
