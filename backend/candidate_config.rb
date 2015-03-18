# TODO: Load config from the database instead of from a yaml file
require 'yaml'

class CandidateConfig
  DATA = YAML.load_file('candidates.yml')

  # @return Array<Party>
  def self.mayoral_candidates(subdomain, include_candidates_without_data: false)
    DATA.fetch(subdomain, {}).fetch("candidates", []).map do |candidate_data|
      if candidate_data['id']
        Party.find_by(committee_id: candidate_data['id'])
      elsif include_candidates_without_data
        Party.new(candidate_data)
      end
    end.compact
  end

  def self.get_candidate(id)
    CANDIDATE_MAP.fetch(id)
  end
end
