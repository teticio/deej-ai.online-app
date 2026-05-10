"""Regenerate local JEPA embeddings for this app's NumPy version.

The JEPA repo may create ``embeddings.npy`` with a newer NumPy whose pickle
module paths cannot be read by this app's Python 3.8 environment. This script
uses the JEPA Python environment to read the original artifact, then saves a
local ``model/jepa.npy`` using this app's NumPy.
"""
import argparse
import os
import subprocess
import sys
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT.parent / 'jepa' / 'embeddings' / 'embeddings.npy'
DEFAULT_OUTPUT = ROOT / 'model' / 'jepa.npy'


def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description='Create a local NumPy-compatible JEPA embeddings copy.')
    parser.add_argument(
        '--source',
        type=Path,
        default=DEFAULT_SOURCE,
        help=f'Original JEPA embeddings file. Default: {DEFAULT_SOURCE}')
    parser.add_argument(
        '--source-python',
        type=Path,
        default=None,
        help='Python executable that can load the source embeddings. '
        'Defaults to <source repo>/.venv/bin/python.')
    parser.add_argument(
        '--output',
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f'Local replacement file. Default: {DEFAULT_OUTPUT}')
    parser.add_argument(
        '--force',
        action='store_true',
        help='Replace an existing regular output file. Symlinks are replaced '
        'without this flag.')
    return parser.parse_args()


def source_python_for(source, source_python):
    """Return the Python executable used to load the source artifact."""
    if source_python is not None:
        return source_python

    source_repo = source.resolve().parents[1]
    return source_repo / '.venv' / 'bin' / 'python'


def ensure_safe_paths(source, output, force):
    """Validate source/output paths and protect the source artifact."""
    if not source.exists():
        raise FileNotFoundError(f'Source embeddings file does not exist: {source}')

    output.parent.mkdir(parents=True, exist_ok=True)

    if output.exists() and not output.is_symlink() and not force:
        raise FileExistsError(
            f'Output already exists and is not a symlink: {output}\n'
            'Pass --force to replace it.')

    if (output.exists() and not output.is_symlink()
            and source.resolve() == output.resolve()):
        raise ValueError(
            f'Output resolves to the source artifact: {output}\n'
            'Refusing to overwrite the original JEPA file.')


def export_bridge(source, bridge, source_python):
    """Use the source environment to export pickle-free arrays."""
    code = r"""
import sys
from pathlib import Path

import numpy as np

source = Path(sys.argv[1])
bridge = Path(sys.argv[2])

embeddings = np.load(source, allow_pickle=True).item()
track_ids = np.asarray(list(embeddings), dtype=str)
vectors = np.stack([embeddings[track_id] for track_id in embeddings]).astype(
    np.float32, copy=False)
np.savez(bridge, track_ids=track_ids, embeddings=vectors)
"""
    subprocess.run(
        [str(source_python), '-c', code, str(source), str(bridge)],
        check=True)


def save_local_embeddings(bridge, output):
    """Save local embeddings with this app's NumPy."""
    temp_output = output.with_name(f'.{output.name}.tmp')
    with np.load(bridge, allow_pickle=False) as data:
        track_ids = data['track_ids'].astype(str)
        vectors = data['embeddings'].astype(np.float32, copy=False)

        if output.suffix == '.npz':
            np.savez(temp_output, track_ids=track_ids, embeddings=vectors)
            saved_output = temp_output
            if not saved_output.exists():
                saved_output = temp_output.with_suffix(
                    f'{temp_output.suffix}.npz')
            os.replace(saved_output, output)
            return

        embeddings = {
            track_id: vectors[index]
            for index, track_id in enumerate(track_ids)
        }

    np.save(temp_output, embeddings, allow_pickle=True)
    saved_output = temp_output
    if not saved_output.exists():
        saved_output = temp_output.with_suffix(f'{temp_output.suffix}.npy')

    os.replace(saved_output, output)


def main():
    """Regenerate the local embeddings file."""
    args = parse_args()
    source = args.source.expanduser().resolve()
    output = args.output.expanduser()
    if not output.is_absolute():
        output = ROOT / output
    source_python = source_python_for(source, args.source_python)

    ensure_safe_paths(source, output, args.force)
    if not source_python.exists():
        raise FileNotFoundError(
            f'Source Python executable does not exist: {source_python}')

    bridge = output.with_name(f'.{output.name}.bridge.npz')
    try:
        print(f'Reading source with {source_python}')
        print(f'Source: {source}')
        print(f'Writing temporary bridge: {bridge}')
        export_bridge(source, bridge, source_python)
        print(f'Replacing local embeddings: {output}')
        save_local_embeddings(bridge, output)
    finally:
        if bridge.exists():
            bridge.unlink()

    print('Done. Original source artifact was not modified.')


if __name__ == '__main__':
    main()
