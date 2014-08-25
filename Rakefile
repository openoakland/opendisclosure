require 'sinatra/asset_pipeline/task'
require './app'

namespace :sitemap do
  task :generate do
    require 'sitemap_generator'
    puts 'Be sure you have the latest data and have the latest copy of the code!'

    SitemapGenerator::Sitemap.default_host = 'http://www.opendisclosure.io'
    SitemapGenerator::Sitemap.create do
      add '/', changefreq: 'daily', priority: 1
      add '/rules', changefreq: 'monthly'

      Party::CANDIDATE_INFO.each do |_id, c|
        add Party.new(c).link_path, priority: 0.8
      end
    end
  end
end

Sinatra::AssetPipeline::Task.define! OpenDisclosureApp
