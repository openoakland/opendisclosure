import glob
import os

csv_files_for_2011 = glob.glob("*2011*.csv")

for filename in csv_files_for_2011:
  filename_wildcard_expression = filename.replace("2011","*")
  output_filename = filename.replace("2011","")
  os.system("awk 'FNR==1 && NR!=1{next;}{print}' " + filename_wildcard_expression + "> " + output_filename)

