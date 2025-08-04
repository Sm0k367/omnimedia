# OmniMedia AI API Documentation

## Overview

OmniMedia AI is a cutting-edge, unrestricted AI media generation platform that orchestrates multiple specialized AI agents to create high-quality videos, images, audio, and text content. This documentation provides an overview of the API endpoints and how to use them.

## Table of Contents

- [Orchestrator Service](#orchestrator-service)
  - [Generate Media](#generate-media)
  - [Task Status](#task-status)
  - [Health Check](#health-check)
- [Image Service](#image-service)
  - [Generate Image](#generate-image)
  - [Health Check](#image-health-check)
- [Video Service](#video-service)
  - [Generate Video](#generate-video)
  - [Health Check](#video-health-check)
- [Audio Service](#audio-service)
  - [Generate Audio](#generate-audio)
  - [Health Check](#audio-health-check)
- [Text Service](#text-service)
  - [Generate Text](#generate-text)
  - [Health Check](#text-health-check)

## Orchestrator Service

### Generate Media

**Endpoint:** `POST /generate-media`

**Description:** Start a media generation task.

**Request Body:**

```json
{
  "prompt": "string",
  "output_format": "string",
  "options": {
    "style": ["string"],
    "quality": ["string"],
    "policy": ["string"]
  }
}
```

**Response:**

```json
{
  "task_id": "string"
}
```

### Task Status

**Endpoint:** `GET /task-status/{task_id}`

**Description:** Get the status of a media generation task.

**Response:**

```json
{
  "task_id": "string",
  "status": "string",
  "progress": "integer",
  "result": "any"
}
```

### Health Check

**Endpoint:** `GET /health`

**Description:** Check the health of the orchestrator service.

**Response:**

```json
{
  "status": "healthy"
}
```

## Image Service

### Generate Image

**Endpoint:** `POST /generate`

**Description:** Generate an image based on the given prompt.

**Request Body:**

```json
{
  "prompt": "string",
  "task_id": "string",
  "subtask_id": "string",
  "style": "string",
  "resolution": "string",
  "quality": "string"
}
```

**Response:**

```json
{
  "task_id": "string",
  "subtask_id": "string",
  "result": "string"
}
```

### Health Check

**Endpoint:** `GET /health`

**Description:** Check the health of the image service.

**Response:**

```json
{
  "status": "healthy"
}
```

## Video Service

### Generate Video

**Endpoint:** `POST /generate`

**Description:** Generate a video based on the given prompt.

**Request Body:**

```json
{
  "prompt": "string",
  "task_id": "string",
  "subtask_id": "string",
  "duration": "integer",
  "fps": "integer",
  "quality": "string"
}
```

**Response:**

```json
{
  "task_id": "string",
  "subtask_id": "string",
  "result": "string"
}
```

### Health Check

**Endpoint:** `GET /health`

**Description:** Check the health of the video service.

**Response:**

```json
{
  "status": "healthy"
}
```

## Audio Service

### Generate Audio

**Endpoint:** `POST /generate`

**Description:** Generate audio based on the given prompt.

**Request Body:**

```json
{
  "prompt": "string",
  "task_id": "string",
  "subtask_id": "string",
  "audio_type": "string",
  "voice_id": "string"
}
```

**Response:**

```json
{
  "task_id": "string",
  "subtask_id": "string",
  "result": "string"
}
```

### Health Check

**Endpoint:** `GET /health`

**Description:** Check the health of the audio service.

**Response:**

```json
{
  "status": "healthy"
}
```

## Text Service

### Generate Text

**Endpoint:** `POST /generate`

**Description:** Generate text based on the given prompt.

**Request Body:**

```json
{
  "prompt": "string",
  "task_id": "string",
  "subtask_id": "string",
  "max_tokens": "integer",
  "temperature": "float"
}
```

**Response:**

```json
{
  "task_id": "string",
  "subtask_id": "string",
  "result": "string"
}
```

### Health Check

**Endpoint:** `GET /health`

**Description:** Check the health of the text service.

**Response:**

```json
{
  "status": "healthy"
}
```

---

For more detailed information, please refer to the full API documentation available at [API Documentation](http://localhost:8000/docs).