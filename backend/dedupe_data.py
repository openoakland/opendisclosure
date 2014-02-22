from os import path
import dedupe
import sqlite3
import logging
from itertools import product, islice
from numpy import nan
import pdb

db = sqlite3.connect('db.sqlite3')
db.row_factory = sqlite3.Row
logging.basicConfig(level=logging.INFO)

def differenceComparator(one, two):
    if not one or not two:
        return nan
    else:
        return abs(one - two)

def getIndividuals(db):
    training_file = 'training.json'
    c = db.cursor()
    c.execute('select * from individuals order by name asc;')

    # Training

    deduper = dedupe.Dedupe({'name': { 'type': 'String' },
                             'city': { 'type': 'String' },
                             'state': { 'type': 'String' },
                             'zip': { 'type': 'Custom',
                                      'comparator' : differenceComparator },
                             'occupation' : { 'type' : 'String' },
                             'employer' : { 'type' : 'String' } })

    data = [dedupe.core.frozendict(x) for x in c.fetchall()]
    training_data = [(e, data[i - 1]) for i, e in enumerate(data)][1:]

    if path.exists(training_file):
        deduper.train(training_data, training_file)

    while True:
        try:
            deduper.train(training_data, dedupe.training.consoleLabel)
            deduper.writeTraining('training.json')

            # Try blocking, if it doesn't work, ask the user for some more
            blocker = deduper.blockingFunction(ppc=0.001, uncovered_dupes=5)
            break
        except ValueError:
            pass

    # Blocking

    data_index = [(row['id'], row) for row in data]
    blocker.tfIdfBlocks(data_index)
    data_index = dict(data_index)

    def block_data():
        for id, row in data_index:
            for key in blocker((id, row)):
                yield (key, id)

    b_data = block_data()

    # Clustering
    threshold = deduper.goodThreshold([data_index], 0.1)
    print "Using Threshold " + str(threshold)
    clustered_dupes = deduper.duplicateClusters([data_index], threshold)
    for cluster_set in clustered_dupes:
        print "============"
        for person in cluster_set:
            print data_index[person]

if __name__ == '__main__':
    getIndividuals(db)
