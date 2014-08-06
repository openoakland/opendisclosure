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
    # Council 2
    BLACKBURN = 0,
    COLBRUNO = 0,
    GUILLEN = 0,
    KING = 0,
    MAO = 0,
    PARK = 0,
    # Council 4
    BROADHURST = 0,
    WASHINGTON = 0,
    HEIDORN = 0,
    LIM = 0,
    SINCLAIR = 0,
    # Council 6
    JOHNSON = 0,
    MOORE = 0,
    NOSAKHARE = 0,
  ]

  CANDIDATE_INFO = {
    PARKER => {
      name: 'Bryan Parker',
      profession: 'Health Care and Technology Professional',
      party: 'Democrat',
      twitter:'@bryanparker2014',
      bio: "Bryan Parker is a Senior Vice President at HealthDev, a division of Physicians' Capital Investments, and a Texas-based medical real-estate and financial company. Additionally, he also holds the role of Vice President, General Manager of Real Estate & Internal Growth DaVita, the dialysis division of DaVita HealthCare Partners Inc. He also is a current Port of Oakland Commissioner. He studied Political Economy at UC Berkeley and graduated from law school at NYU in 1995. Bryan is engaged to Kamela Peart, a local Artist and Mental Health Care Professional."
    },
    QUAN => {
      name: 'Jean Quan',
      profession: 'Incumbant Oakland Mayor',
      party: 'Democrat',
      twitter:'@jeanquan',
      bio: "Jean is the incumbent in the 2014 Oakland Mayoral election. She previously served as City Council member for District 4 from 2002 to 2010. Prior to her time in office, Jean was on the Oakland School Board for 12 years and acted as President from 1996 to 2002. Jean's husband, Dr. Floyd Huen, is a doctor of internal medicine for Alameda County."
    },
    SCHAAF => {
      name: 'Libby Schaaf',
      profession: 'Councilmember for District 4',
      party: 'Democrat',
      twitter: '@libbyformayor',
      bio:"Libby was elected as Oakland City Councilmember for District 4 in 2010. Prior to that, she was a Senior Policy Advisor for Community & Economic Development to the Oakland City Council and the Director of Public Affairs for the Port of Oakland. Libby graduated from Loyola Law School, Loyola Marymount University in 1993. Libby is married to Salvatore Fahey, a Director of Software Operations at Gatan, Inc., a developer and manufacturer of electron microscopes. They are raising their two young children in Oakland's Dimond/Oakmore neighborhood."
    },
    TUMAN => {
      name: 'Joe Tuman',
      profession: 'University Professor',
      party: 'Independent',
      twitter:'@joe4mayor',
      bio: 'Joe Tuman has been a political analyst and commentator on government and politics for CBS for 12 years as well as a Department Chair and Professor at San Francisco State University for over 25 years. Joe graduated from UC Berkeley with a B.A. in Political Science and a Juris Doctorate from Boalt Hall School of Law. Joe has been married for 30 years to Kirsten Weisser, an Executive Vice President of Wealth Management at Mechanics Bank, a local financial institution. They have raised two children in Oakland.'
    },
    RUBY => {
      name: 'Courtney Ruby',
      profession: 'City Auditor',
      party: 'Unknown',
      twitter:'@Ruby4Oakland',
      bio:"Courtney is Oakland’s City Auditor, since 2007. She is a Certified Public Accountant and Certified Fraud Examiner. Previously, she served as vice-chair of the Budget Advisory Committee for the City of Oakland and Board Finance Chair for a local nonprofit dedicated to ending the cycle of homelessness. In 2005, she became the Chief Financial Officer and Director of Administration of the East Bay Conservation Corps, a nonprofit organization dedicated to promoting youth development through environmental stewardship and community service. She graduated from the Kogod School of Business at American University in 1989. She lives in East Oakland with her two young sons."
    },
    KAPLAN => {
      name: 'Rebecca Kaplan',
      profession: 'Oakland City Council President Pro Tem',
      party: 'Democrat',
      twitter: '@kaplan4oakland',
      bio: "She is the Council President Pro Tem and has been a City Councilmember At-Large since 2008. She was elected unopposed in 2002 and then re-elected in 2006 as a Member At-Large on the Alameda - Contra Costa Transit Board of Directors. She studied at MIT and has a masters from Tufts in Urban & Environmental policy and a Juris Doctorate from Stanford Law School. Rebecca got engaged to her partner, Pamela Rosin, who is a Somatic Counselor and Restorative Yoga Teacher, in May 2014."
    },
    WASHINGTON => {
      name: 'Sammuel Washington',
    },
    SIEGEL => {
      name: 'Dan Siegel',
      profession: 'Civil-Rights Attorney',
      party: 'Unknown',
      twitter:'@DanMSiegel',
      bio:"Dan Siegel is a partner and civil-rights attorney at the law firm, Siegel & Yee. He was a former legal adviser to Mayor Jean Quan until November 14, 2011. He was an Oakland Unified School District Board member from 1998 to 2006 and former president of both the Oakland School Board and the Oakland Housing Authority Commission. Dan graduated from Boalt Hall School of Law at UC Berkeley in 1970. Siegel and his wife, Anne Butterfield Weills, have been Oakland residents since 1977. They have two sons and a grandson. Anne is an attorney and her and Dan’s younger son, Michael Siegel, is an associate attorney with Siegel & Yee. Their older son, Christopher, teaches at Skyline High School."

    }
  }

  def self.mayoral_candidates
    where(committee_id: MAYORAL_CANDIDATE_IDS)
  end

  def short_name
    CANDIDATE_INFO.fetch(committee_id, {})[:name] || name
  end

  def profession
    CANDIDATE_INFO.fetch(committee_id, {})[:profession]
  end

  def party_affiliation
    CANDIDATE_INFO.fetch(committee_id, {})[:party]
  end

  def twitter
    CANDIDATE_INFO.fetch(committee_id, {})[:twitter]
  end

  def bio
    CANDIDATE_INFO.fetch(committee_id, {})[:bio]
  end

  def image
    # Depends on Sinatra being initialized, so this cannot be called from
    # backend/load_data.rb script. But why would you want to?
    return nil unless defined?(OpenDisclosureApp)

    last_name = short_name.split.last
    OpenDisclosureApp.image_path(last_name + '.png')
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
