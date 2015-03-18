# TODO: Load config from the database instead of from a yaml file
require 'yaml'

# All candidate configuration should be managed through the interface provided
# by this class. Ideally, later, we should be able to swap out the
# implementation of this class to load the configuration from the database on a
# per-subdomin basis.
#
# Note, this means that although it is technically possible, it should be
# considered prohibited to access CandidateConfig::DATA from outside this class.
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
