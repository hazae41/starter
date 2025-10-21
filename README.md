# Starter

Start a cool webapp with React and Tailwind

## Stack

- `deno` for the runtime
- `react` and `react-dom` for rendering
- `tailwindcss` via `@hazae41/rewind` for the styles
- `esbuild` via `@hazae41/glace` for bundling
- `@hazae41/immutable` for immutable caching

## Setup

Install Deno

```bash
npm install -g deno
```

Clone this repository and start building

```bash
git clone https://github.com/hazae41/starter.git && cd ./starter && rm -rf ./.git && git init
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