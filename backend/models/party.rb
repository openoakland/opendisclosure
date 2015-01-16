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
    WILLIAMS = 1367207,
    KARAMOOZ = 1369536
    #################
    # No filer ID
    # ANDERSON =
    # HOUSTON =
    # LIU =
    # MCCULLOUGH =
    # SIDEBOTHAM =
    # WILSON =
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
    # OUSD
    DERBO = 1366842,
    SEEN = 1368416,
    SHAKIR = 1365733,
    SPRINGER = 1367083,
    ALMONZOR = 1365454,
    DOBBINS = 1277578,
    GONZALES = 1364457,
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
      party: 'Nonpartisan',
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

    WILLIAMS => {
      name: 'Charles Williams',
      declared: '2014-08-09',
      profession: 'Engineering Manager Administrator',
      party: 'Democrat',
      twitter:'@CharlesMmcrw40',
      bio: "Starting in 1961, Charles R. Williams had an extensive career with the U.S. Navy in a variety of assignments ranging from ship maintenance to recruiting and the military police.  After retiring, he entered private consulting with a focus on small businesses and local government.  Most recently, he served as a consultant to the city and and county of San Francisco.",
      sources: [
        {
          name: 'Charles Ray Williams',
          uri: 'http://oaklandwiki.org/charles_ray_williams'
        },
        {
          name: 'Charles Ray Williams Fundly',
          uri: 'https://fundly.com/charles-r-williams-for-mayor-of-oakland'
        },
        {
          name: 'Google +',
          uri: 'https://plus.google.com/101642577580197907873/posts'
        },
        {
          name: 'Facebook',
          uri: 'https://www.facebook.com/people/Charles-Williams/100006463488973?fref=nf'
        },
        {
          name: 'Twitter',
          uri: 'https://twitter.com/CharlesMmcrw40'
        }
      ]
    },

    KARAMOOZ => {
      name: 'Saied Karamooz',
      declared: '2014-06-06',
      profession: 'Private Sector Executive',
      party: 'Nonpartisan',
      twitter:'@SaiedKaramooz',
      bio: "Saied Karamooz holds B.S. in Computer Science, M.B.A., and M.S. in Information Sciences from Pennsylvania State University.  Starting his career as an intern with IBM, he has served in senior and executive roles in both the software and consulting industries. Helping to find technological solutions to large-scale problems is a recurring theme in this Oakland resident’s résumé.",
      sources: [
        {
          name: 'Official Campaign site',
          uri: 'http://www.oaklandmayormovement.org/'
        },
        {
          name: 'Oakland Wiki article on Saied Karamooz',
          uri: 'http://oaklandwiki.org/Saied_Karamooz'
        }
      ]
    },

    # Candidates without data are below. Since they're not in the database,
    # these should have the same schema as the party table (see
    # backend/schema.rb) -- city, state, zip, employer, occupation


    'ANDERSON' => {
      name: 'Jason "Shake" Anderson',
      declared: '2014-02-18',
      profession: 'Communications Director',
      party: 'Green Party',
      twitter:'@Shake9169',
      bio: "Jason Anderson is a former Occupy Oakland spokesperson and honorably discharged veteran of the U.S. Navy. He is an Oakland native, artist, community organizer. As the Green Party endorsed Oakland mayoral candidate, he has committed to accept no corporate money.",
      sources: [
        {
          name: 'Official campaign website',
          uri: 'http://townmayor.nationbuilder.com/'
        },
        {
          name: 'Jason "Shake" Anderson is Oakland\'s "Candidate X" (03/04/14)',
          uri: 'http://www.sfbg.com/politics/2014/03/04/jason-shake-anderson-oaklands-candidate-x'
        },
        {
          name: 'GoFundMe donation campaign',
          uri: 'http://www.gofundme.com/townmayor'
        },
        {
          name: 'Ending musical chair politics in Oakland: an interview with Oakland mayoral candidate Jason ‘Shake’ Anderson” (03/15/2014)',
          uri: 'http://sfbayview.com/2014/ending-musical-chair-politics-in-oakland-an-interview-with-oakland-mayoral-candidate-jason-shake-anderson/'
        },
        {
          name: 'LinkedIn profile',
          uri: 'http://www.linkedin.com/in/shake9169'
        },
        {
          name: 'Facebook page',
          uri: 'https://www.facebook.com/shake.anderson.3'
        }
      ]
    },

    'HOUSTON' => {
      name: 'Ken Houston',
      declared: '2014-06-18',
      profession: 'Contractor',
      party: 'Not reported',
      twitter:'@KHouston4Mayor',
      bio: "Ken Houston attended public schools in Oakland, went to Laney College and trade school, and then joined Plumber’s Union. Houston remodeled blighted homes in Oakland, then moved to commercial jobs and public works projects. Houston volunteered on the task force to reform the practices of Oakland’s Building Services Department. He chairs the East Oakland Beautification Council.
",
      sources: [
        {
          name: 'Ken Houston on Oakland Elects website',
          uri: 'http://www.oaklandelects.com/kenhouston.html'
        },
        {
          name: 'Oakland Wiki article on Ken Houston',
          uri: 'http://oaklandwiki.org/Ken_Houston'
        }
      ]
    },

    'MCCULLOUGH' => {
      name: 'Patrick McCullough',
      declared: '2013-07-24',
      profession: 'Technician/Lawyer/Entrepreneur',
      party: 'Nonpartisan',
      twitter:'@pat4oakland',
      bio: "According to his campaign website, Patrick McCullough currently works as a technician and self-employed attorney. When he was 18, McCullough enlisted in the U.S. Navy and was honorably discharged in 1980. McCullough graduated with a J.D. from San Francisco Law School and earned a B.A. from Golden Gate University. In 2005, during a confrontation with a group of youths outside his home, Patrick shot his 15-year-old neighbor. The Alameda County district attorney found that he had acted in self-defense, and no charges were brought against anyone involved in the incident. In 2008, McCullough ran for Oakland City Council, District 1. He and his wife, Daphne, have been residents of the Bushrod neighborhood for over 30 years.",
      sources: [
        {
          name: 'Patrick McCullough’s Campaign Website',
          uri: 'http://www.pat4oakland.com/home.'
        },
        {
          name: '\”A Neighborhood Reborn: A year after Patrick McCullough shot teen, Oakland\'s 59th Street has safer rec center, reduced loitering and fewer drug deals\” (02/18/2006)',
          uri: 'http://www.sfgate.com/bayarea/article/A-NEIGHBORHOOD-REBORN-A-year-after-Patrick-2504002.php'
        },
        {
          name: '”Public Comment: Oakland City Council District 1 Candidate Statement by Patrick McCullough” (05/22/2008)',
          uri: 'http://www.berkeleydailyplanet.com/issue/2008-05-22/article/30089?headline=Oakland-City-Council-District-1-Candidate-Statement-Patrick-McCullough%E2%80%94'
        },
        {
          name: 'Patrick McCullough Runs For Mayor Of Oakland: Vigilante Candidate” video for Zennie62 Blog (01/17/2014)',
          uri: 'http://youtu.be/CNS4VpA3fLE'
        }
      ]
    },

    'SIDEBOTHAM' => {
      name: 'Nancy Sidebotham',
      declared: '2014-01-02',
      profession: 'Tax Preparer',
      party: 'Democrat',
      twitter:'@nancy6368',
      bio: "Nancy Sidebotham is a supervised registered tax preparer and neighborhood activist. She has previously run for the Oakland City Council, District 6 council seat. Sidebotham is a former Community Policing Advisory Board (CPAB) member. She currently lives in Oakland.",
      sources: [
        {
          name: 'Candidate Biography from League of Women Voters',
          uri: '”http://www.smartvoter.org/2001/04/17/ca/alm/vote/sidebotham_n/bio.html'
        },
        {
          name: 'Oakland Wiki',
          uri: 'http://oaklandwiki.org/2014_mayoral_election'
        },
        {
          name: 'Nancy Sidebotham / Linkedin',
          uri: 'https://www.linkedin.com/pub/nancy-s-sidebotham/9/72/532'
        },
      ]
    },


    'LIU' => {
      name: 'Peter Liu',
      declared: '2014-01-29',
      profession: 'Father, Businessman, Executive',
      party: 'Nonpartisan',
      twitter:'',
      bio: "Peter Liu has worked as an entrepreneur and real estate agent. He reports eight years of experience in the insurance industry. His campaign statement indicates that he graduated from Oakland High in 1998 and received a B.A. in History from the University of California, Santa Cruz. Liu also states that he earned a journalism degree from the United States Defense Information School at Fort Meade, Maryland. He reports serving in the United States Army for two years in Kuwait and Iraq. Peter Liu lives with his wife and two-year-old son in Oakland.",
      sources: [
        {
          name: 'Mayoral Candidate Peter Liu / Oakland North',
          uri: 'http://oaknorth.wpengine.com/2014/05/21/mayoral-candidate-peter-liu/'
        },
        {
          name: 'Ballotpedia Peter Liu',
          uri: 'http://ballotpedia.org/Peter_Yuan_Liu'
        },
        {
          name: 'Peter Liu / Linkedin',
          uri: 'https://www.linkedin.com/pub/peter-liu/22/80/10b'
        },
        {
          name: 'Oakland Wiki / Official Campaign Statement PDF',
          uri: 'http://oaklandwiki.org/Peter_Y._Liu/#camstat'
        },
      ]
    },

    'WILSON' => {
      name: 'Eric Wilson',
      declared: '2014-05-30',
      profession: 'Non-profit Employee',
      party: 'Democrat',
      twitter:'no known handle',
      bio: "[PLEASE NOTE: OpenOakland requested biographical information from this candidate on August 24, 2014, but has yet to receive any.]",
      sources: [
        {
          name: 'Official campaign site',
          uri: 'http://www.wilson4oakland.com/'
        }
      ]
    }
    # ,

    # NOT ON CLERKS LIST OF ANNOUNCED CANDIDATES

    # 'WASHINGTON' => {
    #   name: 'Sammuel Washington',
    #   bio: "test test test",
    # },
  }

  def self.all_mayoral_candidates
    candidates_with_data = Party.mayoral_candidates
                                .includes(:summary)
                                .joins(:summary)
                                .order('summaries.total_contributions_received DESC')

    candidates_without_data = Party::CANDIDATE_INFO
                                .dup
                                .keep_if { |k, _v| Party::MAYORAL_CANDIDATE_IDS.exclude?(k) }
                                .values
                                .map { |p| Party.new(p) }

    [candidates_with_data + candidates_without_data].flatten
  end

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
    OpenDisclosureApp.image_path(last_name + '.jpg')
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

class CommitteeMap < ActiveRecord::Base
end
