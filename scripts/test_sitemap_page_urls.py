import importlib.util
import pathlib
import unittest

spec = importlib.util.spec_from_file_location('page_audit', pathlib.Path(__file__).with_name('verify-public-pages.py'))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class SitemapPageUrlsTest(unittest.TestCase):
    def test_image_locations_are_not_crawled_as_html_pages(self):
        xml = '''<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
          <url><loc>https://zamique.com</loc>
            <image:image><image:loc>https://zamique.com/images/factory/sewing.webp</image:loc></image:image>
          </url>
          <url><loc>https://zamique.com/about</loc>
            <image:image><image:loc>https://zamique.com/images/factory/cutting.webp</image:loc></image:image>
          </url>
        </urlset>'''
        self.assertEqual(audit.sitemap_page_urls(xml), ['https://zamique.com', 'https://zamique.com/about'])

    def test_plain_sitemaps_keep_all_html_urls(self):
        xml = '<urlset><url><loc>https://zamique.com/catalog</loc></url></urlset>'
        self.assertEqual(audit.sitemap_page_urls(xml), ['https://zamique.com/catalog'])


if __name__ == '__main__':
    unittest.main()
