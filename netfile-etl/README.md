# Netfile ETL

A simple ETL system to process .zip files from the [Netfile](https://www.netfile.com/) campaign finance filing system into individual CSVs per form.

## What It Does

This is a simple set of Python scripts which does a few things:

1. Downloads and unzips the .zip files containing the campaign finance data from the folder Netfile set up for Oakland ([download_and_unzip_files.py](download_and_unzip_files.py))

2. Extracts the individual sheets from each Excel workbook as standalone CSVs ([etl.py](etl.py))

3. Combines the sheets for each "form" (for example, "A-Contributions") across all years, yielding a single CSV with all years' data for each individual form ([merge_csvs_across_years.py](merge_csvs_across_years.py))

These scripts replicate a similar process used by the San Francisco Ethics Commission to consolidate the campaign finance data and get it into a shape where it can be loaded onto its open data portal.

## Notes on Reuse

These scripts can pretty easily be modified for your own use. You will need to do a few things:

1. Ask Netfile to set up a public web directory with the raw .zip files usually served via their form.
2. In [download_and_unzip_files.py](download_and_unzip_files.py), edit `remote_path` to reflect your own directory URL from Netfile.
3. Edit that same file, changing the 2011 in `years_with_data` if you want to start from a year other than 2011.

## Getting Started

This is a set of Unix shell scripts intended to run on a \*nixy system like Linux or Mac OSX. It has been tested and works on both OSX 10.7 and Ubuntu 13.02.

### Installing Dependencies

#### System Dependencies

There are two system dependencies: `curl` and `unzip`.

Use your local package management system to install these. For example, on Ubuntu, do this by running:

```
apt-get install curl
apt-get install unzip
```

(On OSX using Homebrew is recommended.)

#### Python Dependencies

These are Python scripts and so require that language to be installed (it has been tested with 2.7.)

Additionally, you will need to install `csvkit`. The easiest way to do this is using the `pip` Python package management software.

On a fresh Ubuntu system, you can do this by running:

```
apt-get install python-pip
pip install csvkit
```

### Running

You can run the scripts by running the `run_all.sh` script.

### Cron Note

When running as a cron job, we encountered an issue of cron being unable to find the `in2csv` program. We fixed this by modifying that part of the script, changing "in2csv" on line 15 to the full path of where it was installed, such as "/opt/local/in2csv". (You can find the full path by running `which in2csv`.)

### Running on Windows with Vagrant

You can run these scripts on a Windows computer by using the excellent Vagrant virtual machine stack. For instructions, [click here](https://github.com/daguar/netfile-etl/issues/2).

## Oakland's Setup

The current (alpha) setup in Oakland is:1

1. The scripts are run nightly via a cron job on an Ubuntu virtual machine, running on a city staffer's Windows desktop using the wonderful Vagrant (see above)
2. The scripts dump the data to a folder shared with the Windows host machine (via the `/vagrant` folder in the virtual machine)
3. We use [Socrata DataSync](http://support.socrata.com/entries/24241271-Setting-up-a-basic-DataSync-job) to upload the CSVs from that local folder to the Socrata open data portal
4. Windows Task Scheduler is used (see [tutorial here](http://support.socrata.com/entries/24234461-Scheduling-a-DataSync-job-using-Windows-Task-Scheduler)) to automatically re-upload new files every day

## Copyright & License

Copyright Dave Guarino, 2014
BSD License

This code was written by Dave (OpenOakland) in partnership with the City of Oakland, CA's Public Ethics Commission. Thanks go to the PEC's Lauren Angius for being willing to try an open source approach to this problem.
