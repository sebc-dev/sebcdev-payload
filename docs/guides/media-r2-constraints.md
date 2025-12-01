# Media R2 Storage Constraints

This document describes the constraints and limitations when using Cloudflare R2 for media storage in this Payload CMS application deployed on Cloudflare Workers.

**Audience**: Developers, DevOps

## R2 Upload Limitations

### Upload Size Limits (via Workers Binding)

When uploading files through a Cloudflare Worker (which is how this application handles uploads), the following size limits apply based on your Cloudflare plan:

| Plan       | Max Upload Size |
| ---------- | --------------- |
| Free       | 100 MiB         |
| Pro        | 100 MiB         |
| Business   | 200 MiB         |
| Enterprise | 500 MiB         |

> **Note**: These limits apply to single PUT requests through Workers. For larger files, use [multipart uploads](#large-files-100-mib) or presigned URLs.

### Object Constraints

| Constraint          | Limit        |
| ------------------- | ------------ |
| Max object size     | 5 TiB        |
| Object key length   | 1,024 bytes  |
| Object metadata     | 8,192 bytes  |
| Custom metadata     | 2,048 bytes  |
| Metadata key length | 1,024 bytes  |

### Request Limits

- **Requests per second**: 1,000+ (automatically scales)
- **Bandwidth**: No egress fees (unlike S3)
- **Storage**: $0.015/GB-month (after free tier)

## Workers Platform Limitations

### No Sharp Library

The Cloudflare Workers runtime does not support the Sharp image processing library. This has the following implications:

**Impact on Payload CMS**:

- Image cropping is disabled (`crop: false`)
- Focal point selection is disabled (`focalPoint: false`)
- No server-side image resizing or optimization

**Current Media Collection Configuration**:

```typescript
// src/collections/Media.ts
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Sharp-dependent features disabled for Workers compatibility
    crop: false,
    focalPoint: false,
    // ... other config
  },
}
```

**Workaround**: Use [Cloudflare Images](#image-transformations) for on-the-fly image transformations.

### Memory and CPU Limits

| Resource   | Free Plan  | Paid Plans |
| ---------- | ---------- | ---------- |
| CPU time   | 10ms       | 50ms       |
| Memory     | 128 MB     | 128 MB     |
| Subrequests| 50         | 1,000      |

Large file uploads may approach these limits. Monitor Worker analytics for errors.

## Local Development vs Production

### Wrangler R2 Simulation

During local development, Wrangler simulates R2 storage:

- **Location**: `.wrangler/state/v3/r2/`
- **Persistence**: Data persists between `pnpm dev` sessions
- **Behavior**: Nearly identical to production R2

### Key Differences

| Aspect            | Local (Wrangler)                    | Production (R2)              |
| ----------------- | ----------------------------------- | ---------------------------- |
| Storage location  | `.wrangler/state/v3/r2/`            | Cloudflare R2 bucket         |
| Persistence       | Local filesystem                    | Globally distributed         |
| URL format        | `http://localhost:3000/api/media/*` | Worker route + R2 binding    |
| Latency           | Near-instant                        | ~10-50ms (edge network)      |
| Quotas            | Unlimited                           | Plan-based limits            |

### Testing Recommendations

1. **Unit/Integration Tests**: Use Wrangler's simulated R2
2. **Pre-deployment**: Test in Cloudflare preview environment
3. **Production validation**: Verify R2 bucket in Cloudflare Dashboard

```bash
# Deploy to preview environment
pnpm exec wrangler deploy --env preview

# Check R2 bucket contents
pnpm exec wrangler r2 object list media-bucket
```

## CORS Configuration

### When CORS is Needed

CORS configuration is required when:

- Direct browser access to R2 bucket URLs
- Client-side uploads directly to R2
- Cross-origin requests to bucket endpoints

### Current Setup

This application serves media through the Worker, so **CORS is not required** for normal operation. The Worker acts as a proxy:

```
Browser → Worker (same origin) → R2 Bucket
```

### Example CORS Policy (if needed)

If you need direct R2 access, configure CORS in `wrangler.jsonc`:

```jsonc
{
  "r2_buckets": [
    {
      "binding": "R2_BUCKET",
      "bucket_name": "media-bucket",
      "cors": {
        "allowed_origins": ["https://yourdomain.com"],
        "allowed_methods": ["GET", "HEAD"],
        "allowed_headers": ["*"],
        "max_age_seconds": 86400
      }
    }
  ]
}
```

Or via Cloudflare Dashboard: **R2 > Bucket > Settings > CORS Policy**.

## Performance Considerations

### R2 Read Latency

- **First byte**: 10-50ms from nearest edge
- **Subsequent requests**: Cached at edge (if using Cache API)
- **Geographic distribution**: R2 automatically replicates globally

### Caching Strategies

**1. Cache API (recommended)**:

```typescript
// In your Worker
const cache = caches.default
const cached = await cache.match(request)
if (cached) return cached

const response = await env.R2_BUCKET.get(key)
// Cache for 1 hour
const headers = new Headers(response.headers)
headers.set('Cache-Control', 'public, max-age=3600')
await cache.put(request, response.clone())
return response
```

**2. Browser Caching**:

Payload's R2 storage plugin sets appropriate `Cache-Control` headers.

**3. Cloudflare CDN**:

Static assets are automatically cached at Cloudflare's edge.

### Image Optimization via Cloudflare Images

For production image optimization, consider Cloudflare Images:

```
https://imagedelivery.net/<account_hash>/<image_id>/<variant>
```

Benefits:

- On-the-fly resizing and format conversion
- WebP/AVIF automatic serving
- No Worker CPU usage

## Workarounds and Alternatives

### Image Transformations

Since Sharp is unavailable, use **Cloudflare Images** for transformations:

1. **Enable Cloudflare Images** in your Cloudflare Dashboard
2. **Upload workflow**: R2 → Cloudflare Images → Transformed URL
3. **URL format**: `https://imagedelivery.net/<hash>/<id>/w=800,h=600`

**Transformation options**:

- Resize: `w=800`, `h=600`, `fit=contain`
- Format: `format=webp`, `format=avif`
- Quality: `quality=80`

### Large Files (>100 MiB)

For files exceeding Worker upload limits, use **presigned URLs**:

```typescript
// Generate presigned URL for direct upload
const url = await env.R2_BUCKET.createMultipartUpload(key)

// Or use presigned PUT URL
const signedUrl = await getSignedUrl(env.R2_BUCKET, key, {
  action: 'write',
  expiresIn: 3600,
})
```

Client uploads directly to R2, bypassing Worker limits.

### Batch Operations

For bulk operations, use the R2 API directly:

```bash
# List all objects
pnpm exec wrangler r2 object list media-bucket

# Delete multiple objects
pnpm exec wrangler r2 object delete media-bucket --key "path/to/file1"
pnpm exec wrangler r2 object delete media-bucket --key "path/to/file2"
```

Or via Workers API:

```typescript
// Batch delete
const keys = ['file1.png', 'file2.png', 'file3.png']
await Promise.all(keys.map((key) => env.R2_BUCKET.delete(key)))
```

## Troubleshooting

### Upload fails with 413 error

**Symptom**: `413 Request Entity Too Large` or upload timeout

**Cause**: File exceeds plan's upload limit (100 MiB Free/Pro, 200 MiB Business)

**Solutions**:

1. Compress file before upload
2. Upgrade Cloudflare plan for higher limits
3. Use presigned URLs for direct R2 upload (bypasses Worker)
4. Implement chunked/multipart upload

### Image URL not accessible

**Symptom**: 404 or access denied on media URLs

**Causes & Solutions**:

| Cause                    | Solution                                           |
| ------------------------ | -------------------------------------------------- |
| Missing R2 binding       | Check `wrangler.jsonc` has `R2_BUCKET` binding     |
| Incorrect bucket name    | Verify bucket name matches in config               |
| Worker route not set     | Ensure route covers `/api/media/*` paths           |
| Object doesn't exist     | Check R2 bucket in Dashboard for the file          |

**Debug command**:

```bash
# List objects in bucket
pnpm exec wrangler r2 object list media-bucket

# Check specific object
pnpm exec wrangler r2 object get media-bucket --key "path/to/file.png"
```

### Local R2 empty after restart

**Symptom**: Uploaded files disappear after stopping `pnpm dev`

**Cause**: By default, Wrangler persists R2 data. If missing, check:

1. `.wrangler/state/v3/r2/` directory exists
2. Wrangler version is up to date
3. `--persist` flag is not disabled

**Solution**:

```bash
# Ensure persistence is enabled (default)
pnpm dev

# Check persisted data
ls -la .wrangler/state/v3/r2/
```

### Upload succeeds but file not in R2

**Symptom**: Payload shows success, but file missing from bucket

**Causes**:

1. R2 binding misconfigured
2. Storage plugin error (check Worker logs)
3. Transaction rollback

**Debug**:

```bash
# Check Worker logs
pnpm exec wrangler tail

# Verify R2 binding
pnpm exec wrangler r2 bucket list
```

## References

### Cloudflare Documentation

- [R2 Documentation](https://developers.cloudflare.com/r2/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Cloudflare Images](https://developers.cloudflare.com/images/)

### Payload CMS Documentation

- [Payload Storage R2 Plugin](https://payloadcms.com/docs/plugins/storage-r2)
- [Upload Collection](https://payloadcms.com/docs/upload/overview)
- [Media Configuration](https://payloadcms.com/docs/upload/config)

### Related Project Files

- `src/collections/Media.ts` - Media collection configuration
- `src/payload.config.ts` - R2 storage plugin setup
- `wrangler.jsonc` - Cloudflare bindings configuration
