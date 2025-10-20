# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **n8n community node** for Fal.ai that provides AI capabilities including text generation (LLM), image/video generation, image editing, vision models, workflow execution, and queue management. The node integrates 60+ AI models from OpenAI, Anthropic, Google, Meta, and others through the Fal.ai API.

**Package name:** `@ibracob.dev/n8n-nodes-falai` (published on npm)

## Build System

This project uses the **official `@n8n/node-cli` toolchain** for building n8n community nodes.

### Commands

```bash
# Install dependencies (use --legacy-peer-deps due to eslint version conflicts)
npm install --legacy-peer-deps

# Build for production
npm run build

# Development mode with live reload
npm run dev

# Lint code
npm run lint

# Auto-fix linting issues
npm run lintfix

# Format code
npm run format

# Publish to npm (runs prepublishOnly hook automatically)
npm publish --access public
```

### Build Process Details

The `npm run build` script does two things:
1. `n8n-node build` - Compiles TypeScript and copies static files (SVG icons)
2. `cp nodes/Fal/Fal.node.json dist/nodes/Fal/` - Manually copies the node codex file

**Important:** The `.node.json` file is **not** automatically copied by `@n8n/node-cli`, so the manual `cp` step is required.

## Architecture

### Node Structure

The node follows n8n's **resource-based architecture** pattern:

```
nodes/Fal/
├── Fal.node.ts              # Main node class (exports `Fal`)
├── Fal.node.json            # Node codex/metadata (CRITICAL for n8n discovery)
├── fal-ai-logo.svg          # Node icon
├── resources/               # Each resource is a sub-feature
│   ├── text-to-image/
│   │   ├── index.ts        # Exports description and execute
│   │   ├── description.ts  # UI field definitions
│   │   ├── models.ts       # TypeScript enums/types
│   │   └── execute/
│   │       └── index.ts    # API call logic
│   ├── llm/
│   ├── image-editing/
│   ├── queue/
│   ├── workflow/
│   └── ... (10 resources total)
└── utils/
    └── poll-queue.util.ts   # Shared queue polling logic
```

Each resource exports:
- `description` - n8n property definitions for UI fields
- `execute` - Function that makes API calls and returns results

### Main Node File (`Fal.node.ts`)

The main node class:
1. Imports all resources as namespace imports (`import * as textToImage`)
2. Spreads resource descriptions into the node's `properties` array
3. Routes execution to the appropriate resource based on the selected `resource` parameter
4. Returns `INodeExecutionData[][]` (array of arrays)

### Credentials (`credentials/FalApi.credentials.ts`)

Simple API key authentication:
- Header format: `Authorization: Key {{$credentials.apiKey}}`
- Test endpoint: `GET https://queue.fal.run/fal-ai/fast-sdxl/requests`

### Queue Polling Pattern

Most resources use **automatic queue-based processing** via `utils/poll-queue.util.ts`:

1. Submit request to Fal API (returns `request_id`)
2. Poll status every 2 seconds (max 60 attempts = 2 minutes)
3. When status is `COMPLETED`, fetch and return the response

The **Queue resource** provides manual control over this process with 5 operations:
- Submit Request
- Get Status
- Stream Status (SSE)
- Get Response
- Cancel Request

## Critical Files for n8n

### `nodes/Fal/Fal.node.json` (Node Codex)

**This file is CRITICAL.** It tells n8n how to discover and load the node.

```json
{
  "node": "@ibracob.dev/n8n-nodes-falai",  // MUST match package name
  "nodeVersion": "1.0",
  "codexVersion": "1.0",
  "categories": ["AI"]
}
```

**Common mistake:** Setting `"node"` to the internal node name (`"fal"`) instead of the package name. This causes "Unrecognized node type" errors.

### `package.json` n8n Configuration

```json
{
  "n8n": {
    "n8nNodesApiVersion": 1,
    "strict": true,
    "credentials": ["dist/credentials/FalApi.credentials.js"],
    "nodes": ["dist/nodes/Fal/Fal.node.js"]
  }
}
```

## Adding New Resources

To add a new resource (e.g., "audio-generation"):

1. **Create directory structure:**
   ```
   nodes/Fal/resources/audio-generation/
   ├── index.ts
   ├── description.ts
   ├── models.ts
   └── execute/
       └── index.ts
   ```

2. **Define models (`models.ts`):**
   ```typescript
   export enum AudioModel {
     MusicGen = 'fal-ai/musicgen',
   }
   ```

3. **Create UI description (`description.ts`):**
   ```typescript
   import { INodeProperties } from 'n8n-workflow';

   export const description: INodeProperties[] = [
     {
       displayName: 'Model',
       name: 'model',
       type: 'options',
       displayOptions: { show: { resource: ['audioGeneration'] } },
       options: [/* model options */],
       default: AudioModel.MusicGen,
     },
     // ... more fields
   ];
   ```

4. **Implement execution (`execute/index.ts`):**
   ```typescript
   import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
   import { pollQueue } from '../../utils/poll-queue.util';

   export async function execute(
     this: IExecuteFunctions,
     index: number,
   ): Promise<INodeExecutionData[]> {
     const model = this.getNodeParameter('model', index) as string;
     const prompt = this.getNodeParameter('prompt', index) as string;

     const response = await this.helpers.httpRequestWithAuthentication.call(
       this, 'falApi', {
         method: 'POST',
         url: `/${model}`,
         body: { prompt },
       },
     );

     const result = await pollQueue.call(this, response.request_id);
     return [{ json: result }];
   }
   ```

5. **Export from index (`index.ts`):**
   ```typescript
   import * as execute from './execute';
   export { description } from './description';
   export { execute };
   ```

6. **Register in main node (`Fal.node.ts`):**
   ```typescript
   import * as audioGeneration from './resources/audio-generation';

   // Add to properties array:
   ...audioGeneration.description,

   // Add to resource options:
   { name: 'Audio Generation', value: 'audioGeneration' },

   // Add to execute() switch:
   else if (resource === 'audioGeneration') {
     responseData = await audioGeneration.execute.execute.call(this, i);
   }
   ```

## Common Patterns

### Parameter Retrieval
```typescript
const model = this.getNodeParameter('model', index) as string;
const prompt = this.getNodeParameter('prompt', index) as string;
const options = this.getNodeParameter('options', index, {}) as IDataObject;
```

### Making Authenticated API Calls
```typescript
const response = await this.helpers.httpRequestWithAuthentication.call(
  this,
  'falApi',  // credential type name
  {
    method: 'POST',
    url: '/fal-ai/flux/dev',
    body: { prompt, image_size: 'landscape_4_3' },
  },
);
```

### Handling Queue Responses
```typescript
// Automatic polling (recommended)
const result = await pollQueue.call(this, response.request_id);
return [{ json: result }];

// Manual queue handling (for Queue resource)
return [{ json: { request_id: response.request_id, status_url: response.status_url } }];
```

## Publishing Workflow

1. Update version in `package.json`
2. Run `npm run build` to test build
3. Run `npm publish --access public` (triggers `prepublishOnly` hook)
4. Commit changes and create git tag: `git tag v0.1.x`
5. Push: `git push && git push origin v0.1.x`

## Testing in n8n

### Local Development
```bash
# In this project
npm run build

# In n8n installation
cd ~/.n8n/custom/
npm link /path/to/n8n-nodes-falai

# Restart n8n
```

### From npm
```bash
# In n8n UI: Settings → Community Nodes → Install
# Enter: @ibracob.dev/n8n-nodes-falai

# Or manually in n8n container/instance:
npm install @ibracob.dev/n8n-nodes-falai -g

# Restart n8n to load the node
```

## Troubleshooting

### "Unrecognized node type" Error

**Cause:** The `"node"` field in `Fal.node.json` doesn't match the package name.

**Fix:** Ensure `nodes/Fal/Fal.node.json` has:
```json
{
  "node": "@ibracob.dev/n8n-nodes-falai"
}
```

### Node Doesn't Appear in n8n

1. Check if installed: `ls ~/.n8n/nodes/node_modules/@ibracob.dev/n8n-nodes-falai`
2. Verify `Fal.node.json` exists in installed package: `cat ~/.n8n/nodes/node_modules/@ibracob.dev/n8n-nodes-falai/dist/nodes/Fal/Fal.node.json`
3. Check for conflicting packages: `cat ~/.n8n/nodes/package.json`
4. Restart n8n after installation

### Build Fails with n8n-workflow Not Found

**Fix:** Add `n8n-workflow` to devDependencies and install with `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps
```

## Dependencies

- **@n8n/node-cli** - Official n8n build toolchain
- **n8n-workflow** - n8n workflow type definitions (peer dependency, also in devDependencies)
- **TypeScript 5.3+** - Language
- **ESLint 9.32+** - Linting (required by @n8n/node-cli)
- **Prettier** - Code formatting

## API Integration

All resources interact with the **Fal.ai Queue API** at `https://queue.fal.run`. The typical flow:

1. POST to `/{model-endpoint}` → receives `{request_id, status_url, response_url}`
2. Poll GET `/{model-endpoint}/requests/{request_id}/status` → receives `{status: "IN_PROGRESS" | "COMPLETED"}`
3. GET response_url → receives final result

Authentication: `Authorization: Key {api_key}`
