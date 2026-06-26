#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "optparse"
require "pathname"
require "set"

ALWAYS_ALLOWED_FILES = %w[
  SKILL.md
  pyproject.toml
  uv.lock
].freeze

ALWAYS_ALLOWED_DIRS = %w[
  references
  scripts
  assets
  templates
].freeze

CONDITIONAL_DIRS = %w[
  agents
  validator
  eval-viewer
].freeze

DISALLOWED_NAMES = %w[
  dev-scripts
  evals
  eval-runs
  tmp
  benchmarks
  review-output
  tests
  .venv
  .pytest_cache
  __pycache__
  justfile
  .gitignore
].freeze

DISALLOWED_PATHS = %w[
  scripts/ci
].freeze

Options = Struct.new(:replace, :dry_run, :agents_root, keyword_init: true)

def usage
  "Usage: ruby dev-scripts/promote-skill.rb <skill-name> [--replace] [--dry-run] [--agents-root PATH]"
end

def parse_options(argv)
  options = Options.new(
    replace: false,
    dry_run: false,
    agents_root: Pathname.new(".agents/skills")
  )

  parser = OptionParser.new do |opts|
    opts.banner = usage

    opts.on("--replace", "remove the existing promoted skill before copying") do
      options.replace = true
    end

    opts.on("--dry-run", "show what would be copied without changing files") do
      options.dry_run = true
    end

    opts.on("--agents-root PATH", "override promoted skills root") do |path|
      options.agents_root = Pathname.new(path)
    end
  end

  parser.parse!(argv)
  abort usage unless argv.length == 1

  [argv.first, options]
end

def repo_root
  Pathname.pwd
end

def ensure_safe_skill_name!(skill_name)
  return if skill_name.match?(/\A[a-z0-9][a-z0-9-]*\z/)

  abort "invalid skill name: #{skill_name}"
end

def skill_body(source)
  source.join("SKILL.md").read
end

def referenced?(body, name)
  body.include?("#{name}/") || body.include?("`#{name}`") || body.include?("<skill-dir>/#{name}")
end

def allowed_entries(source)
  body = skill_body(source)
  entries = []

  ALWAYS_ALLOWED_FILES.each do |file|
    entries << file if source.join(file).file?
  end

  ALWAYS_ALLOWED_DIRS.each do |dir|
    entries << dir if source.join(dir).directory?
  end

  CONDITIONAL_DIRS.each do |dir|
    next unless source.join(dir).directory?
    next unless referenced?(body, dir)

    entries << dir
  end

  entries
end

def unpromoted_entries(source, entries)
  allowed = entries.to_set
  source.children.map { |child| child.basename.to_s }.reject { |name| allowed.include?(name) }.sort
end

def copy_entry(source, destination, entry, dry_run:)
  from = source.join(entry)
  to = destination.join(entry)

  puts "copy #{from} -> #{to}"
  return if dry_run

  FileUtils.mkdir_p(to.dirname)
  from.directory? ? FileUtils.cp_r(from, to) : FileUtils.cp(from, to)
end

def disallowed_promoted_paths(destination)
  return [] unless destination.exist?

  paths = []
  destination.find do |path|
    next if path == destination

    relative = path.relative_path_from(destination).to_s
    basename = path.basename.to_s
    paths << relative if DISALLOWED_NAMES.include?(basename)
    paths << relative if DISALLOWED_PATHS.any? { |prefix| relative == prefix || relative.start_with?("#{prefix}/") }
  end
  paths.uniq.sort
end

skill_name, options = parse_options(ARGV)
ensure_safe_skill_name!(skill_name)

source = repo_root.join("skills", skill_name)
destination = repo_root.join(options.agents_root, skill_name)

abort "missing source skill: #{source}" unless source.directory?
abort "missing SKILL.md: #{source.join("SKILL.md")}" unless source.join("SKILL.md").file?

if destination.exist? && !options.replace && !options.dry_run
  abort "promoted skill already exists: #{destination} (use --replace)"
end

entries = allowed_entries(source)
abort "SKILL.md must be promoted" unless entries.include?("SKILL.md")

skipped = unpromoted_entries(source, entries)
puts "promote #{skill_name}"
puts "source: #{source}"
puts "destination: #{destination}"
puts "entries: #{entries.join(", ")}"
puts "skipped: #{skipped.join(", ")}" unless skipped.empty?

unless options.dry_run
  FileUtils.rm_rf(destination) if destination.exist? && options.replace
  FileUtils.mkdir_p(destination)
end

entries.each do |entry|
  copy_entry(source, destination, entry, dry_run: options.dry_run)
end

violations = disallowed_promoted_paths(destination)
unless violations.empty?
  abort "disallowed promoted files remain:\n#{violations.map { |path| "  - #{path}" }.join("\n")}"
end

puts options.dry_run ? "dry-run: ok" : "promote: ok"
