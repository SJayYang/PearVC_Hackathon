declare module 'react-speech-recognition' {
    export function useSpeechRecognition(): any;
    // export const SpeechRecognition: {
    //     startListening: () => Promise<void>;
    //     // Add other methods here as needed
    // };
    export function startListening(): () => Promise<void>;
    export function stopListening(): () => Promise<void>;
}

