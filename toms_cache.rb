# Cache the Socrata data in memory; serve it gzipped to improve performance (36
# KB vs 263 KB)
class TomsCache
  @@data = nil
  @@expires = nil

  def fetch
    if !@@data || @@expires < Time.now
      @@data = yield
      @@expires = Time.now + 24 * 60 * 60
    end

    @@data
  end
end
