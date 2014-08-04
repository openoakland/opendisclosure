import os
import datetime

current_year = datetime.datetime.now().year
years_with_data = range(2011, current_year + 1)
remote_path = "https://ssl.netfile.com/pub2/excel/COAKBrowsable/"

for year in years_with_data:
  print "Downloading " + str(year) + " data..."
  filename_for_year = "efile_newest_COAK_" + str(year) + ".zip"
  os.system("curl -f -L -O " + remote_path + filename_for_year)
  os.system("unzip " + filename_for_year)
  os.system("rm " + filename_for_year)
