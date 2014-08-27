class Party < ActiveRecord::Base
  has_many :received_contributions,
    foreign_key: :recipient_id,
    class_name: 'Contribution'
  has_many :contributions,
    foreign_key: :contributor_id,
    class_name: 'Contribution'
  has_one :summary, primary_key: :committee_id
  has_many :whales,
    foreign_key: :contributor_id,
    class_name: 'Whale'
  has_many :multiples,
    foreign_key: :contributor_id,
    class_name: 'Multiple'

  # These are the Filer_IDs of the candidates
  MAYORAL_CANDIDATE_IDS = [
    PARKER = 1357609,
    QUAN = 1354678,
    SCHAAF = 1362261,
    TUMAN = 1359017,
    RUBY = 1364278,
    KAPLAN = 1367270,
    SIEGEL = 1362877,
  ]

  # Filer_IDs of other races this cycle
  CANDIDATE_IDS = [
    # Auditor
    ROBERTS = 0,
    RAPHAEL = 0,
    # Council 2
    BLACKBURN = 1366244,
    COLBRUNO = 0,
    GUILLEN = 1365384,
    KING = 1364029,
    MAO = 0,
    PARK = 0,
    # Council 4
    BROADHURST = 1362843,
    WASHINGTON = 1365610,
    HEIDORN = 1363584,
    LIM = 0,
    SINCLAIR = 0,
    # Council 6
    BROOKS = 1236617,
    JOHNSON = 1360826,
    MOORE = 0,
    NOSAKHARE = 1365766,
  ]

  CANDIDATE_INFO = {
    PARKER => {
      name: 'Bryan Parker',
      declared: '2013-05-06',
      profession: 'Health Care and Technology Professional',
      party: 'Democrat',
      twitter:'@bryanparker2014',
      bio: "Bryan Parker is a Senior Vice President at HealthDev, a division of Physicians' Capital Investments, and a Texas-based medical real-estate and financial company. Additionally, he also holds the role of Vice President, General Manager of Real Estate & Internal Growth DaVita, the dialysis division of DaVita HealthCare Partners Inc. He also is a current Port of Oakland Commissioner. He studied Political Economy at UC Berkeley and graduated from law school at NYU in 1995. Bryan is engaged to Kamela Peart, a local Artist and Mental Health Care Professional.",
      sources: [
        {
          name: 'Official campaign website',
          uri: 'http://bryanparker.org/who-is-bryan/'
        },
        {
          name: 'LinkedIn profile',
          uri: 'http://www.linkedin.com/pub/bryan-r-parker/4/491/bba'
        },
        {
          name: 'Press Release: Bryan Parker Joins PCI (July 8, 2013)',
          uri: 'http://www.healthdev.com/Upload/WebUploadedFiles/Bryan%20Parker%20Joins%20PCI%20Press%20Release-v07-08-13.pdf'
        },
        {
          name: 'Kamela Peart Art',
          uri: 'http://www.kamelapeartart.com'
        },
        {
          name: 'OaklandWiki article on Bryan Parker',
          uri: 'http://oaklandwiki.org/Bryan_Parker'
        },
      ]
    },

    QUAN => {
      name: 'Jean Quan',
      declared: '2013-02-04',
      profession: 'Incumbent Oakland Mayor',
      party: 'Democrat',
      twitter:'@jeanquan',
      bio: "Jean is the incumbent in the 2014 Oakland Mayoral election. She previously served as City Council member for District 4 from 2002 to 2010. Prior to her time in office, Jean was on the Oakland School Board for 12 years and acted as President from 1996 to 2002. Jean's husband, Dr. Floyd Huen, is a doctor of internal medicine for Alameda County.",
      sources: [
        {
          name: 'Official campaign website',
          uri: 'http://www.jeanquanforoakland.org/'
        },
        {
          name: '"Becoming mayor after years of fighting authority" (01/02/2011)',
          uri: 'http://www.sfgate.com/politics/article/Becoming-mayor-after-years-of-fighting-authority-2479776.php'
        },
        {
          name: 'OaklandWiki article on Jean Quan',
          uri: 'http://oaklandwiki.org/Jean_Quan'
        },
        {
          name: 'Wikipedia article on Jean Quan',
          uri: 'http://en.wikipedia.org/wiki/Jean_Quan'
        },
      ]
    },
    SCHAAF => {
      name: 'Libby Schaaf',
      declared: '2013-12-02',
      profession: 'Councilmember for District 4',
      party: 'Democrat',
      twitter: '@libbyformayor',
      bio:"Libby was elected as Oakland City Councilmember for District 4 in 2010. Prior to that, she was a Senior Policy Advisor for Community & Economic Development to the Oakland City Council and the Director of Public Affairs for the Port of Oakland. Libby graduated from Loyola Law School, Loyola Marymount University in 1993. Libby is married to Salvatore Fahey, a Director of Software Operations at Gatan, Inc., a developer and manufacturer of electron microscopes. They are raising their two young children in Oakland's Dimond/Oakmore neighborhood.",
      sources: [
        {
          name: 'Official campaign website',
          uri: 'http://libbyformayor.com/'
        },
        {
          name: 'LinkedIn profile',
          uri: 'http://www.linkedin.com/in/libbyschaaf'
        },
        {
          name: 'Facebook campaign page',
          uri: 'https://www.facebook.com/pages/Libby-Schaaf-for-Mayor-of-Oakland/297953162283'
        },
        {
          name: '“Newhouse: Schaaf clamps down on council job” (05/08/2011)',
          uri: 'http://www.mercurynews.com/columns/ci_18004288'
        },
        {
          name: 'Salvatore Fahey’s LinkedIn profile',
          uri: 'http://www.linkedin.com/pub/sal-fahey/3/1a9/b79'
        },
        {
          name: 'OaklandWiki article on Libby Schaaf',
          uri: 'http://oaklandwiki.org/Libby_Schaaf'
        },
      ]
    },

    TUMAN => {
      name: 'Joe Tuman',
      declared: '2013-07-24',
      profession: 'University Professor',
      party: 'Independent',
      twitter:'@joe4mayor',
      bio: 'Joe Tuman has been a political analyst and commentator on government and politics for CBS for 12 years as well as a Department Chair and Professor at San Francisco State University for over 25 years. Joe graduated from UC Berkeley with a B.A. in Political Science and a Juris Doctorate from Boalt Hall School of Law. Joe has been married for 30 years to Kirsten Weisser, an Executive Vice President of Wealth Management at Mechanics Bank, a local financial institution. They have raised two children in Oakland.',
      sources: [
        {
          name: 'Official campaign website',
          uri: 'http://www.joetuman.com/about'
        },
        {
          name: 'LinkedIn profile',
          uri: 'http://www.linkedin.com/pub/joe-tuman/7/b24/bb7'
        },
        {
          name: 'Facebook campaign page',
          uri: 'https://www.facebook.com/joe4mayor/info'
        },
        {
          name: 'OaklandWiki article on Joe Tuman',
          uri: 'http://oaklandwiki.org/Joe_Tuman'
        },
      ]
    },

    RUBY => {
      name: 'Courtney Ruby',
      declared: '2014-02-26',
      profession: 'City Auditor',
      party: 'Unknown',
      twitter:'@Ruby4Oakland',
      bio:"Courtney is Oakland’s City Auditor, since 2007. She is a Certified Public Accountant and Certified Fraud Examiner. Previously, she served as vice-chair of the Budget Advisory Committee for the City of Oakland and Board Finance Chair for a local nonprofit dedicated to ending the cycle of homelessness. In 2005, she became the Chief Financial Officer and Director of Administration of the East Bay Conservation Corps, a nonprofit organization dedicated to promoting youth development through environmental stewardship and community service. She graduated from the Kogod School of Business at American University in 1989. She lives in East Oakland with her two young sons.",
      sources: [
        {
          name: 'Official campaign website',
          uri: 'http://www.courtneyruby.com/meet-courtney/'
        },
        {
          name: 'Facebook campaign page',
          uri: 'https://www.facebook.com/pages/Courtney-Ruby/149813765029765'
        },
        {
          name: 'Oakland City Auditor website bio on Courtney Ruby',
          uri: 'http://www.oaklandauditor.com/ruby/bio'
        },
        {
          name: 'OaklandWiki article on Courtney Ruby',
          uri: 'http://oaklandwiki.org/Courtney_Ruby'
        },
      ]
    },

    KAPLAN => {
      name: 'Rebecca Kaplan',
      declared: '2014-06-04',
      profession: 'Oakland City Council President Pro Tem',
      party: 'Democrat',
      twitter: '@kaplan4oakland',
      bio: "She is the Council President Pro Tem and has been a City Councilmember At-Large since 2008. She was elected unopposed in 2002 and then re-elected in 2006 as a Member At-Large on the Alameda - Contra Costa Transit Board of Directors. She studied at MIT and has a masters from Tufts in Urban & Environmental policy and a Juris Doctorate from Stanford Law School. Rebecca got engaged to her partner, Pamela Rosin, who is a Somatic Counselor and Restorative Yoga Teacher, in May 2014.",
      sources: [
        {
          name: 'Official campaign website',
          uri: 'http://kaplanforoakland.org/'
        },
        {
          name: 'Wikipedia article on Rebecca Kaplan',
          uri: 'https://en.wikipedia.org/wiki/Rebecca_Kaplan'
        },
        {
          name: 'OaklandWiki article on Rebecca Kaplan',
          uri: 'http://oaklandwiki.org/Rebecca_Kaplan'
        },
      ]
    },
    SIEGEL => {
      name: 'Dan Siegel',
      declared: '2014-01-09',
      profession: 'Civil-Rights Attorney',
      party: 'Unknown',
      twitter:'@DanMSiegel',
      bio:"Dan Siegel is a partner and civil-rights attorney at the law firm, Siegel & Yee. He was a former legal adviser to Mayor Jean Quan until November 14, 2011. He was an Oakland Unified School District Board member from 1998 to 2006 and former president of both the Oakland School Board and the Oakland Housing Authority Commission. Dan graduated from Boalt Hall School of Law at UC Berkeley in 1970. Siegel and his wife, Anne Butterfield Weills, have been Oakland residents since 1977. They have two sons and a grandson. Anne is an attorney and her and Dan’s younger son, Michael Siegel, is an associate attorney with Siegel & Yee. Their older son, Christopher, teaches at Skyline High School.",
      sources: [
        {
          name: 'Official campaign website',
          uri: 'http://siegelforoakland.org/'
        },
        {
          name: 'Dan Siegel bio on Siegel & Yee website',
          uri: 'http://www.siegelyee.com/dansiegel.html”'
        },
        {
          name: 'Facebook campaign page',
          uri: 'https://www.facebook.com/pages/Dan-Siegel-for-Oakland/250855065091322”'
        },
        {
          name: 'OaklandWiki article on Dan Siegel',
          uri: 'http://oaklandwiki.org/Dan_Siegel'
        },
      ]
    },

    # Candidates without data are below. Since they're not in the database,
    # these should have the same schema as the party table (see
    # backend/schema.rb) -- city, state, zip, employer, occupation
    'WASHINGTON' => {
      name: 'Sammuel Washington',
      bio: "test test test",
    },
  }

  def self.mayoral_candidates
    where(committee_id: MAYORAL_CANDIDATE_IDS)
  end

  def short_name
    CANDIDATE_INFO.fetch(committee_id, {})[:name] || name
  end

  # These fields aren't persisted in the database, but instead loaded from the
  # at the top of this file

  attr_accessor :declared, :profession, :party, :twitter, :bio, :sources

  def declared
    CANDIDATE_INFO.fetch(committee_id, {})[:declared] || @declared
  end

  def profession
    CANDIDATE_INFO.fetch(committee_id, {})[:profession] || @profession
  end

  def party_affiliation
    CANDIDATE_INFO.fetch(committee_id, {})[:party] || @party
  end

  def twitter
    CANDIDATE_INFO.fetch(committee_id, {})[:twitter] || @twitter
  end

  def bio
    CANDIDATE_INFO.fetch(committee_id, {})[:bio] || @bio
  end

  def sources
    CANDIDATE_INFO.fetch(committee_id, {})[:sources] || @sources
  end

  def image
    # Depends on Sinatra being initialized, so this cannot be called from
    # backend/load_data.rb script. But why would you want to?
    return nil unless defined?(OpenDisclosureApp)

    last_name = short_name.split.last
    OpenDisclosureApp.image_path(last_name + '.png')
  end

  def link_path
    '/candidate/' + short_name.downcase.gsub(/[^a-z]/, '-')
  end

  def from_oakland?
    city =~ /Oakland/i
  end
end

class Party::Individual < Party
end

class Party::Other < Party
end

class Party::Committee < Party
end
