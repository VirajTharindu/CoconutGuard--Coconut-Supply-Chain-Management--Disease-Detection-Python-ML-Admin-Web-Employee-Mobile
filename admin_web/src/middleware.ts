import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
    // For a robust Firebase Auth middleware in Next.js, we typically need to check 
    // for a session cookie since standard client-side Firebase Auth doesn't 
    // expose state directly to Edge middleware on first load.
    // However, to keep it simple and client-side focused for now, we will 
    // handle the redirect in a wrapper component or layout.
    
    // For demonstration, we'll let it pass and rely on a client-side guard if we don't implement full cookie-based auth.
    // If the user wants true edge protection, we need firebase-admin and cookie sessions.
    
    // Currently, let's just let it pass and we'll implement a client-side wrapper in layout.tsx.
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
