# n8n-nodes-fal

This is an n8n community node that integrates with [Fal.ai](https://fal.ai) to provide comprehensive AI capabilities including text generation, image/video generation, and multimodal AI models.

## Features

- **LLM (Text Generation)** with 25+ language models including GPT, Claude, Gemini, DeepSeek, and Llama
- **Text-to-Image** generation using FLUX and Stable Diffusion models
- **Text-to-Video** generation with OpenAI Sora 2 and Google Veo 3.1
- **Image Editing** (image-to-image transformation) with FLUX, Reve, and Seedream
- **Image-to-Video** generation with Sora 2, Veo 3.1, and more
- **Video-to-Video** transformation with Sora 2 Remix
- **Vision Language Models** for image analysis with GPT, Claude, Gemini, Llama
- **Utility Operations** (upscaling, background removal, NSFW detection)
- Support for 60+ AI models across all capabilities
- Queue-based processing with automatic status polling

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

You'll need a Fal.ai API key. You can obtain one from [Fal.ai](https://fal.ai).

## Operations

### LLM (Text Generation)
Generate text using state-of-the-art language models (25+ models):

**OpenAI Models:**
- **GPT-5 Chat** (Premium 10x) - Latest GPT-5 model
- **O3** (Premium 10x) - OpenAI's reasoning model
- **GPT-4.1** (Premium 10x) - Advanced GPT-4
- **GPT-4o** (Premium 10x) - Optimized GPT-4
- GPT-5 Mini, GPT-5 Nano, GPT-4o Mini
- GPT-OSS 120B - Open source variant

**Anthropic Claude:**
- **Claude 3.7 Sonnet** (Premium 10x) - Latest Claude
- **Claude 3.5 Sonnet** (Premium 10x) - Advanced reasoning
- **Claude 3.5 Haiku** (Premium 10x) - Fast Claude
- Claude 3 Haiku

**Google Gemini:**
- **Gemini 2.5 Pro** (Premium 10x) - Most capable Gemini
- **Gemini Pro 1.5** (Premium 10x) - Advanced model
- Gemini 2.5 Flash, Gemini 2.0 Flash
- Gemini Flash 1.5, Flash 1.5 8B
- Gemini 2.5 Flash Lite (default, cost-effective)

**Meta Llama:**
- Llama 3.1 70B, Llama 3.1 8B
- Llama 3.2 3B, Llama 3.2 1B
- Llama 4 Maverick, Llama 4 Scout

**Other:**
- **DeepSeek R1** (Premium 10x) - Advanced reasoning model

**Features:**
- System prompts for custom instructions
- Temperature control (0-2) for creativity/consistency
- Max tokens configuration
- Priority settings (throughput/latency)
- Reasoning mode for compatible models

### Text to Image
Generate images from text prompts using various AI models:
- **FLUX 1.1 Pro** - High-quality text-to-image generation
- **FLUX 1 Pro/Dev/Schnell** - Professional and fast variants
- **Stable Diffusion XL** - Fast SDXL generation
- **Stable Diffusion 3.5 Large** - Latest SD model

### Text to Video
Generate videos from text prompts with state-of-the-art models:
- **Sora 2 Pro** - OpenAI's richly detailed videos with audio
- **Sora 2** - OpenAI's state-of-the-art video generation with audio
- **Veo 3.1** - Google's most advanced AI video generation with sound
- **Veo 3.1 Fast** - Faster and more cost-effective version
- Supports 4s, 6s, and 8s video durations
- Multiple aspect ratios (16:9, 9:16, 1:1)
- Audio generation support

### Image Editing
Edit and transform existing images using text prompts:
- **Reve Edit** - Transform images via text prompts
- **Nano Banana Edit** - Google's state-of-the-art editing model
- **Seedream V4 Edit** - ByteDance unified generation/editing
- **FLUX Pro Kontext** - Targeted local edits and scene transformations
- **FLUX Kontext LoRA** - Fast editing with LoRA support

### Image to Video
Convert images into videos using AI models:
- **Sora 2 Pro Image to Video** - OpenAI's richly detailed videos with audio from images
- **Sora 2 Image to Video** - OpenAI's state-of-the-art image to video with audio
- **Veo 3.1 Image to Video** - Google's state-of-the-art image animation
- **Veo 3.1 First-Last Frame** - Generate videos from start/end frames
- **Veo 3.1 Reference to Video** - Videos from reference images
- **Kling V1.6 Pro/Standard** - High-quality image to video
- **Runway Gen3** - Fast Turbo generation
- **Luma Dream Machine** - Luma AI video generation

### Video to Video
Transform and remix existing videos:
- **Sora 2 Remix** - Transform videos based on text/image prompts
  - Rich edits and style changes
  - Creative reinterpretations
  - Preserves motion and structure
  - Supports aspect ratio and duration customization

### Vision (Image Analysis)
Analyze images using vision language models:
- **Gemini 2.5 Flash/Pro** - Google's latest vision models
- **Claude 3.7/3.5 Sonnet** - Anthropic's advanced vision AI
- **GPT-4o** - OpenAI's vision model
- **Llama 3.2 90B Vision** - Meta's vision model
- Support for multiple images per request
- Customizable temperature and token limits

### Utility
Professional-grade utility operations:
- **Image Upscaling** - Enhance images with Topaz AI (2x or 4x)
- **Video Upscaling** - Professional video upscaling with Topaz (2x or 4x)
- **Remove Background (Image)** - Bria RMBG 2.0 for clean cutouts
- **Remove Background (Video)** - Automatic video background removal
- **NSFW Detection** - Predict if images are NSFW or SFW

## Compatibility

Tested with n8n version 1.0.0 and above.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Fal.ai Documentation](https://fal.ai/docs)

## License

MIT
