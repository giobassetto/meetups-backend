import { parseISO, startOfHour, isBefore } from 'date-fns';
import * as Yup from 'yup';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const { title, description, location, date } = req.body;

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Invalid date, Past dates' });
    }

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      user_id: req.userId,
      image_id: req.body.image_id && req.body.image_id,
    });

    return res.json({ meetup, message: 'OK' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      file_id: Yup.number(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Not permited arguments' });
    }
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(401).json('Past date not permited editing');
    }
    await meetup.update(req.body);

    return res.json({ meetup });
  }

  async destroy(req, res) {
    const { id } = req.params;
    const meetup = await Meetup.findOne({ id });

    if (meetup.date < new Date()) {
      return res.json({ error: 'Date past, cannot erase' });
    }

    await meetup.destroy();

    return res.json({ meetup });
  }
}

export default new MeetupController();
