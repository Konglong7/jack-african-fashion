import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from runtime_data_copy import atomic_json_copy


class AtomicSnapshotTests(unittest.TestCase):
    def test_invalid_source_keeps_the_existing_snapshot(self):
        with tempfile.TemporaryDirectory(prefix='jack-runtime-copy-') as root:
            source, target = Path(root)/'source.json', Path(root)/'target.json'
            source.write_text('damaged')
            target.write_text('preserved')
            with self.assertRaises(json.JSONDecodeError):
                atomic_json_copy(source, target, 'analytics')
            self.assertEqual(target.read_text(), 'preserved')

    def test_valid_snapshot_retains_counters_and_source_bytes(self):
        with tempfile.TemporaryDirectory(prefix='jack-runtime-copy-') as root:
            source, target = Path(root)/'source.json', Path(root)/'target.json'
            data = {'totals': {'page_view': 765, 'whatsapp_click': 84}, 'recent': []}
            source.write_text(json.dumps(data))
            initial = source.read_bytes()
            copied = atomic_json_copy(source, target, 'analytics')
            self.assertEqual(copied, data)
            self.assertEqual(target.read_bytes(), initial)
            self.assertEqual(source.read_bytes(), initial)

    def test_replace_failure_keeps_target_and_removes_the_temporary_copy(self):
        with tempfile.TemporaryDirectory(prefix='jack-runtime-copy-') as root:
            source, target = Path(root)/'source.json', Path(root)/'target.json'
            source.write_text(json.dumps({'totals': {'page_view': 1, 'whatsapp_click': 0}, 'recent': []}))
            target.write_text('preserved')
            with patch('runtime_data_copy.os.replace', side_effect=OSError('Simulated failure')):
                with self.assertRaises(OSError):
                    atomic_json_copy(source, target, 'analytics')
            self.assertEqual(target.read_text(), 'preserved')
            self.assertEqual(len(list(Path(root).iterdir())), 2)


if __name__ == '__main__':
    unittest.main()
