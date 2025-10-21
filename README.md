# Starter

Start a cool webapp with React and Tailwind

## Stack

- `deno` for the runtime
- `react` and `react-dom` for rendering
- `tailwindcss` via `@hazae41/rewind` for the styles
- `esbuild` via `@hazae41/glace` for bundling
- `@hazae41/immutable` for immutable caching

## Setup

### Development

Install Deno

```bash
npm install -g deno
```

Clone this repository

```bash
git clone https://github.com/hazae41/starter.git && cd ./starter && rm -rf ./.git && git init
```

Start building

```bash
deno task develop
```

### Vercel

Just setup the build command

```bash
deno task examine && deno task prepack
```

The output directory

```path
./out
```

The install command

```bash
npm install -g deno
```

## Usage

- Develop

```bash
deno task develop
```


- Test

```bash
deno task examine
```


- Build

```bash
deno task prepack
```

- Serve

```bash
deno task produce
```