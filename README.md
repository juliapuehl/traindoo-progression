# Hosting

```
npm run build-dev
npm run build-stage
npm run build-prod
```

```
firebase use development
firebase use staging
firebase use production
```

```
firebase deploy -P development --only hosting:traindoo-io-dev
firebase deploy -P staging --only hosting:traindoo-dev
firebase deploy -P production --only hosting:traindoo-io
```

# Test Strings

```
npm run tools:update-texts
```
