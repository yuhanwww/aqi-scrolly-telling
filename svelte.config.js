import adapter from '@sveltejs/adapter-static';

const config = {
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: null
        }),
        paths: {
            base: process.env.NODE_ENV === 'production' ? '/aqi-scrolly-telling' : ''
        },
        prerender: {
            handleHttpError: 'warn'  // ← ignore 404s during build
        }
    }
};

export default config;