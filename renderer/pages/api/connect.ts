// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import WebSocket from 'ws';

// Make sure this function is async to properly handle async operations
export default async function handler(req: NextRequest) {
    // Conditionally handle WebSocket setup only for a specific path
    if (req.nextUrl.pathname.startsWith('/api/connect')) {
        const ws = new WebSocket('ws://172.26.192.1:4455');

        ws.on('open', function open() {
            console.log("WebSocket connection opened.");
            ws.send('something');
        });

        ws.on('message', function incoming(data) {
            console.log("Received from WebSocket:", data);
            // Handling WebSocket messages here is not typical as responses cannot be sent back to HTTP client.
        });

        ws.on('close', function close() {
            console.log("WebSocket connection closed.");
        });

        ws.on('error', function error(err) {
            console.error("WebSocket error:", err);
        });

        // Since middleware can't wait for WebSocket events, this might not work as expected:
        return new Response('WebSocket setup initiated', { status: 200 });
    }

    // Continue with the normal flow for other requests
    return NextResponse.next();
}
