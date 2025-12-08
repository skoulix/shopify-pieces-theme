#!/usr/bin/env python3
"""
Fix swup:contentReplaced event listener duplication issues.
Replaces direct addEventListener calls with onSwupContentReplaced helper.
"""

import re
import os

SECTIONS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'sections')

# Files to process (excluding header, product, footer which are already fixed)
FILES = [
    '404.liquid',
    'before-after.liquid',
    'blog.liquid',
    'collection.liquid',
    'collections.liquid',
    'contact-form.liquid',
    'faq.liquid',
    'features-grid.liquid',
    'horizontal-scroll.liquid',
    'map.liquid',
    'newsletter.liquid',
    'page.liquid',
    'related-products.liquid',
    'search.liquid',
    'shoppable-videos.liquid',
    'stacking-cards.liquid',
    'team.liquid',
    'testimonials.liquid',
    'text-reveal.liquid',
    'timeline.liquid',
    'video.liquid',
    'hero-orbit.liquid',
]

def get_section_key(filename):
    """Convert filename to a unique key."""
    return filename.replace('.liquid', '').replace('-', '_')

def fix_file(filepath, section_key):
    """Fix swup:contentReplaced listeners in a file."""
    if not os.path.exists(filepath):
        return False

    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Counter for multiple listeners in same file
    counter = [0]

    def replace_listener(match):
        counter[0] += 1
        indent = match.group(1)
        callback = match.group(2)
        key = f"{section_key}_{counter[0]}"

        # Build the replacement
        replacement = f"""{indent}if (window.onSwupContentReplaced) {{
{indent}  window.onSwupContentReplaced('{key}', {callback});
{indent}}}"""
        return replacement

    # Pattern: window.addEventListener('swup:contentReplaced', callback);
    # Handles both arrow functions and function references
    pattern = r"(\s*)window\.addEventListener\('swup:contentReplaced',\s*(\([^)]*\)\s*=>\s*\{[^}]+\}|[a-zA-Z_][a-zA-Z0-9_]*)\);"

    content = re.sub(pattern, replace_listener, content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def main():
    print("Fixing swup:contentReplaced listeners...")

    fixed = 0
    for filename in FILES:
        filepath = os.path.join(SECTIONS_DIR, filename)
        section_key = get_section_key(filename)

        if fix_file(filepath, section_key):
            print(f"  ✓ Fixed {filename}")
            fixed += 1
        else:
            # Check if file exists but has no matches
            if os.path.exists(filepath):
                with open(filepath, 'r') as f:
                    if "swup:contentReplaced" in f.read():
                        print(f"  ⚠ {filename} has complex patterns, may need manual fix")

    print(f"\nFixed {fixed} files")

if __name__ == "__main__":
    main()
