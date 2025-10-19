# Publishing n8n-nodes-fal to npm 📦

Complete guide to publishing your Fal node to npm so it's accessible to everyone worldwide!

## Prerequisites

1. **npm Account**
   - Go to https://www.npmjs.com/signup
   - Create an account (free)
   - Verify your email address

2. **Two-Factor Authentication (2FA)**
   - npm requires 2FA for publishing
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/profile
   - Click "Enable 2FA"
   - Choose "Authorization and Publishing" (more secure)
   - Scan QR code with authenticator app (Google Authenticator, Authy, etc.)

## Step 1: Login to npm

```bash
cd /Users/ibraschwan/n8n-nodes-fal

# Login to npm
npm login

# Enter your credentials:
# - Username
# - Password
# - Email
# - OTP (from your authenticator app)
```

Verify you're logged in:
```bash
npm whoami
```

## Step 2: Final Pre-Publishing Checks

### Check package name availability
```bash
npm view n8n-nodes-fal
```

If you see "npm ERR! 404 'n8n-nodes-fal' is not in this registry" - PERFECT! The name is available.

If it exists, you'll need to choose a different name (e.g., `@yourusername/n8n-nodes-fal`)

### Verify build is successful
```bash
npm run build
```

Should complete without errors.

### Test the package locally
```bash
# Create a test package
npm pack

# This creates: n8n-nodes-fal-1.0.0.tgz
# Extract and inspect if you want:
tar -xzf n8n-nodes-fal-1.0.0.tgz
ls -la package/

# Clean up test artifacts
rm n8n-nodes-fal-1.0.0.tgz
rm -rf package/
```

### Run lint
```bash
npm run lint
```

Should pass (warnings are okay, no errors).

## Step 3: Publish to npm! 🚀

### First publish (version 1.0.0)

```bash
# Publish to npm
npm publish

# You'll be prompted for your 2FA code
# Enter the 6-digit code from your authenticator app
```

**Expected output:**
```
npm notice
npm notice 📦  n8n-nodes-fal@1.0.0
npm notice === Tarball Contents ===
...
npm notice === Tarball Details ===
npm notice name:          n8n-nodes-fal
npm notice version:       1.0.0
npm notice filename:      n8n-nodes-fal-1.0.0.tgz
npm notice package size:  36.0 kB
npm notice unpacked size: 235.0 kB
npm notice total files:   197
npm notice
+ n8n-nodes-fal@1.0.0
```

### Verify publication

1. **Check npm page:**
   - Visit: https://www.npmjs.com/package/n8n-nodes-fal
   - Should show your package with README

2. **Test installation:**
   ```bash
   # In a different directory
   mkdir test-install
   cd test-install
   npm install n8n-nodes-fal
   ```

## Step 4: Tag the Release on GitHub

```bash
cd /Users/ibraschwan/n8n-nodes-fal

# Create a git tag for the release
git tag v1.0.0

# Push the tag to GitHub
git push origin v1.0.0
```

### Create a GitHub Release (Optional but Recommended)

1. Go to: https://github.com/ibraschwan/n8n-nodes-fal/releases
2. Click "Create a new release"
3. Choose tag: v1.0.0
4. Release title: `v1.0.0 - Initial Release`
5. Description: Copy from CHANGELOG.md
6. Click "Publish release"

## Step 5: Verify in n8n

### Test in n8n Community Nodes

1. Open n8n (http://localhost:5678 or your n8n instance)
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter: `n8n-nodes-fal`
5. Click **Install**
6. Wait for installation (1-2 minutes)
7. Refresh the page
8. Search for "Fal" in the node palette
9. Success! 🎉

## Publishing Future Updates

### Patch Release (bug fixes) - 1.0.0 → 1.0.1

```bash
# Update version
npm version patch

# Publish
npm publish

# Push changes and tags
git push && git push --tags
```

### Minor Release (new features) - 1.0.0 → 1.1.0

```bash
# Update version
npm version minor

# Publish
npm publish

# Push changes and tags
git push && git push --tags
```

### Major Release (breaking changes) - 1.0.0 → 2.0.0

```bash
# Update version
npm version major

# Publish
npm publish

# Push changes and tags
git push && git push --tags
```

### Manual Version Update

Alternatively, you can manually update the version in `package.json`:

```json
{
  "version": "1.0.1"
}
```

Then:
```bash
npm publish
git add package.json package-lock.json
git commit -m "chore: bump version to 1.0.1"
git tag v1.0.1
git push && git push --tags
```

## Package Visibility & Statistics

### View package stats
- npm page: https://www.npmjs.com/package/n8n-nodes-fal
- Download stats: https://npm-stat.com/charts.html?package=n8n-nodes-fal

### Monitor downloads
```bash
# Install npm-stat globally
npm install -g npm-stat

# Check download stats
npm-stat n8n-nodes-fal
```

## Promoting Your Package

### 1. n8n Community Forum
Post in the n8n community:
- https://community.n8n.io/c/sharing-workflows/35
- Share example workflows using your node
- Explain what Fal.ai can do

### 2. Twitter/X
Tweet about your release:
```
🚀 Just published n8n-nodes-fal to npm!

Add AI superpowers to @n8n_io workflows:
✨ 60+ AI models (GPT, Claude, Gemini, Llama)
🎨 Image generation (FLUX, Stable Diffusion)
🎬 Video generation (Sora 2, Veo 3.1)
🔧 Advanced queue & workflow control

npm install n8n-nodes-fal

#n8n #AI #automation #opensource
```

### 3. Reddit
Post in relevant subreddits:
- r/n8n
- r/selfhosted
- r/automation

### 4. Product Hunt (Optional)
Consider launching on Product Hunt if you want more visibility.

### 5. Documentation Site
Create a documentation site using:
- GitHub Pages (free)
- Vercel (free)
- Netlify (free)

## Troubleshooting

### "You do not have permission to publish"
- Make sure you're logged in: `npm whoami`
- Check package name isn't taken
- Verify email is verified on npm

### "Package name too similar to existing package"
- Choose a scoped name: `@yourusername/n8n-nodes-fal`
- Update package.json name field
- Try publishing again

### "402 Payment Required"
- Your account may need email verification
- Check https://www.npmjs.com/settings/YOUR_USERNAME/profile

### "OTP required but not provided"
- Make sure 2FA is enabled
- Use `npm publish --otp=123456` (replace with your code)
- Or wait for the prompt and enter your code

### "Version already published"
- Bump the version number in package.json
- Run `npm publish` again

## Unpublishing (Emergency Only)

⚠️ **Warning:** Unpublishing is permanent and can break dependents!

Only unpublish if absolutely necessary (security issue, wrong package published, etc.)

```bash
# Unpublish specific version (within 72 hours only)
npm unpublish n8n-nodes-fal@1.0.0

# Unpublish entire package (within 72 hours only)
npm unpublish n8n-nodes-fal --force
```

After 72 hours, you can only deprecate:
```bash
npm deprecate n8n-nodes-fal@1.0.0 "Please use version 1.0.1 instead"
```

## Best Practices

1. **Always test before publishing**
   - Run `npm pack --dry-run` to preview
   - Test installation locally
   - Run all tests and lints

2. **Update CHANGELOG.md**
   - Document all changes
   - Follow semantic versioning
   - Users appreciate knowing what changed

3. **Follow semantic versioning**
   - Patch: Bug fixes (1.0.0 → 1.0.1)
   - Minor: New features (1.0.0 → 1.1.0)
   - Major: Breaking changes (1.0.0 → 2.0.0)

4. **Tag releases in git**
   - Makes it easy to roll back
   - Useful for tracking history
   - GitHub can auto-generate release notes

5. **Respond to issues**
   - Monitor GitHub issues
   - Help users with problems
   - Consider feature requests

6. **Keep dependencies updated**
   - Run `npm outdated` regularly
   - Update dependencies carefully
   - Test after updating

## Success Checklist ✅

Before publishing, ensure:

- [ ] Build succeeds (`npm run build`)
- [ ] Linter passes (`npm run lint`)
- [ ] Package preview looks good (`npm pack --dry-run`)
- [ ] README.md is up to date
- [ ] CHANGELOG.md is updated
- [ ] Version number is correct
- [ ] Git changes are committed
- [ ] Logged into npm (`npm whoami`)
- [ ] 2FA is enabled

After publishing:

- [ ] Package appears on npm
- [ ] Installation works (`npm install n8n-nodes-fal`)
- [ ] Git tag created and pushed
- [ ] GitHub release created (optional)
- [ ] Announced in n8n community (optional)
- [ ] Shared on social media (optional)

## Next Steps After Publishing

1. **Monitor Issues**
   - Watch your GitHub repository
   - Respond to issues promptly
   - Consider feature requests

2. **Share**
   - Post in n8n community
   - Share on social media
   - Write a blog post

3. **Maintain**
   - Update dependencies regularly
   - Fix bugs promptly
   - Add new features based on feedback

4. **Grow**
   - Add more Fal models as they're released
   - Improve documentation
   - Create example workflows
   - Help users succeed

---

**Congratulations on publishing your node! 🎉**

You've just made AI accessible to thousands of n8n users worldwide!

Need help? Open an issue: https://github.com/ibraschwan/n8n-nodes-fal/issues
