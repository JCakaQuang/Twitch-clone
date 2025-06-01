import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|api/webhooks|.*\\.(?:css|js|png|jpg|jpeg|svg|woff|woff2|ttf|ico|json)).*)',
    '/api/:path((?!webhooks).*)',
    '/trpc/:path((?!webhooks).*)',
  ],
};

