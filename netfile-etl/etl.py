import xlrd
import os
import glob

xlsx_files_in_current_dir = glob.glob("*.xlsx")

for excel_filename in xlsx_files_in_current_dir:
  print "Opening " + excel_filename + "..."
  workbook = xlrd.open_workbook("./" + excel_filename)
  filename_without_extension = excel_filename.split(".")[0]
  sheet_names = workbook.sheet_names()
  for sheet_name in sheet_names:
    csv_filename = filename_without_extension + "_" +sheet_name + ".csv"
    print "Writing " + csv_filename
    os.system("in2csv " + excel_filename + " --sheet " + "\"" + sheet_name + "\"" + " > " + csv_filename)
