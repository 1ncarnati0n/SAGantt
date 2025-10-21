# Repository Guidelines

## Main language
- korean
- 주요 코드 및 정보를 영어를 사용하나, 기본적인 커뮤니케이션은 한국어로 유저와 소통.

## Project Structure & Module Organization
- Root contains documentation and project metadata. Primary artifact: `Guide.md`.
- Source code modules live under future `src/` (create as needed).
- Tests should reside in `tests/` mirroring `src/` structure (e.g., `src/module/foo.py` → `tests/module/test_foo.py`).
- Assets (figures/data) go in `assets/` with subfolders by type (e.g., `assets/img/`).

## Build, Test, and Development Commands
- Python env (recommended): `python -m venv .venv && source .venv/bin/activate`
- Install deps: `pip install -r requirements.txt` (add file if/when dependencies exist).
- Run tests: `pytest -q` (from repo root).
- Lint/format: `ruff check .` and `ruff format .` (or `black .` if preferred).
- Local run (example): `python -m src.main` for CLI/entry modules.

## Coding Style & Naming Conventions
- Python: 4-space indentation, no tabs. Target Python 3.10+.
- Naming: modules `snake_case.py`, classes `PascalCase`, functions/vars `snake_case`, constants `UPPER_SNAKE`.
- Keep functions ≤ 50 lines when reasonable; prefer small, cohesive modules.
- Type hints required for public functions. Enable `from __future__ import annotations` if helpful.
- Formatting: `ruff format` (or `black`) with 88 char line length. Keep imports sorted (`ruff --select I`).

## Testing Guidelines
- Framework: `pytest` with `pytest-cov` optional. Aim for ≥ 80% coverage on core modules.
- Test names: file `test_*.py`; functions `test_<behavior>()` with clear Arrange/Act/Assert.
- Use fixtures for shared setup in `tests/conftest.py`. Avoid network/filesystem side effects unless mocked.

## Commit & Pull Request Guidelines
- Commits: imperative mood, concise scope prefix if useful (e.g., `feat: add gantt renderer`, `fix: guard empty tasks`).
- Include rationale in body when behavior changes or adds complexity.
- PRs: clear description, linked issues, reproduction steps, and before/after notes or screenshots when UI is affected.
- CI criteria: tests pass, linters clean, no unrelated diffs.

## Security & Configuration Tips
- Do not commit secrets. Use `.env` (ignored) and document required vars in `.env.example`.
- Pin dependencies where feasible. Run `pip-audit` or `uv pip audit` periodically.
- Prefer deterministic builds (lock file) once tooling is added.

## Agent-Specific Instructions
- Respect this AGENTS.md scope (repo root). Keep changes minimal and targeted.
- When adding files, follow the structure above and mirror tests. Update this doc if conventions evolve.

## Dependencies
- Management: Use `requirements.txt` for runtime and `requirements-dev.txt` for dev/test tools. Consider `pip-tools` or `uv` for lock files.
- Installation: `pip install -r requirements.txt` and for dev `pip install -r requirements-dev.txt` (after activating a venv).
- Tooling: lint/format via `ruff`/`black`; tests via `pytest` (+ `pytest-cov` optional); security audit via `pip-audit` or `uv pip audit`.
- Versions: Target Python 3.10+. Constrain critical libs (e.g., `pkg>=1.2,<2.0`) and review changelogs before bumps.
- Process: After updates, run `pytest -q` and `ruff check .`; document notable changes in PRs.
