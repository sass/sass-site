// Declare this manually to work around ESM headaches.
declare module 'fancy-ansi' {
    function hasAnsi(input: string): boolean;
    function stripAnsi(input: string): string;
    class FancyAnsi {
        toHtml(input: string): string;
    }
}
