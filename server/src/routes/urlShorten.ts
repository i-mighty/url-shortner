import mongoose from 'mongoose';
import {Express} from 'express';
import validUrl from 'valid-url';
import { Url } from '../models/UrlShorten/types';
import { shortBaseUrl } from '../utils/constants';
import { nanoid } from 'nanoid';

const Url = mongoose.model<Url>('Url');

module.exports = function (app: Express) {
  app.get('/:code', async (req, res) => {
    const urlCode = req.params.code;
    const item = await Url.findOne({ urlCode });
    if (item) {
      return res.redirect(item.originalUrl);
    } else {
      return res.status(404).json({
        message: 'Not found'
      });
    }
  });

  app.post('/url', async (req, res) => {
    const { originalUrl } = req.body;
    const updatedAt = new Date();
    const queryOptions = { originalUrl };
    if (validUrl.isUri(originalUrl)) {
      let urlData;
      let shortUrl;
      try {
        if (!urlData) {
          urlData = await Url.findOne(queryOptions);
        }

        if (urlData) {
          res.status(200).json(urlData);
        } else {
          const urlCode = nanoid(8);
          shortUrl = `${shortBaseUrl}/${urlCode}`;
          const itemToBeSaved = { originalUrl, shortUrl, urlCode, updatedAt };

          const item = new Url(itemToBeSaved);
          await item.save();
          res.status(200).json(itemToBeSaved);
        }
      } catch (err) {
        res.status(401).json(`Some error occurred.`);
      }
    } else {
      return res.status(401).json(`Invalid Original Url.`);
    }
  });

  app.post('/urls', async (req, res) => {
    // const offset = parseInt(req.query.offset?.toString() || '');
    const limit = parseInt(req.query.limit?.toString() || '');
    const page = parseInt(req.query.page?.toString() || '');
    try {
      const urlsPage = await Url.paginate({}, { limit, page });
      if (urlsPage.docs) {
        res.status(200).json({
          message: `success`,
          data: urlsPage,
        })
      } else {
        res.status(300).json({
          message: `No urls yet`
        })
      }
    } catch (error) {
      console.log(error)
      return res.status(401).json({
        message: `Couldn't fetch the shortened urls.`
      })
    }
  })

  app.get('/error/not-found', async (req, res) => {
    res.status(200).json({
      message: 'success',
      data: 'URL not found'
    })
  });
}