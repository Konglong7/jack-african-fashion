import { login } from '@/lib/auth';

export async function POST(req: Request) {
  // Wrap the web Request into NextRequest shape expected by auth.login
  const { NextRequest } = await import('next/server');
  const nextReq = new NextRequest(req);
  return login(nextReq);
}
