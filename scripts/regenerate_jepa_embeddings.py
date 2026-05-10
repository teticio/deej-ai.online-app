"""Regenerate local memory-efficient embedding arrays for this app.

The JEPA repo may create ``embeddings.npy`` with a newer NumPy whose pickle
module paths cannot be read by this app's Python 3.8 environment. This script
uses the JEPA Python environment to read the original artifact, then saves
pickle-free, row-aligned ``*_ids.npy`` and ``*_vectors.npy`` files for fast
startup with memory mapping.
"""
import argparse
import os
import pickle
import subprocess
import sys
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT.parent / 'jepa' / 'embeddings' / 'embeddings.npy'
DEFAULT_OUTPUT_PREFIX = ROOT / 'model' / 'jepa'


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
        '--output-prefix',
        type=Path,
        default=DEFAULT_OUTPUT_PREFIX,
        help=f'Local replacement prefix. Default: {DEFAULT_OUTPUT_PREFIX}')
    parser.add_argument(
        '--force',
        action='store_true',
        help='Replace existing regular output files. Symlinks are replaced '
        'without this flag.')
    return parser.parse_args()


def source_python_for(source, source_python):
    """Return the Python executable used to load the source artifact."""
    if source_python is not None:
        return source_python

    source_repo = source.resolve().parents[1]
    return source_repo / '.venv' / 'bin' / 'python'


def output_paths(prefix):
    """Return IDs and vectors paths for an embedding-store prefix."""
    return (prefix.with_name(f'{prefix.name}_ids.npy'),
            prefix.with_name(f'{prefix.name}_vectors.npy'))


def ensure_safe_paths(source, prefix, force):
    """Validate source/output paths and protect the source artifact."""
    if not source.exists():
        raise FileNotFoundError(f'Source embeddings file does not exist: {source}')

    prefix.parent.mkdir(parents=True, exist_ok=True)

    for output in output_paths(prefix):
        if output.exists() and not output.is_symlink() and not force:
            raise FileExistsError(
                f'Output already exists and is not a symlink: {output}\n'
                'Pass --force to replace it.')

        if (output.exists() and not output.is_symlink()
                and source.resolve() == output.resolve()):
            raise ValueError(
                f'Output resolves to the source artifact: {output}\n'
                'Refusing to overwrite the original JEPA file.')


def normalize_array(vectors):
    """Normalize an embedding matrix without changing zero rows."""
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    return vectors / np.maximum(norms, 1e-8)


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
norms = np.linalg.norm(vectors, axis=1, keepdims=True)
vectors = vectors / np.maximum(norms, 1e-8)
np.savez(bridge, track_ids=track_ids, embeddings=vectors)
"""
    subprocess.run(
        [str(source_python), '-c', code, str(source), str(bridge)],
        check=True)


def replace_npy(path, array):
    """Atomically replace a NumPy array file."""
    temp_output = path.with_name(f'.{path.name}.tmp')
    np.save(temp_output, array, allow_pickle=False)
    saved_output = temp_output
    if not saved_output.exists():
        saved_output = temp_output.with_suffix(f'{temp_output.suffix}.npy')
    os.replace(saved_output, path)


def save_array_store(track_ids, vectors, prefix):
    """Save an embedding store as separate ID and vector arrays."""
    ids_path, vectors_path = output_paths(prefix)
    replace_npy(ids_path, np.asarray(track_ids, dtype=str))
    replace_npy(vectors_path, vectors.astype(np.float32, copy=False))


def save_local_embeddings(bridge, prefix):
    """Save local embeddings with this app's NumPy."""
    with np.load(bridge, allow_pickle=False) as data:
        track_ids = data['track_ids'].astype(str)
        vectors = data['embeddings'].astype(np.float32, copy=False)
        save_array_store(track_ids, vectors, prefix)
        return track_ids


def load_pickle_store(source):
    """Load and normalize a local pickled embedding dict."""
    if not source.exists():
        return None, None
    with source.open('rb') as file:
        embeddings = pickle.load(file)
    track_ids = np.asarray(list(embeddings), dtype=str)
    vectors = np.stack([embeddings[track_id]
                        for track_id in embeddings]).astype(np.float32,
                                                            copy=False)
    vectors = normalize_array(vectors).astype(np.float32, copy=False)
    return track_ids, vectors


def ensure_replaceable(prefix, force):
    """Protect existing array outputs unless --force was passed."""
    for output in output_paths(prefix):
        if output.exists() and not output.is_symlink() and not force:
            raise FileExistsError(
                f'Output already exists and is not a symlink: {output}\n'
                'Pass --force to replace it.')


def save_pickle_store(source, prefix, force):
    """Convert a local pickled embedding dict into compact array files."""
    ensure_replaceable(prefix, force)
    track_ids, vectors = load_pickle_store(source)
    if track_ids is None:
        return None, None
    save_array_store(track_ids, vectors, prefix)
    return track_ids, vectors


def save_aligned_vectors(track_ids, vectors, target_ids, output):
    """Save vectors reordered to match target_ids."""
    index = {track_id: row for row, track_id in enumerate(track_ids)}
    aligned = vectors[[index[track_id] for track_id in target_ids]]
    replace_npy(output, aligned.astype(np.float32, copy=False))


def main():
    """Regenerate the local embeddings file."""
    args = parse_args()
    source = args.source.expanduser().resolve()
    output_prefix = args.output_prefix.expanduser()
    if not output_prefix.is_absolute():
        output_prefix = ROOT / output_prefix
    source_python = source_python_for(source, args.source_python)

    ensure_safe_paths(source, output_prefix, args.force)
    if not source_python.exists():
        raise FileNotFoundError(
            f'Source Python executable does not exist: {source_python}')

    bridge = output_prefix.with_name(f'.{output_prefix.name}.bridge.npz')
    try:
        print(f'Reading source with {source_python}')
        print(f'Source: {source}')
        print(f'Writing temporary bridge: {bridge}')
        export_bridge(source, bridge, source_python)
        print(f'Replacing local JEPA arrays: {output_prefix}_*.npy')
        jepa_ids = save_local_embeddings(bridge, output_prefix)
    finally:
        if bridge.exists():
            bridge.unlink()

    print('Replacing local tracktovec arrays')
    track_ids, track_vecs = save_pickle_store(ROOT / 'model' / 'tracktovec.p',
                                              ROOT / 'model' / 'tracktovec',
                                              args.force)
    if track_ids is not None:
        print('Replacing JEPA-aligned tracktovec vectors')
        save_aligned_vectors(track_ids, track_vecs, jepa_ids,
                             ROOT / 'model' / 'jepa_tracktovec_vectors.npy')
    print('Replacing local spotifytovec arrays')
    audio_ids, audio_vecs = save_pickle_store(ROOT / 'model' / 'spotifytovec.p',
                                              ROOT / 'model' / 'spotifytovec',
                                              args.force)
    if audio_ids is not None:
        print('Replacing JEPA-aligned spotifytovec vectors')
        save_aligned_vectors(audio_ids, audio_vecs, jepa_ids,
                             ROOT / 'model' / 'jepa_spotifytovec_vectors.npy')
    print('Done. Original source artifact was not modified.')


if __name__ == '__main__':
    main()
