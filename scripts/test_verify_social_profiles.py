"""Regression checks for dated owner-verified Organization profiles."""
import importlib.util
import pathlib
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location(
    "page_audit", pathlib.Path(__file__).with_name("verify-public-pages.py")
)
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
PROFILE = "https://www.instagram.com/jack.africanfashion/"
OTHER = "https://www.tiktok.com/@jackafricanfashion"


def claim(url=PROFILE, **overrides):
    return dict(subjectType="brand", subjectId="jack-fashion", field="socialProfile",
                publicValue=url, status="verified", verifiedAt="2026-10-14", **overrides)


class SocialProfileVerification(unittest.TestCase):
    def test_only_configured_and_verified_profiles_are_approved(self):
        self.assertEqual(audit.approved_social_profiles(
            {"socialLinks": {"instagram": PROFILE}}, [claim(), claim(OTHER)], "2026-10-14"
        ), {PROFILE})

    def test_blocked_future_and_expired_claims_remain_excluded(self):
        records = [dict(claim(), status="blocked"),
                   dict(claim(), verifiedAt="2026-10-15"),
                   dict(claim(), expiresAt="2026-10-13")]
        self.assertEqual(audit.approved_social_profiles(
            {"socialLinks": {"instagram": PROFILE}}, records, "2026-10-14"
        ), set())

    def test_platform_homepages_are_not_brand_profiles(self):
        url = "https://www.instagram.com/"
        self.assertEqual(audit.approved_social_profiles(
            {"socialLinks": {"instagram": url}}, [claim(url)], "2026-10-14"
        ), set())

    def test_schema_accepts_a_verified_profile_visible_on_the_page(self):
        page = audit.Page()
        page.links = [PROFILE]
        node = {"@type": "Organization", "@id": "https://zamique.com/#organization",
                "name": "Jack Fashion", "sameAs": [PROFILE]}
        with patch.object(audit, "approved_social_profiles", return_value={PROFILE}, create=True):
            self.assertEqual(audit.inspect_schema(page, "https://zamique.com/about", "/about", [node]), [])

    def test_schema_rejects_unverified_profiles_even_if_the_link_is_visible(self):
        page = audit.Page()
        page.links = [OTHER]
        node = {"@type": "Organization", "@id": "https://zamique.com/#organization",
                "name": "Jack Fashion", "sameAs": [OTHER]}
        with patch.object(audit, "approved_social_profiles", return_value={PROFILE}, create=True):
            self.assertIn("unverified or missing organization social profiles",
                          audit.inspect_schema(page, "https://zamique.com/about", "/about", [node]))

    def test_schema_rejects_a_profile_missing_from_visible_links(self):
        page = audit.Page()
        node = {"@type": "Organization", "@id": "https://zamique.com/#organization",
                "name": "Jack Fashion", "sameAs": [PROFILE]}
        with patch.object(audit, "approved_social_profiles", return_value={PROFILE}, create=True):
            self.assertIn("organization social profile absent from visible links",
                          audit.inspect_schema(page, "https://zamique.com/about", "/about", [node]))


if __name__ == "__main__":
    unittest.main()
