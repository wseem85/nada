-

```
npm create vite@latest
```

- name it _frontend_

```
cd frontend
```

- install

```
npm install
```

- install other packages

```
npm i react-router-dom axios react-toastify
```

- clean up

- install tailwind

```
npm install tailwindcss @tailwindcss/vite
```

set vite config to use tailwind

```
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
})
```

Import tailwind on index.css

```
// index.css
@import "tailwindcss";
```

And try tailwind classes , to make sure it is working

- to define a theme use `@theme` rule

```
// index.css
@import "tailwindcss";
@theme {
	--color-brand-light: #4c9ead;
	--color-brand: #257180;
	--color-brand-dark: #165864;
	--color-beige-light:#FAF7F0;
	--color-beige:#D8D2C2;
  --color-beige-dark:#B17457
}
```
