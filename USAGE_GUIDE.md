# n8n-nodes-fal Usage Guide

Complete guide to using the Fal.ai node in n8n for AI-powered workflows.

## Table of Contents
- [Installation](#installation)
- [Getting Your API Key](#getting-your-api-key)
- [Setting Up Credentials](#setting-up-credentials)
- [Quick Start Examples](#quick-start-examples)
- [All Resources](#all-resources)
- [Advanced Workflows](#advanced-workflows)

## Installation

### Option 1: Install from npm (when published)
1. In n8n, go to **Settings** → **Community Nodes**
2. Click **Install a community node**
3. Enter: `@ibracob.dev/n8n-nodes-fal`
4. Click **Install**

### Option 2: Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/ibraschwan/n8n-nodes-fal.git
   cd n8n-nodes-fal
   ```

2. Build the node:
   ```bash
   npm install
   npm run build
   ```

3. Link to your n8n installation:
   ```bash
   # Find your n8n custom nodes directory
   # Usually: ~/.n8n/custom/

   # Create symlink
   cd ~/.n8n/custom/
   npm link /path/to/n8n-nodes-fal
   ```

4. Restart n8n

## Getting Your API Key

1. Go to [fal.ai](https://fal.ai)
2. Sign up or log in to your account
3. Navigate to your [API Keys page](https://fal.ai/dashboard/keys)
4. Click **Create API Key**
5. Copy your API key (starts with `fal-...`)

## Setting Up Credentials

1. In your n8n workflow, add the **Fal** node
2. Click on **Credential to connect with**
3. Click **Create New Credential**
4. Enter your Fal API key
5. Click **Save**

## Quick Start Examples

### Example 1: Generate an Image with FLUX

**Simple text-to-image generation:**

1. Add a **Manual Trigger** node (for testing)
2. Add a **Fal** node
3. Configure the Fal node:
   - **Resource**: Text to Image
   - **Model**: FLUX 1.1 Pro
   - **Prompt**: `a beautiful sunset over a calm ocean, cinematic lighting`
   - **Additional Options** → **Image Size**: Landscape (1280x720)
4. Execute the workflow

**Output:**
```json
{
  "images": [
    {
      "url": "https://fal.media/...",
      "width": 1280,
      "height": 720,
      "content_type": "image/jpeg"
    }
  ],
  "seed": 123456789
}
```

### Example 2: Use GPT-4o for Text Generation

**Generate text with LLM:**

1. Add a **Manual Trigger** node
2. Add a **Fal** node
3. Configure:
   - **Resource**: LLM (Text Generation)
   - **Model**: GPT-4o
   - **Prompt**: `Write a short poem about artificial intelligence`
   - **Additional Options** → **Temperature**: 0.7
   - **Additional Options** → **Max Tokens**: 200
4. Execute

**Output:**
```json
{
  "output": "In circuits deep and data streams,\nA new intelligence gleams...",
  "model": "gpt-4o",
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 150,
    "total_tokens": 162
  }
}
```

### Example 3: Create a Video from an Image

**Image-to-video transformation:**

1. Add a **Manual Trigger** node
2. Add a **Fal** node (for image generation)
   - **Resource**: Text to Image
   - **Model**: FLUX 1.1 Pro
   - **Prompt**: `a serene mountain landscape`
3. Add another **Fal** node (for video generation)
   - **Resource**: Image to Video
   - **Model**: Kling V1.6 Pro
   - **Image URL**: `{{ $json.images[0].url }}`
   - **Prompt**: `camera slowly pans across the landscape`
   - **Duration**: 5 seconds
4. Execute

### Example 4: Analyze an Image with Vision AI

**Image analysis with GPT-4o Vision:**

1. Add a **Manual Trigger** node
2. Add a **Fal** node
3. Configure:
   - **Resource**: Vision (Image Analysis)
   - **Model**: GPT-4o
   - **Images**: Add image URLs
     - **Image URL**: `https://example.com/image.jpg`
   - **Prompt**: `What objects and activities can you see in this image?`
4. Execute

## All Resources

### 1. LLM (Text Generation)

**Available Models:**
- OpenAI: GPT-5 Chat, O3, GPT-4.1, GPT-4o, GPT-4o Mini
- Anthropic: Claude 3.7 Sonnet, Claude 3.5 Sonnet/Haiku
- Google: Gemini 2.5 Pro/Flash, Gemini 2.0 Flash
- Meta: Llama 3.1 70B/8B, Llama 4 Maverick/Scout
- DeepSeek R1

**Common Parameters:**
- `prompt`: Your text prompt
- `system_prompt`: System instructions (optional)
- `temperature`: 0.0-2.0 (creativity control)
- `max_tokens`: Maximum response length
- `stream`: Enable streaming responses

### 2. Text to Image

**Available Models:**
- FLUX 1.1 Pro (best quality)
- FLUX 1 Pro/Dev/Schnell
- Stable Diffusion XL
- Stable Diffusion 3.5 Large

**Common Parameters:**
- `prompt`: Image description
- `image_size`: Square, Landscape, Portrait, or Custom
- `num_images`: 1-4 images
- `guidance_scale`: Prompt adherence (1-20)
- `num_inference_steps`: Quality vs speed

### 3. Text to Video

**Available Models:**
- Sora 2 Pro (highest quality)
- Sora 2
- Veo 3.1
- Veo 3.1 Fast

**Common Parameters:**
- `prompt`: Video description
- `duration`: 4s, 6s, or 8s
- `aspect_ratio`: 16:9, 9:16, 1:1
- `enable_audio`: Generate audio track

### 4. Image Editing

**Available Models:**
- Reve Edit
- Nano Banana Edit
- Seedream V4 Edit
- FLUX Pro Kontext

**Common Parameters:**
- `image_url`: Source image
- `prompt`: Editing instructions
- `strength`: Edit intensity

### 5. Image to Video

**Available Models:**
- Sora 2 Pro/Standard
- Veo 3.1 variants
- Kling V1.6 Pro/Standard
- Runway Gen3
- Luma Dream Machine

**Common Parameters:**
- `image_url`: Source image
- `prompt`: Motion description
- `duration`: Video length
- `mode`: First frame, last frame, or reference

### 6. Video to Video

**Available Models:**
- Sora 2 Remix

**Common Parameters:**
- `video_url`: Source video
- `prompt`: Transformation description
- `strength`: Edit intensity

### 7. Vision (Image Analysis)

**Available Models:**
- Gemini 2.5 Pro
- Claude 3.7 Sonnet
- GPT-4o
- Llama 3.2 90B Vision

**Common Parameters:**
- `images`: Array of image URLs
- `prompt`: Analysis question
- `temperature`: Response creativity

### 8. Workflow

**Two Operations:**

#### Execute Custom Workflow
Chain multiple Fal models together with custom JSON definitions.

**Example Workflow:**
```json
{
  "input": {
    "id": "input",
    "type": "input",
    "depends": [],
    "input": {
      "prompt": ""
    }
  },
  "generate": {
    "id": "generate",
    "type": "run",
    "depends": ["input"],
    "app": "fal-ai/flux/dev",
    "input": {
      "prompt": "$input.prompt"
    }
  },
  "remove_bg": {
    "id": "remove_bg",
    "type": "run",
    "depends": ["generate"],
    "app": "fal-ai/imageutils/rembg",
    "input": {
      "image_url": "$generate.images.0.url"
    }
  },
  "output": {
    "id": "output",
    "type": "display",
    "depends": ["remove_bg"],
    "fields": {
      "image": "$remove_bg.image"
    }
  }
}
```

#### Execute Pre-Built Workflow
Use Fal's pre-built workflows like `workflows/fal-ai/sdxl-sticker`.

### 9. Queue

**Five Operations for Advanced Control:**

#### Submit Request
Queue any model request and get a request ID.

**Example:**
```
Resource: Queue
Operation: Submit Request
Model Endpoint: fal-ai/flux/dev
Input Parameters: {"prompt": "a cute cat"}
```

**Output:**
```json
{
  "request_id": "abc-123",
  "response_url": "https://queue.fal.run/...",
  "status_url": "https://queue.fal.run/.../status",
  "cancel_url": "https://queue.fal.run/.../cancel"
}
```

#### Get Status
Check request status and queue position.

**Example:**
```
Resource: Queue
Operation: Get Status
Request ID: {{ $json.request_id }}
Model Endpoint: fal-ai/flux/dev
Options → Include Logs: true
```

#### Stream Status
Real-time status updates until completion.

#### Get Response
Retrieve the final result.

#### Cancel Request
Cancel a queued request.

### 10. Utility

**Available Operations:**
- **Image Upscale**: Topaz AI (2x or 4x)
- **Video Upscale**: Topaz AI (2x or 4x)
- **Remove Background**: Image or video background removal
- **NSFW Detection**: Content moderation

## Advanced Workflows

### Workflow 1: AI Content Pipeline

**Generate, edit, and upscale an image:**

1. **Fal Node 1** - Generate image
   - Resource: Text to Image
   - Model: FLUX 1.1 Pro
   - Prompt: Your creative prompt

2. **Fal Node 2** - Edit the image
   - Resource: Image Editing
   - Model: FLUX Pro Kontext
   - Image URL: `{{ $('Fal Node 1').item.json.images[0].url }}`
   - Prompt: Your editing instructions

3. **Fal Node 3** - Upscale the result
   - Resource: Utility
   - Operation: Upscale Image
   - Model: Topaz AI
   - Image URL: `{{ $('Fal Node 2').item.json.images[0].url }}`
   - Scale: 4x

### Workflow 2: Queue-Based Processing with Monitoring

**Long-running request with status monitoring:**

1. **Fal Node 1** - Submit request to queue
   - Resource: Queue
   - Operation: Submit Request
   - Model Endpoint: fal-ai/flux/dev
   - Input Parameters: `{"prompt": "detailed artwork"}`

2. **Wait Node** - Wait 5 seconds

3. **Fal Node 2** - Check status
   - Resource: Queue
   - Operation: Get Status
   - Request ID: `{{ $('Fal Node 1').item.json.request_id }}`
   - Model Endpoint: fal-ai/flux/dev
   - Options → Include Logs: true

4. **IF Node** - Check if completed
   - Condition: `{{ $json.status === 'COMPLETED' }}`

5. **Fal Node 3** - Get response (if completed)
   - Resource: Queue
   - Operation: Get Response
   - Request ID: `{{ $('Fal Node 1').item.json.request_id }}`
   - Model Endpoint: fal-ai/flux/dev

### Workflow 3: Multi-Step AI Video Creation

**Text → Image → Video → Upscale:**

1. **Manual Trigger**

2. **Fal Node 1** - Generate concept image
   - Resource: Text to Image
   - Model: FLUX 1.1 Pro
   - Prompt: `{{ $json.concept }}`

3. **Fal Node 2** - Create video from image
   - Resource: Image to Video
   - Model: Kling V1.6 Pro
   - Image URL: `{{ $('Fal Node 1').item.json.images[0].url }}`
   - Duration: 5 seconds

4. **Fal Node 3** - Upscale video
   - Resource: Utility
   - Operation: Upscale Video
   - Video URL: `{{ $('Fal Node 2').item.json.video.url }}`
   - Scale: 2x

### Workflow 4: Image Analysis and Generation Loop

**Analyze an image and generate similar content:**

1. **HTTP Request Node** - Fetch an image URL

2. **Fal Node 1** - Analyze the image
   - Resource: Vision (Image Analysis)
   - Model: GPT-4o
   - Images: `{{ $json.image_url }}`
   - Prompt: `Describe this image in detail, focusing on style, colors, composition, and mood.`

3. **Fal Node 2** - Generate new image based on analysis
   - Resource: Text to Image
   - Model: FLUX 1.1 Pro
   - Prompt: `{{ $('Fal Node 1').item.json.output }}, high quality, professional`

### Workflow 5: Webhook-Based Async Processing

**Submit request with webhook for async completion:**

1. **Webhook Trigger** - Listen for incoming requests

2. **Fal Node 1** - Submit to queue with webhook
   - Resource: Queue
   - Operation: Submit Request
   - Model Endpoint: fal-ai/flux/dev
   - Input Parameters: `{{ $json }}`
   - Options → Webhook URL: `https://your-n8n.com/webhook/fal-result`

3. **Respond to Webhook** - Return request ID
   - Response: `{{ $('Fal Node 1').item.json }}`

4. **Webhook Trigger 2** - Second webhook to receive result
   - URL: `/webhook/fal-result`

5. **Process Result Node** - Handle the completed result

## Tips and Best Practices

### 1. Using Expressions
Access previous node data with expressions:
```javascript
// Get first image URL from previous Fal node
{{ $('Fal').item.json.images[0].url }}

// Get request ID from queue submit
{{ $json.request_id }}

// Conditional prompt based on input
{{ $json.type === 'landscape' ? 'beautiful mountain scene' : 'city skyline' }}
```

### 2. Error Handling
Enable "Continue On Fail" in node settings to handle errors gracefully.

### 3. Rate Limiting
Use **Wait** nodes between requests to avoid rate limits.

### 4. Cost Optimization
- Use faster/cheaper models for testing: FLUX Schnell, Gemini Flash
- Use queue with webhooks for long-running tasks
- Cancel unnecessary requests with Queue → Cancel operation

### 5. Streaming vs Queue
- **Direct execution**: Simple, synchronous, automatic polling
- **Queue operations**: Advanced control, status monitoring, cancellation
- **Webhooks**: Best for long-running tasks, no polling needed

## Troubleshooting

### Issue: "Authentication failed"
- Check your API key is correct
- Ensure API key starts with `fal-`
- Verify key hasn't expired

### Issue: "Request timeout"
- Some models take longer to process
- Use Queue operations for better control
- Consider using webhooks for long-running requests

### Issue: "Invalid parameters"
- Check the Fal.ai documentation for model-specific requirements
- Ensure image/video URLs are publicly accessible
- Verify JSON formatting in custom parameters

### Issue: "Rate limit exceeded"
- Add Wait nodes between requests
- Use queue operations to batch requests
- Upgrade your Fal.ai plan if needed

## Getting Help

- **Documentation**: [fal.ai/docs](https://fal.ai/docs)
- **GitHub Issues**: [Report bugs or request features](https://github.com/ibraschwan/n8n-nodes-fal/issues)
- **n8n Community**: [community.n8n.io](https://community.n8n.io)
- **Fal Discord**: [fal.ai/discord](https://fal.ai/discord)

## Example Workflows (JSON)

### Basic Image Generation
```json
{
  "nodes": [
    {
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [250, 300]
    },
    {
      "name": "Fal",
      "type": "n8n-nodes-fal.fal",
      "position": [450, 300],
      "parameters": {
        "resource": "textToImage",
        "model": "fal-ai/flux-pro/v1.1",
        "prompt": "a beautiful sunset over mountains"
      },
      "credentials": {
        "falApi": {
          "id": "1",
          "name": "Fal API"
        }
      }
    }
  ]
}
```

## Next Steps

1. **Explore Models**: Try different models to find the best fit
2. **Build Workflows**: Combine multiple resources for powerful AI pipelines
3. **Use Queue**: Leverage queue operations for advanced control
4. **Automate**: Connect with other n8n nodes (HTTP, databases, webhooks)
5. **Share**: Publish your workflows to help the community

Happy automating! 🚀
