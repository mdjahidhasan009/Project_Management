/// <reference types="vite/client" />

interface ImportMeta {
    readonly env: {
        readonly VITE_ASSET_URL: string;
        // Include other environment variables you might use
        readonly [key: string]: string | boolean | undefined;
    };
}