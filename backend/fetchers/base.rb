class DataFetcher
  class Base
    attr_accessor :last_result, :status

    def initialize(source = nil)
      @source = source
      @status = Hash.new(0)
      @last_result = nil
    end

    def run!
      raise 'Cannot run without a source.' unless @source
      return if DataFetcher.skip_fetcher?(self.class)

      @source.each do |row|
        error = validate_row(row)
        @last_result = parse_row(row) unless error
        @status[error] += 1
      end

      puts @status.inspect if ENV['DEBUG']
    end

    def validate_row(row)
      # Subclasses should implement this
    end

    def parse_row(row)
      # Subclasses *must* implement this
      raise NotImplementedError
    end

    def get_filer(row)
      filer_id = row['filer_id'];

      if filer_id.nil?
        filer_id = 0
      elsif (/^\d*$/ =~ filer_id).nil?
        puts row.values_at('filer_namf', 'filer_naml').join(' ') + " invalid id: #{filer_id}";
        if filer_id =~ /pending/i
          filer_id = 0;
        else
          id = CommitteeMap.maximum(:committee_id);
          if id.nil?
            id = 9000000;
          end
          committee = CommitteeMap.where(filer_id: filer_id)
            .first_or_create(name: row['filer_namel'], committee_id: id + 1);
          filer_id = committee.committee_id;
          puts "filer_id is  #{filer_id}";
        end
      end

      recipient = Party::Committee.where(committee_id: 0, name: row['filer_naml']).take;
      if recipient.nil?
        recipient = if filer_id == 0    # "pending"
                      puts "Pending " + row['filer_naml'];
                      r = Party::Committee.where(name: row['filer_naml']).first
                      if r.nil?
                        Party::Committee.where(committee_id: 0, name: row['filer_naml'])
                          .first_or_create
                      else
                        puts "Found #{r.committee_id}"
                        r
                      end
                    else
                      Party::Committee.where(committee_id: filer_id)
                        .first_or_create(name: row['filer_naml'])
                    end
      elsif filer_id != 0 then
        puts "Updating  #{recipient.name} #{filer_id}";
        recipient = Party::Committee.where(committee_id: 0, name: row['filer_naml'])
          .first_or_initialize
          .tap { |p| p.update_attribute('committee_id', filer_id) };
      end
      return recipient;
    end
  end

  def self.skip_fetcher?(fetcher_class)
    return false if ENV['FETCHERS'].nil?

    unless ENV['FETCHERS'].downcase.include?(fetcher_class.name.demodulize.downcase)
      puts "Skipping fetcher: #{fetcher_class}"
      return true
    end
  end
end
