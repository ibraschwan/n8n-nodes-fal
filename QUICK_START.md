# Quick Start - Test Your Fal Node in n8n NOW! 🚀

Follow these steps to get your Fal node running in n8n within minutes.

## Step 1: Install Your Node in n8n

### If you're running n8n locally:

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom/

# Create the directory if it doesn't exist
mkdir -p ~/.n8n/custom/

# Link your built node
npm link /Users/ibraschwan/n8n-nodes-fal

# Restart n8n
# If running via npm: pkill -f n8n && n8n start
# If running via Docker: docker restart n8n
```

### If you're using n8n Desktop or Cloud:
You'll need to publish to npm first (see Publishing section below).

## Step 2: Get Your Fal.ai API Key

1. Go to https://fal.ai
2. Sign up or log in
3. Navigate to https://fal.ai/dashboard/keys
4. Click "Create API Key"
5. Copy your API key (starts with `fal-`)

## Step 3: Create Your First Workflow

### Example 1: Generate an Image (Simplest Test)

1. **Open n8n** in your browser (usually http://localhost:5678)

2. **Create a new workflow**

3. **Add a Manual Trigger node**
   - Search for "Manual" in the node selector
   - Click "Manual Trigger"

4. **Add a Fal node**
   - Click the + button
   - Search for "Fal"
   - Click on the Fal node

5. **Configure Credentials**
   - Click on "Credential to connect with"
   - Click "Create New Credential"
   - Paste your Fal API key
   - Click "Save"

6. **Configure the Fal Node**
   - **Resource**: Text to Image
   - **Model**: FLUX 1.1 Pro
   - **Prompt**: `a beautiful sunset over a calm ocean, cinematic lighting, 4k`
   - **Additional Options** (optional):
     - Click "Add Option"
     - **Image Size**: Landscape (1280x720)
     - **Number of Images**: 1

7. **Execute the Workflow**
   - Click "Execute Node" or "Execute Workflow"
   - Wait 5-10 seconds
   - You'll see the output with an image URL!

8. **View Your Image**
   - In the output, find `images[0].url`
   - Copy the URL and open it in your browser
   - See your generated image! 🎨

### Example 2: Use GPT-4o for Text Generation

1. **Add Manual Trigger** (same as above)

2. **Add Fal Node**
   - **Resource**: LLM (Text Generation)
   - **Model**: GPT-4o
   - **Prompt**: `Write a haiku about artificial intelligence`
   - **Additional Options**:
     - **Temperature**: 0.7
     - **Max Tokens**: 100

3. **Execute**
   - Click "Execute Workflow"
   - See the generated haiku in the output!

### Example 3: Create an AI Content Pipeline

**Goal**: Generate image → Upscale it → Get result

1. **Add Manual Trigger**

2. **Add Fal Node 1** (Generate Image)
   - Name it: "Generate Image"
   - **Resource**: Text to Image
   - **Model**: FLUX 1.1 Pro
   - **Prompt**: `a cute robot mascot, simple design, white background`

3. **Add Fal Node 2** (Upscale Image)
   - Name it: "Upscale Image"
   - **Resource**: Utility
   - **Operation**: Upscale Image
   - **Model**: Topaz AI
   - **Image URL**: `{{ $('Generate Image').item.json.images[0].url }}`
   - **Scale**: 4x

4. **Execute the Workflow**
   - Click "Execute Workflow"
   - Wait for both nodes to complete
   - See your original and upscaled images!

### Example 4: Queue Management (Advanced)

**Goal**: Submit request → Check status → Get result

1. **Add Manual Trigger**

2. **Add Fal Node 1** (Submit to Queue)
   - Name it: "Submit Request"
   - **Resource**: Queue
   - **Operation**: Submit Request
   - **Model Endpoint**: `fal-ai/flux/dev`
   - **Input Parameters**:
     ```json
     {
       "prompt": "a futuristic city at night"
     }
     ```

3. **Add Wait Node**
   - Search for "Wait"
   - **Resume**: After Time Interval
   - **Amount**: 5
   - **Unit**: Seconds

4. **Add Fal Node 2** (Get Status)
   - Name it: "Get Status"
   - **Resource**: Queue
   - **Operation**: Get Status
   - **Request ID**: `{{ $('Submit Request').item.json.request_id }}`
   - **Model Endpoint**: `fal-ai/flux/dev`
   - **Options** → **Include Logs**: true

5. **Add IF Node**
   - **Condition**: Boolean
   - **Value 1**: `{{ $json.status }}`
   - **Operation**: Equal
   - **Value 2**: `COMPLETED`

6. **Add Fal Node 3** (Get Response) - Connect to TRUE branch
   - Name it: "Get Response"
   - **Resource**: Queue
   - **Operation**: Get Response
   - **Request ID**: `{{ $('Submit Request').item.json.request_id }}`
   - **Model Endpoint**: `fal-ai/flux/dev`

7. **Execute the Workflow**
   - Watch it submit, wait, check status, and get the result!

## Step 4: Explore More Features

Now that you have the basics working, try:

### All Resources:
- ✅ **LLM** - Text generation with GPT, Claude, Gemini
- ✅ **Text to Image** - FLUX, Stable Diffusion
- ✅ **Text to Video** - Sora 2, Veo 3.1
- ✅ **Image Editing** - Transform images with AI
- ✅ **Image to Video** - Animate static images
- ✅ **Video to Video** - Remix and transform videos
- ✅ **Vision** - Analyze images with AI
- ✅ **Workflow** - Chain multiple models
- ✅ **Queue** - Advanced queue control
- ✅ **Utility** - Upscale, background removal, NSFW detection

### Pro Tips:
1. **Use Expressions**: Access previous node data with `{{ $json.field }}`
2. **Error Handling**: Enable "Continue On Fail" in node settings
3. **Save Time**: Use cheaper/faster models for testing (FLUX Schnell, Gemini Flash)
4. **Monitor Costs**: Check your Fal.ai dashboard for usage

## Publishing Your Node to npm (Optional)

When you're ready to share your node with the world:

1. **Update package.json**
   - Set the version to `1.0.0`
   - Ensure all fields are correct

2. **Login to npm**
   ```bash
   npm login
   ```

3. **Publish**
   ```bash
   cd /Users/ibraschwan/n8n-nodes-fal
   npm publish
   ```

4. **Share**
   - Your node will be available at: `npm install n8n-nodes-fal`
   - Users can install it via n8n Community Nodes UI

## Troubleshooting

### "Fal node not showing up"
- Make sure you ran `npm link` correctly
- Restart n8n completely
- Check `~/.n8n/custom/node_modules/` for the symlink

### "Authentication failed"
- Verify your API key is correct
- Ensure it starts with `fal-`
- Try creating a new API key

### "Request timeout"
- Some models take 30+ seconds
- Increase timeout in node options
- Use Queue operations for better control

### "Build errors"
- Make sure you ran `npm run build` successfully
- Check for TypeScript errors: `npm run lint`

## Next Steps

1. ✅ Test basic image generation
2. ✅ Try different models
3. ✅ Build a multi-step workflow
4. ✅ Experiment with Queue operations
5. ✅ Share your workflows with the community!

## Need Help?

- 📖 Read the [Complete Usage Guide](./USAGE_GUIDE.md)
- 🐛 Report issues: https://github.com/ibraschwan/n8n-nodes-fal/issues
- 💬 n8n Community: https://community.n8n.io
- 🎮 Fal Discord: https://fal.ai/discord

**Happy Automating!** 🎉
