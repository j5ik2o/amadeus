#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "open3"
require "pathname"
require "tmpdir"

ROOT = Pathname.new(__dir__).join("../../..").expand_path

def fail_with(message)
  warn message
  exit 1
end

def run!(*command)
  stdout, stderr, status = Open3.capture3(*command, chdir: ROOT.to_s)
  return stdout if status.success?

  fail_with(<<~MSG)
    command failed: #{command.join(" ")}
    stdout:
    #{stdout}
    stderr:
    #{stderr}
  MSG
end

def run_expect_failure!(*command)
  stdout, stderr, status = Open3.capture3(*command, chdir: ROOT.to_s)
  return [stdout, stderr] unless status.success?

  fail_with(<<~MSG)
    command unexpectedly succeeded: #{command.join(" ")}
    stdout:
    #{stdout}
    stderr:
    #{stderr}
  MSG
end

def amadeus_skills
  Dir.glob(ROOT.join("skills/amadeus-*")).map { |path| File.basename(path) }.sort
end

def required_internal_skills
  %w[
    amadeus-inception-requirements-definition
    amadeus-inception-interaction-modeling
    amadeus-inception-execution-design
    amadeus-inception-traceability-finalization
  ]
end

run!("ruby", "-c", "dev-scripts/promote-skill.rb")
run!("ruby", "dev-scripts/promote-skill.rb", "amadeus-grilling", "--dry-run")
run!("ruby", "dev-scripts/promote-skill.rb", "amadeus-steering", "--dry-run")
run!("ruby", "dev-scripts/promote-skill.rb", "amadeus-intent-validator", "--dry-run")
run_expect_failure!("ruby", "dev-scripts/promote-skill.rb", "amadeus-grilling")

missing_internal_skills = required_internal_skills.reject do |skill|
  ROOT.join("skills", skill, "SKILL.md").file? && ROOT.join(".agents/skills", skill, "SKILL.md").file?
end
fail_with("missing internal skills: #{missing_internal_skills.join(", ")}") unless missing_internal_skills.empty?

Dir.mktmpdir("amadeus-promote-all") do |tmp|
  agents_root = Pathname.new(tmp).join(".agents/skills")

  amadeus_skills.each do |skill|
    run!("ruby", "dev-scripts/promote-skill.rb", skill, "--agents-root", agents_root.to_s)
  end

  disallowed = Dir.glob(
    agents_root.join("**/{dev-scripts,evals,eval-runs,tmp,benchmarks,review-output,tests,.venv,.pytest_cache,__pycache__,justfile}")
  )
  disallowed += Dir.glob(agents_root.join("**/scripts/ci"))
  fail_with("disallowed promoted files remain:\n#{disallowed.sort.join("\n")}") unless disallowed.empty?

  amadeus_skills.each do |skill|
    run!("diff", "-qr", agents_root.join(skill).to_s, ".agents/skills/#{skill}")
  end
end

Dir.mktmpdir("amadeus-promote-violation") do |tmp|
  agents_root = Pathname.new(tmp).join(".agents/skills")
  FileUtils.mkdir_p(agents_root.join("amadeus-grilling/evals"))
  run_expect_failure!("ruby", "dev-scripts/promote-skill.rb", "amadeus-grilling", "--dry-run", "--agents-root", agents_root.to_s)
end

run!("git", "diff", "--check")

puts "promote skill eval: ok"
