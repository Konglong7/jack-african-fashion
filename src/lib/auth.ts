import { NextRequest, NextResponse } from 'next/server';
import { loginRateLimiter } from './rateLimit';
import { readJsonBody } from './apiRequest';

const SESSION_COOKIE = 'jack_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * 仅用于本机开发的兜底值 —— 刻意写成一眼可辨的占位串。
 * 生产环境必须通过 .env.local / 环境变量注入真实值（见下方 production 分支的强制校验）。
 */
const DEV_FALLBACK = {
  username: 'admin',
  password: 'dev-only-change-me'
} as const;

const DEV_FALLBACK_SECRET = 'dev-only-insecure-secret-please-replace-me';

let warnedAboutDevDefaults = false;

function warnOnceIfUsingDevDefaults(usingDefaults: boolean) {
  if (!usingDefaults || warnedAboutDevDefaults) return;
  warnedAboutDevDefaults = true;
  console.warn(
    [
      '',
      '============================================================',
      ' [SECURITY] 正在使用代码内置的开发兜底管理员口令 / 会话密钥。',
      ' 该值已公开在源码中，任何人都能登录管理后台并伪造会话。',
      ' 仅可用于本机开发；上线前请在 .env.local 中设置：',
      '   ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_SECRET',
      ' 生成强密钥：node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
      '============================================================',
      ''
    ].join('\n')
  );
}

function getCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;

  if (process.env.NODE_ENV === 'production') {
    if (!username || !password || !secret) {
      throw new Error(
        'ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SECRET must be set in production. Check your .env.local or environment variables.'
      );
    }
    if (secret.length < 32) {
      throw new Error('ADMIN_SECRET must be at least 32 characters in production.');
    }
  }

  const usingDefaults = !username || !password || !secret;
  warnOnceIfUsingDevDefaults(usingDefaults);

  return {
    username: username || DEV_FALLBACK.username,
    password: password || DEV_FALLBACK.password,
    secret: secret || DEV_FALLBACK_SECRET
  };
}

async function sign(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return arrayBufferToHex(signature);
}

export async function login(req: NextRequest): Promise<NextResponse> {
  const identifier = getClientIdentifier(req);
  if (loginRateLimiter.isBlocked(identifier)) {
    return NextResponse.json(
      { ok: false, error: 'Too many failed login attempts. Try again later.' },
      { status: 429 }
    );
  }

  const body = await readJsonBody(req);
  if (!body.ok) {
    return NextResponse.json({ ok: false, error: body.error }, { status: 400 });
  }

  const { username, password } = body.data as { username: string; password: string };
  const creds = getCredentials();

  const usernameMatch = username === creds.username;
  const passwordMatch = password === creds.password;

  if (usernameMatch && passwordMatch) {
    loginRateLimiter.recordSuccess(identifier);
    const expires = Date.now() + MAX_AGE_SECONDS * 1000;
    const token = `${expires}.${await sign(String(expires), creds.secret)}`;
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE_SECONDS,
      path: '/'
    });
    return res;
  }

  loginRateLimiter.recordFailure(identifier);
  return NextResponse.json({ ok: false, error: 'Invalid username or password' }, { status: 401 });
}

export function logout(): NextResponse {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}

export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const [expiresStr, sig] = token.split('.');
  if (!expiresStr || !sig) return false;

  const expires = Number(expiresStr);
  if (Number.isNaN(expires) || Date.now() > expires) return false;

  const { secret } = getCredentials();
  const expectedSig = await sign(expiresStr, secret);
  return constantTimeEqual(expectedSig, sig);
}

function getClientIdentifier(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwardedFor || req.headers.get('x-real-ip') || 'local';
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function constantTimeEqual(a: string, b: string): boolean {
  const maxLength = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;

  for (let i = 0; i < maxLength; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }

  return diff === 0;
}
