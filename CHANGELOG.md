# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-20

### Added

#### LLM (Text Generation)
- Support for 26 language models including:
  - OpenAI: GPT-5 Chat, O3, GPT-4.1, GPT-4o, GPT-4o Mini, GPT-5 Mini/Nano, GPT-OSS 120B
  - Anthropic: Claude 3.7 Sonnet, Claude 3.5 Sonnet/Haiku, Claude 3 Haiku
  - Google: Gemini 2.5 Pro/Flash/Lite, Gemini 2.0 Flash, Gemini Flash 1.5/8B, Gemini Pro 1.5
  - Meta: Llama 3.1 70B/8B, Llama 3.2 3B/1B, Llama 4 Maverick/Scout
  - DeepSeek R1 reasoning model
- System prompts, temperature control, max tokens, priority settings, reasoning mode

#### Text-to-Image
- 6 models: FLUX 1.1 Pro, FLUX 1 Pro/Dev/Schnell, Stable Diffusion XL, Stable Diffusion 3.5 Large
- Customizable image sizes, guidance scale, inference steps, safety checks

#### Text-to-Video
- 4 models: Sora 2 Pro, Sora 2, Veo 3.1, Veo 3.1 Fast
- Video durations (4s, 6s, 8s), multiple aspect ratios, audio generation

#### Image Editing
- 5 models: Reve Edit, Nano Banana Edit, Seedream V4 Edit, FLUX Pro Kontext, FLUX Kontext LoRA
- Text-guided image transformations and style changes

#### Image-to-Video
- 12 models including Sora 2 Pro/Standard, Veo 3.1 variants, Kling V1.6/V1.5, Runway Gen3, Luma Dream Machine
- Support for first-last frame generation and reference-based video creation

#### Video-to-Video
- Sora 2 Remix for video transformations based on text/image prompts
- Preserves motion and structure while enabling creative edits

#### Vision (Image Analysis)
- 8 vision language models: Gemini 2.5, Claude 3.7/3.5, GPT-4o, Llama 3.2 90B Vision
- Multi-image analysis support, customizable parameters

#### Workflow
- Execute custom workflow definitions
- Execute pre-built workflow endpoints
- Chain multiple Fal models in sequence
- Webhook support for asynchronous processing
- Queue-based execution with automatic polling

#### Utility Operations
- Image upscaling (Topaz AI, 2x/4x)
- Video upscaling (Topaz AI, 2x/4x)
- Background removal for images and videos (Bria RMBG 2.0)
- NSFW detection (X-AILab)

### Technical Features
- Queue-based processing with automatic status polling
- Comprehensive error handling with retry logic
- Support for 60+ AI models across all capabilities
- Full TypeScript implementation
- CI/CD pipeline with GitHub Actions

[1.0.0]: https://github.com/ibraschwan/n8n-nodes-fal/releases/tag/v1.0.0
