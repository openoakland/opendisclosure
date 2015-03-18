# TODO: Load config from the database instead of from a yaml file
require 'yaml'

class CandidateConfig
  DATA = YAML.load_file('candidates.yml')

  def self.mayoral_candidates(subdomain)
    DATA.fetch(subdomain, {}).fetch("candidates", [])
  end

  def self.mayoral_committee_ids(subdomain)
    mayoral_candidates(subdomain).map do |candidate|
      candidate['committee_id']
    end.compact
  end

  def self.get_config(subdomain, committee_id)
    mayoral_candidates(subdomain).detect do |candidate|
      candidate['committee_id'] == committee_id
    end
  end
end
