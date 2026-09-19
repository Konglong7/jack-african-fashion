"""
Security regression checks for the local Next.js server.

Run with a server already listening on BASE_URL, for example:
python test_security.py
"""

import json
import os
import urllib.error
import urllib.parse
import urllib.request
from http.cookiejar import CookieJar


BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "dev-only-change-me")


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def request(path, method="GET", body=None, headers=None, opener=None):
    opener = opener or urllib.request.build_opener(NoRedirect)
    data = None if body is None else body.encode("utf-8")
    req = urllib.request.Request(
        urllib.parse.urljoin(BASE_URL, path),
        data=data,
        method=method,
        headers=headers or {},
    )

    try:
        res = opener.open(req, timeout=30)
        return res.status, res.headers, res.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as exc:
        return exc.code, exc.headers, exc.read().decode("utf-8", "ignore")


def assert_true(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    status, headers, _ = request("/admin")
    assert_true(status == 307, f"Expected /admin to redirect when unauthenticated, got {status}")
    assert_true(
        headers.get("location", "").startswith("/admin/login"),
        f"Expected /admin redirect to login, got {headers.get('location')}",
    )

    status, _, body = request("/api/admin/products")
    assert_true(status == 401, f"Expected protected API to return 401, got {status}")
    assert_true("Unauthorized" in body, f"Expected Unauthorized body, got {body[:120]}")

    status, _, body = request(
        "/api/admin/login",
        method="POST",
        body="{bad json",
        headers={"Content-Type": "application/json"},
    )
    assert_true(status == 400, f"Expected malformed login JSON to return 400, got {status}")
    assert_true("Invalid JSON body" in body, f"Expected invalid JSON body error, got {body[:120]}")

    cookie_jar = CookieJar()
    auth_opener = urllib.request.build_opener(NoRedirect, urllib.request.HTTPCookieProcessor(cookie_jar))
    status, _, body = request(
        "/api/admin/login",
        method="POST",
        body=json.dumps({"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}),
        headers={"Content-Type": "application/json"},
        opener=auth_opener,
    )
    assert_true(status == 200, f"Expected valid login to return 200, got {status}: {body[:120]}")
    assert_true(any(cookie.name == "jack_admin_session" for cookie in cookie_jar), "Missing admin session cookie")

    status, _, body = request("/api/admin/products", opener=auth_opener)
    assert_true(status == 200, f"Expected authenticated API to return 200, got {status}: {body[:120]}")
    assert_true('"products"' in body, "Expected products JSON after authenticated request")

    print("security regression checks passed")


if __name__ == "__main__":
    main()
