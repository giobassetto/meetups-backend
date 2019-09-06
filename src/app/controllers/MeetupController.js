import { parseISO, startOfHour, isBefore } from 'date-fns';
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
