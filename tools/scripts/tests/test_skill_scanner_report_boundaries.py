"""Scanner reports must not publish detected credentials or read linked inputs."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[3]
SPEC = importlib.util.spec_from_file_location('reviewed_skill_scanner', ROOT / 'skills/skill-scanner/scripts/scan_skill.py')
SCANNER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(SCANNER)


class ScannerBoundaries(unittest.TestCase):
    def test_detected_secret_value_is_not_echoed(self):
        secret = 'scanner-fixture-sensitive-value'
        findings = SCANNER.check_secrets('password = "' + secret + '"', 'example.py')
        self.assertTrue(findings)
        self.assertNotIn(secret, json.dumps(findings))

    def test_multiline_private_keys_and_unterminated_blocks_are_redacted(self):
        payload = 'synthetic-key-payload-not-a-real-key'
        for label in ['PRIVATE KEY', 'RSA PRIVATE KEY', 'OPENSSH PRIVATE KEY', 'ENCRYPTED PRIVATE KEY']:
            for ending in ['\n-----END ' + label + '-----', '']:
                value = '-----BEGIN ' + label + '-----\n' + payload + ending
                encoded = json.dumps(SCANNER.redact_report({'frontmatter': {'description': value}}))
                self.assertNotIn(payload, encoded)
                self.assertIn('REDACTED PRIVATE KEY', encoded)

    def test_complete_scan_does_not_echo_private_key_body(self):
        payload = 'synthetic-key-payload-not-a-real-key'
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'SKILL.md').write_text(
                '---\nname: example\ndescription: |\n  -----BEGIN PRIVATE KEY-----\n  '
                + payload + '\n  -----END PRIVATE KEY-----\n---\n', encoding='utf-8')
            result = SCANNER.scan_skill(root)
            self.assertTrue(result['scan_complete'])
            self.assertNotIn(payload, json.dumps(result))

    def test_metadata_and_urls_redacted_without_trusting_hostname(self):
        value = SCANNER.redact_report({'frontmatter': {'api_key': 'fixture-private'},
            'url': 'https://user:fixture-password@github.com/example?token=fixture-query'})
        encoded = json.dumps(value)
        for secret in ['fixture-private', 'fixture-password', 'fixture-query']:
            self.assertNotIn(secret, encoded)
        urls = SCANNER.extract_urls('https://github.com@evil.example/path', 'source.md')
        self.assertEqual(urls[0]['domain'], 'evil.example')
        self.assertFalse(urls[0]['trusted'])

    def test_nested_script_is_covered_and_direct_report_redacted(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'SKILL.md').write_text('---\nname: example\ndescription: Example\napi_key: fixture-private\n---\n', encoding='utf-8')
            script = root / 'scripts/nested/example.mjs'
            script.parent.mkdir(parents=True)
            script.write_text('const password = "scanner-fixture-sensitive-value";', encoding='utf-8')
            result = SCANNER.scan_skill(root)
            self.assertTrue(result['scan_complete'])
            self.assertIn('scripts/nested/example.mjs', result['coverage']['scanned_files'])
            encoded = json.dumps(result)
            self.assertNotIn('fixture-private', encoded)
            self.assertNotIn('scanner-fixture-sensitive-value', encoded)

    def test_linked_entrypoint_does_not_read_target(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / 'skill'; root.mkdir()
            target = Path(directory) / 'private.txt'
            target.write_text('fixture-private-content', encoding='utf-8')
            (root / 'SKILL.md').symlink_to(target)
            result = SCANNER.scan_skill(root)
            self.assertFalse(result['scan_complete'])
            self.assertNotIn('fixture-private-content', json.dumps(result))

    def test_oversized_file_reports_incomplete(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'SKILL.md').write_bytes(b'x' * (SCANNER.MAX_FILE_BYTES + 1))
            self.assertFalse(SCANNER.scan_skill(root)['scan_complete'])


if __name__ == '__main__':
    unittest.main()
