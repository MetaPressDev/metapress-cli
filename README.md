# MetaPress CLI

This command-line tool fetches details about a [MetaPress](https://metapress.dev) enabled website, and allows testing portals for CORS issues.

## Usage

```bash
# Usage: 
npx @metapress/cli info <url>

# Help:
npx @metapress/cli --help

# Example:
npx @metapress/cli info "https://metapress.dev"
```

## Output

```
✔ Completed:
- Title: MetaPress – Your own corner of the Metaverse
- Portal URL: https://metapress.dev/
- Portal Image: https://metapress.dev/wp-content/uploads/2023/12/mpspace.jpg
- Metaverse Provider: MetaPress v1.0.76
- Server: Apache
- Generator: WordPress 6.4.3
```