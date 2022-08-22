/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from "next";
import faunaClient, { q } from "../../../../lib/fauna/faunaClient";

const openStream = (req: NextApiRequest, res: NextApiResponse) => {

  const setRef = q.Documents(q.Collection('meterReadings'));

  console.log('startStream!')
  const collectionStream = faunaClient.stream(setRef, {
    fields: ['action', 'document', 'index', 'prev', 'diff']
  });

  const streamAndData = {
    stream: collectionStream
  }

  collectionStream
    .on('start', (data, event) => console.log('meterReading stream started: ', data, event))
    .on('set', (data, event) => console.log('meterReading stream set: ', data, event))
    .on('version', (data, event) => console.log('meterReading stream version: ', data, event))
    .on('history_rewrite', (data, event) => 
      console.log('meterReading stream history_rewrite: ', data, event)
    )
    .on('error', error => {
      console.log('meterReading stream error: ', error);
      res.status(500).json({ message: 'Stream failed' });
    });

  collectionStream.start();

  console.log(collectionStream);
  res.status(200).json({ message: 'Stream started' })

}

export default openStream;
