/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './public/index.html',
        './src/**/*.{vue,js,ts}',
        './src/views/**/*.{vue,js,ts}',
        './src/components/**/*.{vue,js,ts}',
    ],
    theme: {
        extend: {
            colors: {
                "dark-100": "#232126",
                "dark-200": "#49474D",
                "dark-300": "#737177",
                "light-100": "#E4E2EB",
                "light-200": "#B2B0B9",
                "light-300": "#828089",
                "accent-100": "#00C9A4",
                "accent-200": "#00A17E",
                "accent-300": "#007A5A",
                "accent-2-100": "#FC1926",
                "accent-2-200": "#D8000C",
                "accent-2-300": "#B50000",
            },
            fontFamily: {
                inter: ['"Inter"']
            }
        }
    },
    plugins: [],
}
